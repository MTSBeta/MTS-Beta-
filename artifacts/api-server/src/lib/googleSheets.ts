import { google } from "googleapis";

const SHEET_ID = process.env["GOOGLE_SHEET_ID"] ?? "";
const SERVICE_ACCOUNT_EMAIL = process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] ?? "";
const PRIVATE_KEY_ID = process.env["GOOGLE_PRIVATE_KEY_ID"] ?? "";

/** Normalise the private key — handles all encoding variants from Replit Secrets */
function normalizePrivateKey(raw: string): string {
  let key = raw;
  // 1. If JSON-quoted, parse it
  const trimmed = key.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { key = JSON.parse(trimmed); } catch { /* ignore */ }
  }
  // 2. Replace literal backslash-n sequences (Replit stores secrets with \\n)
  key = key.replace(/\\n/g, "\n");
  // 3. Trim each line
  key = key.split("\n").map(l => l.trim()).join("\n").trim();
  // 4. If there are no PEM headers, wrap the raw base64 body with them
  if (!key.includes("-----BEGIN PRIVATE KEY-----")) {
    // Strip any stray whitespace/newlines from base64 body
    const b64 = key.replace(/\s/g, "");
    // Re-wrap at 64 chars per line (standard PEM)
    const wrapped = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
    key = `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
  }
  return key;
}

const PRIVATE_KEY = normalizePrivateKey(process.env["GOOGLE_PRIVATE_KEY"] ?? "");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

// Tab names → human-readable
export const TABS = {
  README:                "README",
  LISTS:                 "Lists",
  PLAYERS:               "Players",
  CONTRIBUTORS:          "Contributors",
  QUESTION_BANK:         "Question_Bank",
  RESPONSE_LOG:          "Response_Log",
  IMAGE_ASSET_REGISTER:  "Image_Asset_Register",
  WORKFLOW_STATUS:       "Workflow_Status",
  PLAYER_360_SUMMARY:    "Player_360_Summary",
  STORY_BLUEPRINT:       "Story_Blueprint",
} as const;

function getAuth() {
  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    keyId: PRIVATE_KEY_ID,
    scopes: SCOPES,
  });
}

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

/** Check if credentials are configured */
export function isSheetsConfigured(): boolean {
  return !!(SHEET_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

/** Test the connection — returns true if successful */
export async function testConnection(): Promise<{ ok: boolean; error?: string; tabsFound?: string[] }> {
  if (!isSheetsConfigured()) {
    return { ok: false, error: "Google Sheets credentials not configured. Add GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY to environment." };
  }
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const tabsFound = (res.data.sheets ?? []).map(s => s.properties?.title ?? "");
    return { ok: true, tabsFound };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? String(err) };
  }
}

/** Append rows to a named tab */
async function appendRows(tab: string, rows: (string | number | boolean | null)[][]): Promise<void> {
  if (!isSheetsConfigured()) return;
  try {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows },
    });
  } catch (err) {
    console.error(`[sheets] appendRows(${tab}) failed:`, err);
  }
}

/** Read all rows from a named tab */
async function readRows(tab: string): Promise<string[][]> {
  if (!isSheetsConfigured()) return [];
  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A:ZZ`,
    });
    return (res.data.values as string[][]) ?? [];
  } catch (err) {
    console.error(`[sheets] readRows(${tab}) failed:`, err);
    return [];
  }
}

/** Find the row number (1-indexed) where column A matches a value. Returns -1 if not found. */
async function findRowByColA(tab: string, value: string): Promise<number> {
  const rows = await readRows(tab);
  for (let i = 1; i < rows.length; i++) { // skip header row
    if (rows[i]?.[0] === value) return i + 1; // 1-indexed sheet row
  }
  return -1;
}

/** Update a specific row (1-indexed) in a tab */
async function updateRow(tab: string, rowNum: number, values: (string | number | boolean | null)[]): Promise<void> {
  if (!isSheetsConfigured()) return;
  try {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A${rowNum}`,
      valueInputOption: "RAW",
      requestBody: { values: [values] },
    });
  } catch (err) {
    console.error(`[sheets] updateRow(${tab}, ${rowNum}) failed:`, err);
  }
}

// ─── Public helpers ────────────────────────────────────────────────────────

/**
 * Sync a player record to the Players tab.
 * Creates a new row if not found, updates the existing one if found.
 */
export async function syncPlayer(player: {
  id: string;
  playerName: string;
  academyKey: string;
  academyName: string;
  ageGroup: string | null;
  position: string;
  secondPosition?: string | null;
  shirtNumber?: number | null;
  accessCode: string;
  parentCode?: string | null;
  status: string;
}): Promise<void> {
  const row: (string | number | null)[] = [
    player.accessCode,          // Player ID (access code used as the sheet's player ID)
    player.parentCode ?? "",    // Parent Code
    player.playerName,          // Player Name
    player.academyName,         // Club
    player.ageGroup ?? "",      // Age Band
    player.position,            // Primary Position
    player.secondPosition ?? "", // Secondary Position
    player.shirtNumber ?? "",   // Squad Number
    "",                         // Academy Package
    player.status,              // Portal Status
    "",                         // Player Journey Status
    "",                         // Coach Input Status
    "Yes",                      // Staff Layer Enabled
    "Yes",                      // Stakeholder Layer Enabled
    "",                         // Overall Completion %
    "",                         // Primary Staff Owner
    "",                         // Notes
  ];

  const existing = await findRowByColA(TABS.PLAYERS, player.accessCode);
  if (existing > 0) {
    await updateRow(TABS.PLAYERS, existing, row);
  } else {
    await appendRows(TABS.PLAYERS, [row]);
  }
}

/** Append responses to Response_Log */
export async function logResponses(entries: {
  playerId: string;
  playerName: string;
  role: string;          // player | parent | football_coaching | psychology | education | player_care | friend | ...
  contributorName?: string;
  questionId: string;
  stage: string;
  questionText: string;
  responseType: string;  // voice-text | multiselect | select | long-text | short-text
  responseValue: string;
  source: string;        // portal | staff-portal | stakeholder | parent-portal
}[]): Promise<void> {
  if (!entries.length) return;
  const now = new Date().toISOString();
  const rows = entries.map(e => [
    `${e.playerId}-${e.questionId}-${Date.now()}`, // Response ID
    now,                                            // Timestamp
    e.playerId,                                     // Player ID
    e.playerName,                                   // Player Name
    e.role,                                         // Role
    e.contributorName ?? "",                        // Contributor Name
    e.questionId,                                   // Question ID
    e.stage,                                        // Stage
    e.questionText,                                 // Question Text
    e.responseType,                                 // Response Type
    e.responseValue,                                // Response Value
    "submitted",                                    // Status
    "No",                                           // Needs Review?
    "",                                             // Story Tag
    e.source,                                       // Source
  ]);
  await appendRows(TABS.RESPONSE_LOG, rows);
}

/** Update or create a Workflow_Status row for a player */
export async function updateWorkflowStatus(player: {
  accessCode: string;
  playerName: string;
  status: string;
  journeyStatus?: string;
  coachInputStatus?: string;
  staffInputsStatus?: string;
  stakeholderStatus?: string;
}): Promise<void> {
  const row: (string | null)[] = [
    player.accessCode,
    player.playerName,
    player.status,
    player.journeyStatus ?? "",
    player.coachInputStatus ?? "",
    player.staffInputsStatus ?? "",
    player.stakeholderStatus ?? "",
    "",  // Images Ready
    "",  // Blueprint Status
    "",  // Assigned Author
    "",  // Draft Status
    "",  // Final QA
    player.status, // Workflow Stage
  ];

  const existing = await findRowByColA(TABS.WORKFLOW_STATUS, player.accessCode);
  if (existing > 0) {
    await updateRow(TABS.WORKFLOW_STATUS, existing, row);
  } else {
    await appendRows(TABS.WORKFLOW_STATUS, [row]);
  }
}

/** Register an image/media asset in Image_Asset_Register — full 16-field schema */
export async function registerImageAsset(asset: {
  playerId: string;
  playerCode: string;
  playerName: string;
  academyName: string;
  contributorRole: string;
  contributorName: string;
  imageType: string;
  originalFileName: string;
  mimeType: string;
  driveFileId: string;
  driveFileLink: string;
  driveFolderId: string;
  uploadSource: string;
  notes?: string;
}): Promise<void> {
  const now = new Date().toISOString();
  await appendRows(TABS.IMAGE_ASSET_REGISTER, [[
    asset.playerId,
    asset.playerCode,
    asset.playerName,
    asset.academyName,
    asset.contributorRole,
    asset.contributorName,
    asset.imageType,
    asset.originalFileName,
    asset.mimeType,
    asset.driveFileId,
    asset.driveFileLink,
    asset.driveFolderId,
    now,
    asset.uploadSource,
    "pending",         // approval_status
    asset.notes ?? "", // notes
  ]]);
}

/** Register a stakeholder/contributor in the Contributors tab */
export async function syncContributor(contributor: {
  id: string;
  playerId: string;
  playerName?: string;
  contributorName?: string;
  role: string;
  type: string;
  code: string;
  submitted: boolean;
}): Promise<void> {
  const row: (string | boolean | null)[] = [
    contributor.code,             // Contributor ID (use code as ID)
    contributor.playerId,         // Player ID
    contributor.contributorName ?? "", // Contributor Name
    contributor.role,             // Role
    contributor.type,             // Contributor Type
    "",                           // Email / Contact
    "Yes",                        // Invite Required?
    "Yes",                        // Invite Sent?
    contributor.submitted ? "Submitted" : "Pending", // Status
    "",                           // Notes
  ];

  const existing = await findRowByColA(TABS.CONTRIBUTORS, contributor.code);
  if (existing > 0) {
    await updateRow(TABS.CONTRIBUTORS, existing, row);
  } else {
    await appendRows(TABS.CONTRIBUTORS, [row]);
  }
}

/** Get recent rows from the Response_Log (last N rows) */
export async function getRecentResponseLogs(limit = 20): Promise<string[][]> {
  const rows = await readRows(TABS.RESPONSE_LOG);
  const header = rows[0] ?? [];
  const data = rows.slice(1);
  const recent = data.slice(-limit);
  return [header, ...recent];
}

import { google } from "googleapis";
import { Readable } from "stream";

const SERVICE_ACCOUNT_EMAIL = process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] ?? "";
const PRIVATE_KEY_ID = process.env["GOOGLE_PRIVATE_KEY_ID"] ?? "";
const ROOT_FOLDER_ID = process.env["GOOGLE_DRIVE_FOLDER_ID"] ?? "1Lk6-18xcNw7llQ2TjvoNfGDSLcCCf4VR";

/** Normalise private key — identical logic to googleSheets.ts */
function normalizePrivateKey(raw: string): string {
  let key = raw;
  const trimmed = key.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { key = JSON.parse(trimmed); } catch { /* ignore */ }
  }
  key = key.replace(/\\n/g, "\n");
  key = key.split("\n").map(l => l.trim()).join("\n").trim();
  if (!key.includes("-----BEGIN PRIVATE KEY-----")) {
    const b64 = key.replace(/\s/g, "");
    const wrapped = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
    key = `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
  }
  return key;
}

const PRIVATE_KEY = normalizePrivateKey(process.env["GOOGLE_PRIVATE_KEY"] ?? "");

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];

function getAuth() {
  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    keyId: PRIVATE_KEY_ID,
    scopes: SCOPES,
  });
}

function getDriveClient() {
  return google.drive({ version: "v3", auth: getAuth() });
}

export function isDriveConfigured(): boolean {
  return !!(SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY && ROOT_FOLDER_ID);
}

/**
 * Find a subfolder by name inside a parent folder.
 * supportsAllDrives: true — works for both personal Drive and Shared Drives.
 */
async function findFolder(parentId: string, name: string): Promise<string | null> {
  const drive = getDriveClient();
  const safeName = name.replace(/'/g, "\\'");
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${safeName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });
  return res.data.files?.[0]?.id ?? null;
}

/**
 * Create a subfolder inside a parent folder.
 */
async function createFolder(parentId: string, name: string): Promise<string> {
  const drive = getDriveClient();
  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });
  if (!res.data.id) throw new Error(`Failed to create folder: ${name}`);
  return res.data.id;
}

/**
 * Find or create a folder by name inside a parent.
 */
async function ensureFolder(parentId: string, name: string): Promise<string> {
  const existing = await findFolder(parentId, name);
  if (existing) return existing;
  return createFolder(parentId, name);
}

export interface DriveUploadResult {
  fileId: string;
  fileLink: string;
  folderId: string;
  folderLink: string;
}

export interface DriveUploadOptions {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  academyName: string;
  playerCode: string;
}

/**
 * Upload a file to Google Drive under:
 *   ROOT_FOLDER / academy_name / player_code / filename
 *
 * Uses supportsAllDrives: true — works for personal shared folders and Shared Drives.
 * The root folder MUST be shared with the service account email as Editor.
 */
export async function uploadToDrive(opts: DriveUploadOptions): Promise<DriveUploadResult> {
  if (!isDriveConfigured()) {
    throw new Error("Google Drive credentials not configured.");
  }

  const drive = getDriveClient();

  // Sanitise folder names
  const sanitize = (s: string) => s.replace(/[\/\\:*?"<>|]/g, "_").trim() || "Unknown";
  const academyFolder = sanitize(opts.academyName);
  const playerFolder  = sanitize(opts.playerCode);

  // Ensure folder hierarchy: root → academy → player
  const academyFolderId = await ensureFolder(ROOT_FOLDER_ID, academyFolder);
  const playerFolderId  = await ensureFolder(academyFolderId, playerFolder);

  // Upload the file
  const stream = Readable.from(opts.fileBuffer);
  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: opts.fileName,
      parents: [playerFolderId],
    },
    media: {
      mimeType: opts.mimeType,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  const fileId = res.data.id;
  if (!fileId) throw new Error("Drive upload returned no file ID");

  // Make the file readable by anyone with the link
  await drive.permissions.create({
    fileId,
    supportsAllDrives: true,
    requestBody: { role: "reader", type: "anyone" },
  });

  const fileLink = res.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`;
  const folderLink = `https://drive.google.com/drive/folders/${playerFolderId}`;

  return { fileId, fileLink, folderId: playerFolderId, folderLink };
}

/** Test Drive connectivity */
export async function testDriveConnection(): Promise<{ ok: boolean; error?: string; rootFolderName?: string; isSharedDrive?: boolean }> {
  if (!isDriveConfigured()) {
    return { ok: false, error: "Google Drive credentials not configured." };
  }
  try {
    const drive = getDriveClient();
    const res = await drive.files.get({
      fileId: ROOT_FOLDER_ID,
      fields: "id, name, driveId",
      supportsAllDrives: true,
    });
    return {
      ok: true,
      rootFolderName: res.data.name ?? ROOT_FOLDER_ID,
      isSharedDrive: !!(res.data as any).driveId,
    };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? String(err) };
  }
}

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/api$/, '/api');

function getToken(): string | null {
  return localStorage.getItem('metime_internal_token');
}

async function internalFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('metime_internal_token');
    window.location.href = `${import.meta.env.BASE_URL}internal/login`.replace(/\/+/g, '/');
  }
  return res;
}

// ─── Types ───────────────────────────────────────────────

export interface ProjectRow {
  playerId: string;
  playerName: string;
  accessCode: string;
  academy: string;
  academyKey: string;
  ageGroup: string | null;
  position: string;
  playerStatus: string;
  storyStatus: string;
  assignedAuthor: string | null;
  assignedIllustrator: string | null;
  updatedAt: string;
  academyPreviewEnabled: boolean;
  finalApproved: boolean;
  projectId: number | null;
  completeness: {
    intakeComplete: boolean;
    coachInputPresent: boolean;
    stakeholderPresent: boolean;
    journeyResponseCount: number;
  };
  completenessScore: number;
  createdAt: string;
}

export interface StoryProject {
  id: number;
  playerId: string;
  status: string;
  assignedAuthor: string | null;
  assignedIllustrator: string | null;
  draftVersion: number;
  academyPreviewEnabled: boolean;
  academyApproved: boolean;
  finalApproved: boolean;
  lastEditedBy: string | null;
  editorNotes: string | null;
  revisionNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerProfile {
  id: string;
  playerName: string;
  age: number;
  ageGroup: string | null;
  position: string;
  secondPosition: string | null;
  shirtNumber: number;
  academyKey: string;
  academyName: string;
  accessCode: string;
  status: string;
}

export interface JourneyResponse {
  id: number;
  playerId: string;
  stage: string;
  questionNumber: number;
  questionText: string;
  answerText: string;
  audioUrl: string | null;
  mediaUrls: string[];
  createdAt: string;
}

export interface StoryBlueprint {
  id: number;
  projectId: number;
  coreIdentity: string | null;
  emotionalChallenge: string | null;
  falseBelief: string | null;
  hiddenStrength: string | null;
  supportFigure: string | null;
  academyValues: string | null;
  keyFootballTest: string | null;
  turningPoint: string | null;
  lessonTheme: string | null;
  endingTransformation: string | null;
  symbolicObject: string | null;
  parentResonanceNote: string | null;
  coachResonanceNote: string | null;
  updatedAt: string;
}

export interface StoryScene {
  id: number;
  projectId: number;
  sceneNumber: number;
  title: string | null;
  manuscript: string | null;
  sceneNotes: string | null;
  emotionalBeat: string | null;
  updatedAt: string;
}

export interface DetailTrackerItem {
  id: number;
  projectId: number;
  itemKey: string;
  itemLabel: string;
  itemValue: string | null;
  usageStatus: 'unused' | 'partially_used' | 'clearly_used';
  updatedAt: string;
}

export interface ProductionNote {
  id: number;
  projectId: number;
  noteType: string;
  content: string;
  createdBy: string | null;
  createdAt: string;
}

export interface IllustrationAsset {
  id: number;
  projectId: number;
  sceneNumber: number | null;
  fileName: string | null;
  driveFileId: string | null;
  driveLink: string | null;
  assetType: string;
  approved: boolean;
  illustratorNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── API Calls ────────────────────────────────────────────

export async function fetchProjects(params?: {
  search?: string;
  academy?: string;
  status?: string;
  author?: string;
}): Promise<{ projects: ProjectRow[]; academies: { key: string; name: string }[] }> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.academy) qs.set('academy', params.academy);
  if (params?.status) qs.set('status', params.status);
  if (params?.author) qs.set('author', params.author);
  const res = await internalFetch(`/internal/projects?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(playerId: string): Promise<{ project: StoryProject; player: PlayerProfile }> {
  const res = await internalFetch(`/internal/projects/${playerId}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function updateProject(playerId: string, updates: Partial<StoryProject>): Promise<{ project: StoryProject }> {
  const res = await internalFetch(`/internal/projects/${playerId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function fetchPlayerProfile(playerId: string): Promise<{
  player: PlayerProfile;
  project: Partial<StoryProject>;
  journeyByStage: Record<string, JourneyResponse[]>;
  journeyResponses: JourneyResponse[];
  staffByRole: Record<string, any[]>;
  staffSubmissions: any[];
  stakeholderLinks: any[];
  stakeholderResponses: any[];
  media: { images: string[]; voiceNotes: any[]; stakeholderVoiceNotes: any[] };
}> {
  const res = await internalFetch(`/internal/projects/${playerId}/profile`);
  if (!res.ok) throw new Error('Failed to fetch player profile');
  return res.json();
}

export async function fetchBlueprint(playerId: string): Promise<{ blueprint: StoryBlueprint | null; projectId: number }> {
  const res = await internalFetch(`/internal/projects/${playerId}/blueprint`);
  if (!res.ok) throw new Error('Failed to fetch blueprint');
  return res.json();
}

export async function saveBlueprint(playerId: string, fields: Partial<StoryBlueprint>): Promise<{ blueprint: StoryBlueprint }> {
  const res = await internalFetch(`/internal/projects/${playerId}/blueprint`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('Failed to save blueprint');
  return res.json();
}

export async function fetchScenes(playerId: string): Promise<{ scenes: StoryScene[]; projectId: number }> {
  const res = await internalFetch(`/internal/projects/${playerId}/scenes`);
  if (!res.ok) throw new Error('Failed to fetch scenes');
  return res.json();
}

export async function saveScene(playerId: string, sceneNumber: number, fields: Partial<StoryScene>): Promise<{ scene: StoryScene }> {
  const res = await internalFetch(`/internal/projects/${playerId}/scenes/${sceneNumber}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('Failed to save scene');
  return res.json();
}

export async function fetchTracker(playerId: string): Promise<{ items: DetailTrackerItem[]; projectId: number }> {
  const res = await internalFetch(`/internal/projects/${playerId}/tracker`);
  if (!res.ok) throw new Error('Failed to fetch tracker');
  return res.json();
}

export async function updateTrackerItem(
  playerId: string,
  itemKey: string,
  updates: { usageStatus?: string; itemValue?: string }
): Promise<{ item: DetailTrackerItem }> {
  const res = await internalFetch(`/internal/projects/${playerId}/tracker/${itemKey}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update tracker item');
  return res.json();
}

export async function fetchNotes(playerId: string): Promise<{ notes: ProductionNote[]; projectId: number }> {
  const res = await internalFetch(`/internal/projects/${playerId}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function addNote(playerId: string, content: string, noteType = 'general'): Promise<{ note: ProductionNote }> {
  const res = await internalFetch(`/internal/projects/${playerId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content, noteType }),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
}

export async function fetchIllustrations(playerId: string): Promise<{ assets: IllustrationAsset[]; projectId: number }> {
  const res = await internalFetch(`/internal/projects/${playerId}/illustrations`);
  if (!res.ok) throw new Error('Failed to fetch illustrations');
  return res.json();
}

export async function addIllustrationAsset(playerId: string, asset: {
  fileName?: string;
  driveLink?: string;
  assetType?: string;
  sceneNumber?: number;
  illustratorNotes?: string;
}): Promise<{ asset: IllustrationAsset }> {
  const res = await internalFetch(`/internal/projects/${playerId}/illustrations`, {
    method: 'POST',
    body: JSON.stringify(asset),
  });
  if (!res.ok) throw new Error('Failed to add asset');
  return res.json();
}

export async function updateIllustrationAsset(
  playerId: string,
  assetId: number,
  updates: { approved?: boolean; illustratorNotes?: string; sceneNumber?: number; assetType?: string }
): Promise<{ asset: IllustrationAsset }> {
  const res = await internalFetch(`/internal/projects/${playerId}/illustrations/${assetId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update asset');
  return res.json();
}

export const STORY_STATUSES = [
  { value: 'intake_in_progress', label: 'Intake In Progress', color: '#6b7280' },
  { value: 'intake_complete', label: 'Intake Complete', color: '#3b82f6' },
  { value: 'profile_ready', label: 'Profile Ready', color: '#8b5cf6' },
  { value: 'blueprint_in_progress', label: 'Blueprint In Progress', color: '#f59e0b' },
  { value: 'draft_in_progress', label: 'Draft In Progress', color: '#f97316' },
  { value: 'internal_review', label: 'Internal Review', color: '#ec4899' },
  { value: 'academy_preview', label: 'Academy Preview', color: '#06b6d4' },
  { value: 'revisions_in_progress', label: 'Revisions In Progress', color: '#ef4444' },
  { value: 'approved', label: 'Approved', color: '#10b981' },
  { value: 'ready_for_illustration', label: 'Ready for Illustration', color: '#84cc16' },
  { value: 'illustration_in_progress', label: 'Illustration In Progress', color: '#a3e635' },
  { value: 'final_ready', label: 'Final Ready', color: '#22c55e' },
] as const;

export function getStatusMeta(value: string) {
  return STORY_STATUSES.find((s) => s.value === value) ?? { value, label: value, color: '#6b7280' };
}

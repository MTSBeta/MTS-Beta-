const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/api$/, '/api');

function getToken(): string | null {
  return localStorage.getItem('staff_token');
}

async function staffFetch(path: string, options: RequestInit = {}): Promise<Response> {
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
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_user');
    window.location.href = `${import.meta.env.BASE_URL}staff-login`.replace(/\/+/g, '/');
  }
  return res;
}

export interface StaffUser {
  id: number;
  academyId: number;
  academyName: string;
  academyPrimaryColor: string;
  academySecondaryColor: string;
  academyAccentColor: string | null;
  academyCrestUrl: string | null;
  academyLogoText: string;
  academyWelcomeMessage: string;
  academyChantUrl: string | null;
  name: string;
  email: string;
  role: string;
  questionRole: string | null;
  jobTitle: string;
  isActive: boolean;
}

export interface StaffLoginResponse {
  token: string;
  user: StaffUser;
}

export async function staffLogin(email: string, password: string): Promise<StaffLoginResponse> {
  const res = await fetch(`${API_BASE}/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(data.error || 'Invalid credentials');
  }
  return res.json();
}

export interface StaffPlayer {
  id: string;
  playerName: string;
  age: number;
  position: string;
  ageGroup: string;
  shirtNumber: number;
  status: string;
  parentCode?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function fetchStaffPlayers(): Promise<StaffPlayer[]> {
  const res = await staffFetch('/staff/players');
  if (!res.ok) throw new Error('Failed to fetch players');
  return res.json();
}

export interface StaffPlayerProfile {
  player: StaffPlayer & { academyName: string; academyKey: string; accessCode: string };
  journeyResponses: Array<{
    stage: string;
    questionNumber: number;
    questionText: string;
    answerText: string;
    audioUrl?: string | null;
    mediaUrls?: string[];
  }>;
  parentSubmission: {
    submitted: boolean;
    responses?: Array<{
      questionNumber: number;
      questionText: string;
      answerText: string;
    }>;
  } | null;
  staffSubmissions: Array<{
    id: number;
    staffId: number;
    staffName: string;
    role: string;
    responses: Array<{
      questionNumber: number;
      questionText: string;
      answerText: string;
    }>;
    createdAt: string;
    updatedAt?: string;
  }>;
  completionStatus: {
    journey: boolean;
    parent: boolean;
    footballCoaching: boolean;
    psychology: boolean;
    education: boolean;
    playerCare: boolean;
  };
}

export async function fetchStaffPlayerProfile(playerId: string): Promise<StaffPlayerProfile> {
  const res = await staffFetch(`/staff/players/${playerId}`);
  if (!res.ok) throw new Error('Failed to fetch player profile');
  return res.json();
}

export interface StaffSubmissionPayload {
  playerId: string;
  role?: string;
  responses: Array<{
    questionNumber: number;
    questionText: string;
    answerText: string;
  }>;
}

export async function createStaffSubmission(data: StaffSubmissionPayload): Promise<{ id: number }> {
  const res = await staffFetch('/staff/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save submission');
  return res.json();
}

export async function updateStaffSubmission(id: number, data: StaffSubmissionPayload): Promise<{ id: number }> {
  const res = await staffFetch(`/staff/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update submission');
  return res.json();
}

export interface StaffMember {
  id: number;
  name: string;
  fullName: string;
  email: string;
  role: string;
  systemRole: string;
  questionRole: string | null;
  jobTitle: string;
  teamName: string | null;
  ageGroup: string | null;
  isActive: boolean;
  createdAt: string;
}

export async function fetchStaffTeam(): Promise<StaffMember[]> {
  const res = await staffFetch('/staff/team');
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  systemRole: string;
  questionRole: string | null;
  jobTitle: string;
  teamName?: string;
  ageGroup?: string;
}

export async function createStaffMember(data: CreateStaffPayload): Promise<StaffMember> {
  const res = await staffFetch('/staff/team', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create staff' }));
    throw new Error(err.error || 'Failed to create staff member');
  }
  return res.json();
}

export async function toggleStaffActive(staffId: number, isActive: boolean): Promise<void> {
  const res = await staffFetch(`/staff/team/${staffId}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) throw new Error('Failed to toggle staff status');
}

export async function fetchParentView(code: string): Promise<{
  playerName: string;
  academyName: string;
  position: string;
  age: number;
  questions: Array<{ questionNumber: number; questionText: string }>;
  submitted: boolean;
}> {
  const res = await fetch(`${API_BASE}/parent/${code}`);
  if (!res.ok) throw new Error('Invalid or expired link');
  return res.json();
}

export interface AcademyBranding {
  id: number;
  name: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string | null;
  crestUrl: string | null;
  welcomeMessage: string;
  chantUrl: string | null;
}

export async function fetchAcademyBranding(): Promise<AcademyBranding> {
  const res = await staffFetch('/staff/academy');
  if (!res.ok) throw new Error('Failed to fetch academy settings');
  return res.json();
}

export async function updateAcademyBranding(data: Partial<Omit<AcademyBranding, 'id' | 'name'>>): Promise<AcademyBranding> {
  const res = await staffFetch('/staff/academy', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update settings' }));
    throw new Error(err.error || 'Failed to update academy settings');
  }
  return res.json();
}

export async function submitParentResponses(code: string, responses: Array<{
  questionNumber: number;
  questionText: string;
  answerText: string;
}>): Promise<void> {
  const res = await fetch(`${API_BASE}/parent/${code}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses }),
  });
  if (!res.ok) throw new Error('Failed to submit responses');
}

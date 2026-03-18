# MeTime Stories — Football Academy Player Portal

## Overview

A white-labelled football academy player development portal. Young players complete a guided 6-stage reflection journey, with separate forms for parent and coach perspectives. All data is stored in PostgreSQL.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifact: `player-portal`) at path `/`
- **Backend**: Express 5 (artifact: `api-server`) at path `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Forms**: React Hook Form + Zod resolvers
- **Animations**: Framer Motion
- **Routing**: Wouter

## Structure

```text
artifacts/
├── api-server/         # Express API server
│   └── src/
│       ├── routes/     # academies, players, journey, parent, coach, admin, staff*
│       ├── middlewares/ # staffAuth (JWT auth + role gating)
│       └── lib/        # auth (bcrypt+JWT), codeGenerator, seedAcademies
└── player-portal/      # React + Vite frontend
    └── src/
        ├── pages/      # Home, Register, Welcome, Journey, Invite, Complete, ParentForm, CoachForm, Admin, ParentView
        │   └── staff/  # StaffLogin, StaffDashboard, StaffPlayers, StaffPlayerProfile, StaffTeam, StaffSettings
        ├── layouts/    # StaffLayout (sidebar nav with academy branding)
        ├── components/ # Layout, Button, Input, Textarea, ProtectedStaffRoute, etc.
        ├── context/    # PlayerContext, StaffAuthContext (JWT auth)
        ├── hooks/      # useStaffAuth
        ├── lib/        # utils.ts, staffApi.ts (staff API client with JWT)
        └── data/       # academies.ts, positions.ts, questions.ts, staffQuestions.ts
lib/
├── api-spec/           # OpenAPI spec + Orval codegen
├── api-client-react/   # Generated React Query hooks
├── api-zod/            # Generated Zod schemas
└── db/
    └── src/schema/     # academies, players, journeyResponses, parentResponses, academyStaff, staffSubmissions
```

## Routes

### Frontend Routes — Player Journey
- `/` — Landing: academy selection + "Academy Staff Login" entry point
- `/register` — Player registration form
- `/welcome` — Post-registration welcome screen
- `/journey` — 6-stage multi-step reflection form
- `/invite` — Parent & coach link generation
- `/complete` — Completion summary
- `/parent/:code` — Parent perspective form (secure link, no login required)
- `/coach/:code` — Coach perspective form
- `/admin` — Admin dashboard (passcode-gated)

### Frontend Routes — Staff Portal
- `/staff-login` — Staff email + password login
- `/staff-dashboard` — Staff welcome card, player counts, recent activity (protected)
- `/staff/players` — Filterable/searchable player list with age group, position, status (protected)
- `/staff/players/:id` — Full player profile with journey, parent, staff submissions, completion tracker (protected)
- `/staff/team` — Admin-only team management: list/create staff, toggle active/inactive (protected)
- `/staff/settings` — Admin-only placeholder settings page (protected)

### Frontend Routes — Story Production Workspace (`/internal/stories/*`)
All routes JWT-protected via `ProtectedStaffRoute`. Dark editorial UI with violet accent (#a78bfa). Layout: `InternalLayout.tsx`.
- `/internal/stories` — Cross-academy dashboard: all players, completeness bars, filters by academy/status/author
- `/internal/stories/:playerId/profile` — 8 collapsible data sections + raw JSON drawer
- `/internal/stories/:playerId/blueprint` — 13-field narrative blueprint with 2.5s auto-save
- `/internal/stories/:playerId/builder` — 6 scene cards (Vision → Storm → Rock Bottom → Rise → Wisdom → Next Level), each with guidance panel + manuscript area + 2s auto-save
- `/internal/stories/:playerId/illustrations` — Drive asset management by type (portrait, kit, scene, etc.) with approval workflow
- `/internal/stories/:playerId/notes` — Production notes (tabbed) + detail tracker (usage status: unused / partly / clearly)

### API Routes
- `GET /api/academies` — List all academies
- `POST /api/players` — Register a player
- `GET /api/players/:id` — Get player by ID
- `POST /api/players/:id/journey` — Save journey responses
- `PATCH /api/players/:id/journey/status` — Mark journey complete
- `GET /api/parent/:code` — Get player by parent code
- `POST /api/parent/:code` — Submit parent responses
- `GET /api/coach/:code` — Get player by coach code
- `POST /api/coach/:code` — Submit coach responses
- `GET /api/admin/players?passcode=X` — Admin list players
- `GET /api/admin/players/:id?passcode=X` — Admin full player profile

### Internal Story Production API Routes (JWT-protected, all staff)
- `GET /api/internal/projects` — All story projects cross-academy (filters: search, academy, status, author)
- `GET /api/internal/profile/:playerId` — Full player data: all responses + computed sections + media links
- `GET/PUT /api/internal/blueprint/:playerId` — Get/save 13-field narrative blueprint
- `GET /api/internal/scenes/:playerId` — All 6 scenes for a player
- `PUT /api/internal/scenes/:playerId/:sceneNumber` — Save a scene (manuscript + notes)
- `GET/PUT /api/internal/tracker/:playerId` — Detail tracker items + update usage status
- `GET/POST /api/internal/notes/:playerId` — Production notes (add/list)
- `GET /api/internal/illustrations/:playerId` — List illustration assets
- `POST /api/internal/illustrations/:playerId` — Add illustration asset
- `PUT /api/internal/illustrations/:playerId/:assetId` — Update/approve asset

### Staff API Routes (JWT-protected)
- `POST /api/staff/login` — Staff login (email + password → JWT)
- `GET /api/staff/me` — Current staff profile
- `GET /api/staff/players` — List players for staff's academy (filter by age_group, status, search)
- `GET /api/staff/players/:id` — Full player detail (journey, parent responses, staff submissions)
- `POST /api/staff/submissions` — Create staff submission
- `PUT /api/staff/submissions/:id` — Update staff submission (own only, unless admin)
- `GET /api/staff/team` — List team members (admin only)
- `POST /api/staff/team` — Create staff member (admin only, max 8 active)
- `PUT /api/staff/team/:id` — Update staff member (admin only)
- `DELETE /api/staff/team/:id` — Delete staff member (admin only)

## Database Tables

- `academies` — Academy config (key, name, colours, welcome message, max_staff_accounts)
- `players` — Player registrations (name, age, position, codes, age_group, parent_code)
- `player_journey_responses` — 6-stage journey answers (30 responses per player)
- `parent_responses` — Parent form answers (5 per player)
- `coach_responses` — Coach form answers (5 per player)
- `academy_staff` — Staff accounts (email, password_hash, academy_id, system_role, job_title, etc.)
- `staff_submissions` — Staff observations per player (role-based: coaching, psychology, education, player_care)

## Academy Keys (used in database)
`birmingham-city`, `chelsea`, `arsenal`, `liverpool`, `manchester-city`, `manchester-united`, `tottenham`, `newcastle`

## Demo Credentials

### Staff Portal — Arsenal Demo
- **Email**: `demo@arsenal-academy.co.uk`
- **Password**: `Demo2024!`
- **Role**: academy_admin (full access)

### Demo Players (Arsenal Academy)
8 players seeded at various journey stages:
| Player | Status | Access Code | Parent Code |
|--------|--------|------------|------------|
| Marcus Webb | story_complete | PLY-DEMO-001 | PAR-DEMO-001 |
| Jamie Torres | story_complete | PLY-DEMO-002 | PAR-DEMO-002 |
| Ethan Clarke | journey_complete | PLY-DEMO-003 | PAR-DEMO-003 |
| Noah Patel | journey_complete | PLY-DEMO-004 | PAR-DEMO-004 |
| Callum Hughes | journey_started | PLY-DEMO-005 | PAR-DEMO-005 |
| Declan Murphy | journey_started | PLY-DEMO-006 | PAR-DEMO-006 |
| Luca Ferrari | registered | PLY-DEMO-007 | PAR-DEMO-007 |
| Tyler Brooks | registered | PLY-DEMO-008 | PAR-DEMO-008 |

Marcus Webb and Jamie Torres have: full journey (30 responses) + parent submission + coaching & psychology staff observations.

### Academy Staff Registration
- **Arsenal Access Code**: `COACH-ARS-003` — used during `/admin-signup` to create new staff accounts
- Format for all academies: `COACH-XXX-NNN`

### Admin Dashboard
- **Passcode**: `metime2024`
- Access at `/admin?passcode=metime2024`

## Staff Auth
- JWT-based authentication via `STAFF_JWT_SECRET` env var
- Passwords hashed with bcryptjs
- Roles: `academy_admin`, `staff`
- Max 8 active staff per academy (configurable via `max_staff_accounts` column)

## Journey Stages
1. Dream — aspirations and inspiration
2. Storm — challenges and difficulties
3. Rock Bottom — lowest moments
4. Rise — comeback and resilience
5. Elite Wisdom — lessons learned
6. Next Level — future goals and vision

## White-labelling
Academy config is data-driven. Each academy has: `key`, `name`, `logoText`, `primaryColor`, `secondaryColor`, `welcomeMessage`. Add new academies via the `academies` table.

## Position Config
Each position (GK, RB, CB, LB, CDM, CM, CAM, RW, ST, LW, CF) maps to: `displayName`, `traits`, `archetype`, `mentalFocus`. Stored in `src/data/positions.ts` for future story generation use.

## Audio Configuration

### Welcome Screen Theme
- **Track**: Love Me Again (John Newman)
- **Volume**: 15% (0.15)
- **Duration**: 2 minutes (120 seconds) unless user clicks mute
- **Start**: Skips first 12 seconds of track
- **Mute button**: 🔊 Mute button in top bar (appears only while audio is playing)
- **Location**: `/public/audio/love-me-again.mp3`

### Premium FIFA-Style Sound System
Lightweight Web Audio API-based sound system with four sound types:
- **click**: Subtle high-pitched sound (deselecting choices)
- **select**: Medium tone (selecting choices, ~120ms)
- **navigate**: Ascending tone (stage navigation, next/previous)
- **success**: Musical interval (form completion)
- **error**: Descending buzz (validation errors)

**Implementation**:
- Hook: `useSoundSystem()` in `/src/hooks/useSoundSystem.ts` — generates sounds via Web Audio API, no external files
- Context: `SoundContext` in `/src/context/SoundContext.tsx` — global enable/disable
- Integrated in: Journey.tsx (choice selections), SelectChip component (interactive choices)
- Volume: 10% (0.1) — subtle, non-intrusive
- Can be toggled via SoundContext `setEnabled(boolean)`

## Common Commands

```bash
# Run codegen after changing OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push

# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend
pnpm --filter @workspace/player-portal run dev
```

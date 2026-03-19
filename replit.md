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

### Frontend Routes — Public Marketing Site
All wrapped in `PublicLayout` (shared header/nav/footer). No MetyButton on these routes.
- `/` — Marketing home (image-led hero with family photos, story preview card, academy banner, family testimonials, illustrators section, CTA)
- `/about` — About Me Time Stories (mission, team, values)
- `/for-academies` — Football Academy programme (pitch, ecosystem, benefits, enquiry modal)
- `/csr` — Corporate Social Responsibility / partnerships (3 tiers, enquiry form)
- `/families` — For Families (stub)
- `/for-authors` — For Authors (stub)
- `/stories/rose-goes-to-mos` — Ramadan campaign: Rose Goes to Mo's (order modal)
- `/football-matrix` — Interactive Football Position Matrix (pitch SVG, dashboard, training, academy tabs)
- `/characters/create` — 3-step Character Creator (avatar + name, personality traits, story library)
- `/stories/time-travelling-tractor` — Interactive Story Engine (name → pronouns → appearance → companion → 6-page story)

### Frontend Routes — Academy Player Portal (was at `/`)
- `/portal` — Academy portal launcher: league/club selection (was Home.tsx at `/`)
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
- `/staff-dashboard` — Academy Hub: player counts, story pipeline overview (per-player status, pipeline stage pills, academy preview alerts), recent players (protected)
- `/staff/players` — Filterable/searchable player list with age group, position, status (protected)
- `/staff/players/:id` — Full player profile with journey, parent, staff submissions, completion tracker (protected)
- `/staff/team` — Admin-only team management: list/create staff, toggle active/inactive (protected)
- `/staff/settings` — Admin-only placeholder settings page (protected)

### Frontend Routes — Story Production Workspace (`/internal/stories/*`)
All routes JWT-protected via `ProtectedInternalRoute`. Dark editorial UI with violet accent (#a78bfa). Layout: `InternalLayout.tsx`.
- `/internal/login` — MeTime Stories author/editor login (`metime_staff` table, role-based)
- `/internal/editor` — Editor Dashboard (editors/admins only): stats, story review queue (approve → ready_for_illustration / reject → revisions_in_progress), blueprint approval queue, staff management, author assignments
- `/internal/stories` — Cross-academy dashboard: all players, completeness bars, filters by academy/status/author
- `/internal/stories/:playerId/profile` — 8 collapsible data sections + blueprint approval indicator + Approve/Revoke Blueprint buttons (editors only)
- `/internal/stories/:playerId/blueprint` — 13-field narrative blueprint with 2.5s auto-save + approval status
- `/internal/stories/:playerId/builder` — Writing Room: 3-column layout (chapter navigator, book page canvas with bleed/margins, reference panel). Supports A5/Square/A4 formats, 6 page layout modes, auto-save. Locked until blueprint approved by editor. Chapter navigator footer shows completion dots + "Submit for Review" button (gated: all 6 chapters ≥100 chars + blueprint approved + status=draft_in_progress).
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

### Internal Story Production API Routes (JWT-protected via `internalAuth` middleware)
- `POST /api/internal/login` — MeTime Stories staff login (`metime_staff` table)
- `GET /api/internal/me` — Current internal staff user
- `GET /api/internal/projects` — All story projects cross-academy (filters: search, academy, status, author)
- `GET /api/internal/projects/:playerId` — Single project + player
- `PUT /api/internal/projects/:playerId` — Update project (status, author assignment, etc.)
- `GET /api/internal/projects/:playerId/profile` — Full player data: all responses + computed sections + media links
- `GET/PUT /api/internal/projects/:playerId/blueprint` — Get/save narrative blueprint
- `POST /api/internal/projects/:playerId/blueprint/approve` — Editor approves blueprint (unlocks Story Builder)
- `POST /api/internal/projects/:playerId/blueprint/revoke` — Editor revokes blueprint approval
- `PUT /api/internal/projects/:playerId/assign` — Assign author/editor/book format to project
- `GET /api/internal/projects/:playerId/scenes` — All 6 scenes for a player
- `PUT /api/internal/projects/:playerId/scenes/:sceneNumber` — Save a scene (manuscript, pageLayout, imageUrl, etc.)
- `GET/PUT /api/internal/projects/:playerId/tracker` — Detail tracker items + update usage status
- `GET/POST /api/internal/projects/:playerId/notes` — Production notes (add/list)
- `GET /api/internal/projects/:playerId/illustrations` — List illustration assets
- `POST /api/internal/projects/:playerId/illustrations` — Add illustration asset
- `PUT /api/internal/projects/:playerId/illustrations/:assetId` — Update/approve asset
- `GET /api/internal/editor/stats` — Editor dashboard stats (editors/admins only)
- `GET /api/internal/staff` — List all MeTime Stories staff (editors/admins only)
- `POST /api/internal/staff` — Add staff member (editors/admins only)
- `PUT /api/internal/staff/:id` — Update staff member (editors/admins only)
- `DELETE /api/internal/staff/:id` — Deactivate staff member (soft-delete)

### Staff API Routes (JWT-protected)
- `POST /api/staff/login` — Staff login (email + password → JWT)
- `GET /api/staff/me` — Current staff profile
- `GET /api/staff/players` — List players for staff's academy (filter by age_group, status, search)
- `GET /api/staff/players/:id` — Full player detail (journey, parent responses, staff submissions)
- `GET /api/staff/stories` — Story pipeline for staff's academy: players + story statuses + blueprint flags
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
- `metime_staff` — MeTime Stories internal staff (email, password_hash, full_name, role: author/illustrator/editor/admin, is_active)
- `story_projects` — One-per-player production record (status, book_format, assigned_author, assigned_editor, flags)
- `story_blueprints` — 13-field narrative blueprint + blueprint_approved / blueprint_approved_by / blueprint_approved_at
- `story_scenes` — 6 chapters per project (manuscript, page_layout, image_url, pages_data jsonb)
- `illustration_assets` — Drive-linked illustration files (type, approval, scene_number)
- `detail_tracker` — Per-project usage tracking for player details (unused/partly/clearly_used)
- `production_notes` — Free-text notes per project (type: general, internal, revision)

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

### MeTime Stories Production Workspace
- **Author login**: `author@metimestories.com` / `MetiAuthor2024!` (role: author)
- **Editor login**: `michael@metimestories.com` / `MichaelEditor2024!` (role: editor — full access to Editor Dashboard, blueprint approvals, staff management)
- Access at `/internal/login`

### Marcus Rashford Demo Player (Manchester United)
- **Access Code**: `PLY-MR12` · **Parent Code**: `PAR-MR12`
- Age 12, U13, Winger, Shirt #10, 30 journey responses seeded

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

## MeTime Stories Production Workspace (`/internal/*`)

A separate internal tool for MeTime Stories staff (authors, illustrators, editors) to manage personalised story production for each player.

### Auth — completely separate from academy staff
- Login page: `/internal/login`
- Token stored in `localStorage` key: `metime_internal_token`
- JWT claim: `type: "internal"` (validated by `internalAuth` middleware)
- DB table: `metime_staff` (id, email, password_hash, full_name, role, is_active)
- Roles: `author`, `illustrator`, `editor`, `admin`
- Demo account: `author@metimestories.com` / `MetiAuthor2024!`
- Context: `InternalAuthContext` / `useInternalAuth`
- Route guard: `ProtectedInternalRoute` (redirects to `/internal/login`)

### Workspace routes
- `/internal/stories` — Dashboard (all players with story projects)
- `/internal/stories/:playerId/profile` — StoryProfile
- `/internal/stories/:playerId/blueprint` — BlueprintEditor
- `/internal/stories/:playerId/builder` — StoryBuilder
- `/internal/stories/:playerId/illustrations` — IllustrationWorkspace
- `/internal/stories/:playerId/notes` — ProductionPanel

### API files
- `internalApi.ts` — reads `metime_internal_token`, redirects to `/internal/login` on 401
- Backend routes: `/api/internal/*` all protected by `internalAuth` middleware

## Public-Facing Design System (Phase 3 Redesign)

### Palette
- **Darks**: `#060402`, `#0d0802`, `#1a0c04` (warm dark amber, not cold black)
- **Accents**: `#f97316` (amber), `#fbbf24` (gold), `#2d1260` (plum)
- **Light**: `#fef9f0`, `#fef3e2` (warm cream parchment)
- **Glass panels**: `backdrop-filter: blur(20-24px)`, `rgba(255,248,235,0.05-0.06)` bg, warm amber border

### Key Visual Techniques
- **Video hero**: `public/images/girl-reading-book.mp4` — looping autoplay, covers hero section
- **Parallax**: scroll listener on MarketingHome; video moves at `scrollY * 0.38`, content at `scrollY * -0.10`
- **Glassmorphic sections**: TTT section uses `family-fireplace.png` blurred behind a `rgba(6,4,2,0.82)` dark glass overlay; story preview panel uses `backdrop-filter: blur(20px)`
- **Partial-image background (preferred accent pattern)**: Absolutely position an image covering one side of a section (e.g. right 40–45%) using `object-fit: contain` + `object-position: right center` so the full image shows without cropping. Layer a directional gradient overlay (same colour as the section background) that fades from opaque on the content side to transparent toward the image, blending them together. Mark image `pointer-events-none select-none` and `aria-hidden`. Hide on mobile with `hidden md:block`. Used on: MarketingHome testimonials section (nursery photo, right side). Apply this pattern wherever a real photo can add warmth without overwhelming content.
- **Icons**: Remix Icons (`ri-*`) throughout; emojis only in story content, theme selectors, companion animals

### Page Backgrounds
- MarketingHome hero: looping video + directional gradient overlay
- MarketingHome TTT section (#6): blurred real image + dark glass + amber glow
- CharacterCreator: `radial-gradient(ellipse at 50% 0%, #2d1260 0%, #1a0c04 45%, #0d0a08 100%)`
- StoryEngine: `radial-gradient(ellipse at 50% 0%, #1a0c04 0%, #0d0802 55%, #060402 100%)`

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

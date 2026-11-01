# 50X Life OS 2.0 — Audit and Architecture

Status: initial audit verified against commit `791c990` on 31 October 2026; implementation status updated after the version-11 financial-truth and compact-Today pass.

Implementation note: The current version-11 PWA includes the sixth Life module, Build/Maintain/Experience daily planning, explicit mode control, compact Today orchestration, exact-pence financial records, account-safe transfers, protected budgets, reconciliation, received-income allocation, forecasts, savings, purchase planning, goals, project workspaces, milestones, blockers, decisions, monthly evidence, and a permissioned local assistant with approval and reversal history. Upgrade recovery snapshots and the existing storage key remain preserved.

### Completion status

- **Implemented and verified locally:** Milestones 1–3 at the current buildless PWA layer, plus the approval-based local assistant foundation from Milestone 5 and the version-11 financial-truth workflows.
- **Mobile verified:** an automated Playwright smoke suite checks all six modules at 320px, 375px, and 430px without horizontal overflow, plus compact Today and dialog close controls.
- **Migration verified:** a version-10 fixture upgrades through version 11, writes a rollback snapshot, converts Food and Transport bills into protected recurring budgets, and archives the source records.
- **Money verified:** expected income remains outside available cash; personal, business and held money stay separate; a linked business-to-personal transfer changes both account positions exactly once.
- **Not yet implemented:** external model calls, Supabase authentication/PostgreSQL, IndexedDB, record-level cloud sync, React/TypeScript modularisation, and push notifications. The core app does not depend on these platform upgrades.

## Executive recommendation

Evolve the current application in controlled stages instead of replacing it immediately. The existing app is already a useful, installed, local-first PWA with strong behavioural architecture, financial reminders, backups, app locking and encrypted device sync. A framework migration before the data model is stabilised would create avoidable risk without improving the user's day.

The first milestone should preserve the current storage key and all existing records, introduce the missing Life module, correct user-control and review issues, add migration recovery, and establish a versioned 2.0 data shape. A later milestone can move the UI to React and TypeScript once entity boundaries and migration tests exist.

## 1. Verified current state

### Architecture and stack

- Buildless static PWA: `index.html`, one JavaScript application file, one CSS file, a web manifest and a service worker.
- No framework, package manager, compiler or server application. A focused Playwright smoke suite now covers migration, critical money rules, dialogs and narrow mobile layouts.
- UI uses template strings and delegated DOM events.
- Production is hosted on GitHub Pages.
- The application is installable and works offline after a successful online load.

### Navigation and current modules

- **Today:** compact most-important-outcome surface, energy check-in, manual modes, Build/Maintain/Experience plan, essential routines and optional expanded planning details.
- **Life:** identity, relationships, experiences, personal care, faith and private reflection.
- **Money:** balances, ledger, bills, subscriptions, liabilities, investments and a safe-to-spend calculation.
- **Focus:** one weekly outcome, evidence, ranked actions, completed work and a capture inbox.
- **System:** life-maintenance dates, three routine modes, cue architecture, routine diagnostics and if–then scripts.
- **Review:** deterministic weekly coaching, ratings, weekly/monthly reflections, recovery choice and archived weeks.

### Persistence and data protection

- Main records use browser `localStorage` under `flow-maxing-os-v1`.
- A normalisation function upgrades old shapes to schema version 11 and preserves a pre-upgrade rollback snapshot.
- JSON backup import/export and password-encrypted one-time handoff are implemented.
- Continuous device sync encrypts the full state with AES-GCM before sending ciphertext to a relay.
- Sync is local-first, supports offline changes and stops on a detected whole-state conflict.
- A local PIN verifier and optional WebAuthn device credential protect the interface.
- The local database itself is not encrypted at rest. A PIN hides the interface but does not encrypt `localStorage`.
- There is no account authentication, row-level access control or server-owned database.

### Current intelligence

- Task recommendations are deterministic: impact, energy fit, complexity, deadline, weekly alignment and time fit.
- Recovery, routine and weekly-coach messages are deterministic rules over recent records.
- There is no external AI model integration yet. The local assistant already has permission controls, fact/assumption separation, proposal approval and reversible change history.

### Mobile and reliability

- Safe-area insets, a fixed bottom navigation bar, responsive grids and mobile dialogs are present.
- Core features are usable at small iPhone widths.
- The service worker uses network-first fetches with cached fallback.
- Asset query versions and cache names are manually updated for releases.
- JavaScript and CSS are monolithic and have accumulated repeated style layers, increasing regression risk.

## 2. What to retain, refactor, replace and add

### Retain

- Cue-response architecture, task preparation and fallback actions.
- Minimum, Standard and Peak operating modes.
- Local-first behaviour and offline PWA installation.
- Encrypted sync, conflict blocking, secure handoff and JSON backups.
- Bills calendar, subscription audit, safe-to-spend concept and life-maintenance calendar.
- Weekly archive and non-punitive recovery philosophy.

### Refactor

- Split the JavaScript monolith into domain modules after the 2.0 schema is stable.
- Split visual tokens, layout, components and module styles instead of continuing CSS overrides.
- Make daily mode selection fully manual. Energy may suggest a mode but must not silently change it.
- Replace whole-state mutation with entity commands and a change log.
- Replace generic arrays and free-text Life fields with validated structured records.
- Replace full-state sync conflicts with record-level revisions when the server-backed phase begins.
- Replace manual cache-version editing with a build-generated release version.

### Replace

- Floating-point financial storage and calculations with integer minor units (`pence`) or exact database decimals.
- The aggregate “Life score” with evidence, trends and explicit review decisions.
- Implicit in-place migrations with backed-up, validated, reversible migrations.
- Browser-only PIN as the long-term security boundary with authenticated encrypted storage and database policies.

### Add

- A dedicated Life module for identity, relationships, experiences, personal care, faith and private reflection.
- Goals, projects, milestones and task relationships.
- Budgets, account types, expected income, confirmed income, reserves and repayment schedules.
- Daily intention, one most-important outcome and a Build/Maintain/Experience command model.
- Monthly reconciliation records and auditable financial adjustments.
- Permissioned AI proposals, approval, reversal and change history.
- Automated schema, migration, money, ranking and mobile interaction tests.

## 3. Verified gaps against the 2.0 brief

| Area | Current coverage | Gap |
| --- | --- | --- |
| Today | Compact command centre, explicit mode, routines, tasks and life participation | No calendar-provider integration or background push planning |
| Life | Structured identity, contacts, experiences, care, faith and journal records | Private fields are not encrypted at rest in localStorage |
| Money | Exact-pence ledger, separated accounts, transfers, budgets, reconciliation, allocations and forecasts | No bank feed, multi-currency ledger or server-side audit database |
| Focus | Goals, projects, milestones, dependencies, decisions, blockers and links | No collaborative workspaces or repository-provider integration |
| System | Routines, cues, fallbacks, scripts, maintenance and local reminders | Browser notifications remain platform-limited |
| Review | Daily, weekly and monthly evidence with financial reconciliation | Long-range analytics remain intentionally lightweight |
| AI | Permissioned local recommendations, proposals and reversal history | No interchangeable external model provider has been connected |
| Privacy | Encryption in transit/sync and local app lock | No encrypted local database, user authentication or server access controls |
| Reliability | Local-first, backups, service worker, rollback UI and focused smoke suite | No full unit, accessibility, security or performance suite yet |

## 4. Proposed 2.0 architecture

### Product layer

Six top-level domains share one command model:

1. **Today** selects one Build action, one Maintain action and one Experience action from verified records.
2. **Life** owns identity, contacts, social plans, experiences, care, faith and private reflections.
3. **Money** owns accounts, transactions, budgets, commitments, liabilities, reserves and forecasts.
4. **Focus** owns goals, projects, milestones, tasks, blockers and decisions.
5. **System** owns routines, cues, modes, rules, notifications and preferences.
6. **Review** stores dated evidence and explicit decisions across all five operating domains.

### Recommended technical path

#### Foundation phase

- Keep the current buildless PWA and GitHub Pages deployment.
- Introduce a versioned 2.0 schema and backed-up migration.
- Add the Life module and clearer Today orchestration.
- Preserve the existing encrypted sync protocol while the schema evolves.

#### Modular application phase

- React + TypeScript + Vite PWA rather than Next.js for the private, offline-first client.
- Domain modules with schema validation and command-based writes.
- IndexedDB for a durable local replica and offline queue.
- A generated service worker and release manifest.

#### Secure cloud phase

- Supabase Auth and PostgreSQL with row-level security.
- PostgreSQL `numeric` or integer minor units for financial records.
- Append-only change events for important financial and AI-assisted changes.
- Encrypted private fields for journal and relationship notes.
- Server-side AI gateway through an interchangeable provider adapter.

Next.js should only be introduced if server-rendered public pages or a larger server application become necessary. It is not required for the private PWA itself.

## 5. Core data model

Every entity receives `id`, `user_id`, `created_at`, `updated_at`, `status` and `revision` where appropriate. Historical facts are archived or superseded, not overwritten.

### Shared

- `users`, `preferences`, `life_areas`
- `change_events`, `notifications`
- `ai_permissions`, `ai_recommendations`, `approved_changes`

### Today and System

- `daily_plans`, `check_ins`
- `routines`, `routine_steps`, `routine_completions`
- `cues`, `if_then_rules`

### Focus

- `goals`, `projects`, `milestones`, `tasks`
- `task_dependencies`, `work_sessions`
- `project_decisions`, `project_blockers`, `project_links`

### Money

- `financial_accounts`, `transactions`, `transaction_splits`
- `budgets`, `budget_lines`
- `recurring_commitments`, `commitment_occurrences`
- `liabilities`, `repayment_schedule_entries`
- `reserves`, `savings_goals`, `investments`
- `income_forecasts`, with `expected`, `confirmed` and `received` states
- All values use `amount_minor` plus an ISO currency code.

### Life

- `identity_statements`, `boundaries`
- `contacts`, `relationship_intentions`, `connection_events`
- `social_plans`, `experiences`, `memories`
- `care_intentions`, `faith_practices`, `journal_entries`

### Review

- `daily_reviews`, `weekly_reviews`, `monthly_reviews`
- `review_evidence`, `review_decisions`

## 6. Cross-module rules

- Suggestions never mutate consequential records.
- Daily planning reads project priority, deadline, energy fit, preparation, bill urgency, life maintenance and Life intentions.
- A low-energy check-in explains a lighter mode suggestion but preserves the selected mode until the user changes it.
- Expected income never increases available cash.
- Business cash, personal cash, restricted funds and money held for others remain separate.
- Enjoyment recommendations use the explicit enjoyment budget, not total account balances.
- Contacts are never scored. Reminders are optional and based only on user-entered intentions or dates.
- AI writes create a proposal first. Approval creates a reversible change event.

## 7. Migration, backup and rollback

1. Read the existing legacy record without modifying it.
2. Save a timestamped pre-migration snapshot under a separate local key.
3. Transform a cloned record into the current schema version.
4. Validate required collections, IDs, record counts and key financial totals.
5. Save the migrated record only after validation succeeds.
6. Keep the pre-migration snapshot until the user deliberately removes it.
7. Provide export before destructive imports, reset or sync replacement.
8. When the database phase begins, import into staging tables, compare counts and financial totals, then switch the active account only after confirmation.

Rollback restores the untouched pre-migration snapshot and reloads the previous compatible release. Cloud migration must retain the previous revision until the new revision is confirmed on two devices.

## 8. Prioritised roadmap

### Milestone 1 — 2.0 shell and Life foundation

- Add the sixth Life module.
- Add structured identity, contact, experience and private reflection records.
- Make Today use Build/Maintain/Experience priorities.
- Keep mode choice manual and remove the aggregate life score.
- Add migration backup and validation.
- Preserve existing data, sync and offline behaviour.

### Milestone 2 — Financial truth

- Move money to minor units.
- Add accounts, budgets, reserves, expected income, savings and repayment schedules.
- Add reconciliation and tested forecasts for the three-month Student Finance period.

### Milestone 3 — Goals and projects

- Add goals, projects, milestones, dependencies, blockers, decisions and links.
- Pull only actionable project steps into Today.

### Milestone 4 — Typed local-first core

- Move to React, TypeScript and IndexedDB.
- Add schema, migration and interaction tests.
- Replace monolithic render and style files.

### Milestone 5 — Secure accounts and AI

- Add Supabase Auth/PostgreSQL, RLS, encryption controls and record-level sync.
- Add an AI proposal layer with permissions, explanations, approval and reversal.

### Milestone 6 — Reliability

- Security review, accessibility pass, performance budgets, observability, backup drills and mobile regression tests.

## 9. Risks and dependencies

- A database migration requires the user to choose an identity provider and cloud region.
- Browser notification delivery remains limited until a push-notification service exists.
- Sensitive journal encryption needs a recoverable key strategy; losing the only key must not permanently destroy data without warning.
- Financial forecasts are only as accurate as entered balances, transaction coverage and dates.
- AI quality depends on permissioned context and cannot replace verified financial calculations.
- The current relay is appropriate as an encrypted transport, not as the final auditable multi-entity database.

## 10. First development milestone recommendation

The original Milestone 1 is complete. The next justified milestone is modular reliability: split the monolithic client behind the stable version-11 schema, add broader calculation and accessibility coverage, and only then introduce authenticated cloud persistence or an external AI provider. The existing PWA should remain the production fallback until migration parity and rollback are verified.

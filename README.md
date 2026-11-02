# 50X Life OS

A dependency-free, mobile-first personal command centre organised around five clear destinations and one philosophy: **Build · Maintain · Experience**.

## Included systems

- Compact Home command centre using energy, routines, priorities, deadlines, payments, plans, and smart cues
- Five-destination mobile navigation: Home, Wealth, Build, Life, and More, with focused tabs inside each section
- A dedicated Life module for identity, relationships, experiences, personal care, faith, and private reflection
- Build/Maintain/Experience daily planning with explicit user-controlled operating modes
- Daily human-connection and protected-rest foundations with seven-day consistency feedback
- Deadline-aware task scheduling with weekly-outcome alignment and nightly Tomorrow Setup
- Goal and project workspaces with milestones, dependencies, blockers, decisions, links, and linked next actions
- Editable Minimum, Standard, and Peak routine modes
- Cue-response architecture with task preparation, placement, launch, fallback, and if-then scripts
- User-controlled pace suggestions plus an evidence-based weekly review
- Weekly rollover, monthly evidence snapshots, eight-week trends, and archived reflections
- Exact-pence safe-to-spend engine with personal, business, restricted, expected, invested, and held money kept separate
- STACKS virtual allocation ledger with Add Bread, Move Bread, Take Bread Out, reversible history, goal progress, and reconciliation against real cash locations
- Income Empire with revenue, realized profit/loss, costs, cash received, pending payments, deployed capital, unrealized results, period analytics, and venture links
- Approval-only allocation rules connecting genuinely received income to reserve, lifestyle, and savings stacks without counting transfers as earnings
- Financial cues and a capturable monthly 50X Money Report with income, cash, obligations, stack movement, ventures, and upcoming commitments
- Monthly budgets, savings goals, expected-versus-confirmed income, a conservative three-month cash-flow view, repayment planning, bill calendar, cash-cover insight, and reminders
- Smart next-purchase planning with product links, account-aware affordability, priorities, target dates, and optional protected money
- Subscription audit with renewals, remembered price changes, and review tracking
- Life-maintenance calendar for appointments, birthdays, renewals, car, documents, health, and home
- Financial ledger, obligations, investments, and auditable forecast states that never silently change cash
- Private local assistant with fact/assumption separation, explicit data permissions, approval before changes, and reversible change history
- Optional reminders and a local PIN or device-authenticator lock
- End-to-end encrypted phone/desktop sync with automatic Inbox merging, one-time device handoffs, and portable backup files
- Backed-up version-12 migration with recoverable upgrade snapshots and legacy savings converted into auditable opening stack allocations
- Account-safe transfers, confirmed bill dates, protected spending budgets, weekly balance reconciliation, and received-income allocation
- Compact tabbed overviews that keep detail screens available without turning every landing page into a long feed

The current assistant is deliberately local and rule-based. It does not send records to an external model. A future model provider can be added behind the existing permissions and approval controls without making the core app dependent on AI.

The verified 3.0 financial architecture is documented in `docs/50X-LIFE-OS-3.0-AUDIT.md`. The V3.1 route audit, navigation blueprint, retain/refactor decisions, and data-preservation plan are documented in `docs/50X-LIFE-OS-3.1-EXPERIENCE-AUDIT.md`.

## Live app

https://stevehenderson1448-netizen.github.io/flow-maxing-os/

Open the live app on a phone and add it to the home screen. Once opened online, its core interface also works offline. Existing Flow Maxing data upgrades automatically. Use **Settings → Encrypted device sync** on the device with the latest data, then open its private pairing link on the second device.

Continuous sync encrypts the complete Life OS before it leaves the browser. The relay receives only ciphertext; the separate decryption key stays in the private pairing link and connected browsers. Changes save locally first and sync while the app is open. Keep the pairing link private and continue exporting occasional backups.

The secure handoff remains available as a one-time, password-protected copy when continuous sync is not wanted.

## Run locally

From this folder:

```sh
npx serve .
```

Open the address shown in the terminal. The app stores data locally in the browser. Use Settings to export or restore a JSON backup.

## Put it on your phone

Deploy this folder as a static site using Netlify Drop, Cloudflare Pages, GitHub Pages, or any static host. Then:

- iPhone/iPad: open the URL in Safari, tap Share, then **Add to Home Screen**.
- Android: open the URL in Chrome, open the menu, then tap **Install app** or **Add to Home screen**.

HTTPS is required for offline installation and the service worker on a deployed site.

## Verification

`tests/smoke.cjs` verifies version-12 migration and rollback data, account-safe money calculations, stack cash separation, Income Empire no-double-counting, linked transfers, reversible records, dialog closing, and all five destinations plus their tabbed workspaces at 320px, 375px, and 430px widths. It requires Node.js plus Playwright.

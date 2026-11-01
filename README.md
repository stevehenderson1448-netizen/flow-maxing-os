# 50X Life OS

A dependency-free, mobile-first personal command centre organised around six modules and one philosophy: **Build · Maintain · Experience**.

## Included systems

- Adaptive daily command centre using energy, available time, routines, deadlines, bills, and life-maintenance dates
- A dedicated Life module for identity, relationships, experiences, personal care, faith, and private reflection
- Build/Maintain/Experience daily planning with explicit user-controlled operating modes
- Daily human-connection and protected-rest foundations with seven-day consistency feedback
- Deadline-aware task scheduling with weekly-outcome alignment and nightly Tomorrow Setup
- Goal and project workspaces with milestones, dependencies, blockers, decisions, links, and linked next actions
- Editable Minimum, Standard, and Peak routine modes
- Cue-response architecture with task preparation, placement, launch, fallback, and if-then scripts
- Routine and recovery intelligence plus an evidence-based weekly coach
- Weekly rollover, monthly evidence snapshots, eight-week trends, and archived reflections
- Exact-pence safe-to-spend engine with personal, business, restricted, expected, invested, and held money kept separate
- Monthly budgets, savings goals, expected-versus-confirmed income, a conservative three-month cash-flow view, repayment planning, bill calendar, cash-cover insight, and reminders
- Smart next-purchase planning with product links, account-aware affordability, priorities, target dates, and optional protected money
- Subscription audit with renewals, remembered price changes, and review tracking
- Life-maintenance calendar for appointments, birthdays, renewals, car, documents, health, and home
- Financial ledger, obligations, investments, and auditable forecast states that never silently change cash
- Private local assistant with fact/assumption separation, explicit data permissions, approval before changes, and reversible change history
- Optional reminders and a local PIN or device-authenticator lock
- End-to-end encrypted phone/desktop sync with automatic Inbox merging, one-time device handoffs, and portable backup files
- Backed-up version-11 migration with recoverable upgrade snapshots
- Account-safe transfers, confirmed bill dates, protected spending budgets, weekly balance reconciliation, and received-income allocation
- Compact mobile Today command surface with event-based routine cues and explicit fallback actions

The current assistant is deliberately local and rule-based. It does not send records to an external model. A future model provider can be added behind the existing permissions and approval controls without making the core app dependent on AI.

The verified 2.0 audit, architecture, data model, migration strategy, and roadmap are documented in `docs/50X-LIFE-OS-2.0-AUDIT.md`.

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

`tests/smoke.cjs` verifies version-11 migration and rollback data, account-safe money calculations, expected-income exclusion, linked transfers, dialog closing, and all six modules at 320px, 375px, and 430px widths. It requires Node.js plus Playwright.

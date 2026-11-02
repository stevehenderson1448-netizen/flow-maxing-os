# 50X Life OS 3.1 — Experience Audit and Navigation Blueprint

Audit baseline: V3.0 at commit `5713163`.

## Verified foundation

- The product is a dependency-free mobile PWA with one versioned state object, exact-pence financial ledgers, local persistence, encrypted device sync, backup/restore and a service worker.
- The six current top-level screens are rendered from `app.js`: Today, Life, Money, Focus, System and Review.
- Working V3 systems already share data correctly: received Income Empire entries update cash, STACKS allocate existing cash, ventures connect income streams and projects, and reports derive from those source records.
- No visible GOD MODE surface exists in the repository. Unknown preference fields remain preserved by state normalization and will stay outside the redesigned navigation.
- The redesign does not require a state migration. It changes presentation, navigation and copy while retaining schema version 12 and all existing records.

## Screen audit

| Current screen | Current purpose | Problems found | New location | Decision |
| --- | --- | --- | --- | --- |
| Today | Daily planning, routines, energy, connection, preparation and evening reflection | Too many competing cards; primary action is diluted; recovery and feedback language dominates | **Home** | Redesign around three priorities, four quick actions, three snapshots, two cues and coming up |
| Money | Accounts, bills, budgets, STACKS, Income Empire, forecasts, reports and purchases | One destination owns too many unrelated workflows; overview remains long even after V3 tabs | **Wealth** | Retain records and tools; split into Overview, Income, STACKS, Money and Reports |
| Focus | Weekly outcome, ventures, projects, tasks, goals, inbox and decisions | Portfolio, planning and execution appear simultaneously; long project details create heavy scrolling | **Build** | Split into Overview, Portfolio, Actions and Opportunities |
| Life | Identity, people, experiences, care, faith and journal | Every life area is expanded at once; opening copy is defensive rather than aspirational | **Life** | Split into Overview, People, Plans and Personal; Personal uses focused internal views |
| System | Maintenance dates, modes, cues, scripts and routine intelligence | A technical label for several distinct utilities; cue lists and calendar compete on one page | **More** | Move to Routines and Calendar subpages; settings remains globally accessible |
| Review | Weekly ratings, reflection, coach, finance, monthly fields and history | Longest page; repeated interpretation prompts; language centres adjustment and recovery | **More → Review** | Split into Week, Month and History views with evidence first and concise decisions |
| Settings dialog | Privacy, security, sync, backup, reminders and reset | Useful global utility but disconnected from navigation | **More + global icon** | Retain dialog and add a clear More entry point |
| Assistant dialog | Local, permission-aware recommendations | Correctly secondary; should not become the product interface | Global action | Retain as an optional overlay |

## Navigation blueprint

1. **Home** — daily command centre.
2. **Wealth** — Overview, Income, STACKS, Money, Reports.
3. **Build** — Overview, Portfolio, Actions, Opportunities.
4. **Life** — Overview, People, Plans, Personal.
5. **More** — Overview, Routines, Calendar, Review.

Legacy destinations remain accepted by the navigation router so existing internal buttons still land in the correct new destination. `today` maps to Home, `money` to Wealth, `week` to Build, and `architecture` or `review` to the relevant More subpage.

## Design system direction

- Near-black and charcoal foundations, warm off-white text, muted gold interaction accents, restrained green for genuine positive movement and red only for meaningful negative states.
- Compact page headers, consistent segmented navigation, 44px minimum touch targets, reduced card padding and fewer decorative gradients.
- Summary first, source records second, editors on demand. No data-entry form remains permanently expanded on a landing page unless it is the page's primary action.
- Empty states state what belongs in the area and provide one direct action. They do not imply failure or personal deficiency.

## Copy direction

- Replace diagnostic or corrective framing with clear operational language.
- Keep factual financial warnings, deadlines and liabilities precise; remove emotional judgment around them.
- Use “pace”, “position”, “next move”, “coming up”, “available after plans” and “anything to streamline” in primary UI.
- Keep stronger personality selective: “Morning, 50X”, “What’s the move?” and milestone cues. Serious finance and business screens remain calm and exact.

## Data and rollout safeguards

- Keep schema version 12. No collection is renamed or deleted.
- Preserve backup, sync, PIN/device lock, service-worker offline behavior and migration rollback snapshots.
- Validate the existing migration and accounting suite, then add navigation, focused-section, quick-action and narrow-screen checks for the five-destination shell.

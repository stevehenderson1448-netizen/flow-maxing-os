# 50X Life OS

A dependency-free, mobile-first personal operating system connecting five engines: finances, daily routines, mental clarity, execution, and life balance.

## Included systems

- Adaptive daily command centre using energy, available time, routines, deadlines, bills, and life-maintenance dates
- Daily human-connection and protected-rest foundations with seven-day consistency feedback
- Deadline-aware task scheduling with weekly-outcome alignment and nightly Tomorrow Setup
- Editable Minimum, Standard, and Peak routine modes
- Cue-response architecture with task preparation, placement, launch, fallback, and if-then scripts
- Routine and recovery intelligence plus an automatic weekly coach
- Weekly rollover, eight-week trends, and archived reflections
- Safe-to-spend engine, smart bill calendar, recurring due dates, cash-cover insight, and reminders
- Subscription audit with renewals, remembered price changes, and review tracking
- Life-maintenance calendar for appointments, birthdays, renewals, car, documents, health, and home
- Financial ledger, obligations, and investments
- Optional reminders and a local PIN or device-authenticator lock
- End-to-end encrypted phone/desktop sync, one-time device handoffs, and portable backup files

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

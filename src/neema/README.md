# Neema app screens

This folder holds the main in-app experience for mothers, built from the Neema design prototype (spec v1.9). After sign-in and pregnancy setup, `src/pages/Index.tsx` renders `<NeemaApp>` for mothers. Partners keep the earlier layout.

## Structure

| File | What it is |
| --- | --- |
| `NeemaApp.tsx` | App shell: header (logo, profile, notifications, SOS), tab bar, overlays |
| `store.tsx` | Shared state for the screens (`useNeema()`); some settings are remembered on the device |
| `data.ts` | All content: chat answers, danger keywords, diet, family planning methods, checklist, symptoms, facilities |
| `safety.ts` | `findDangerSign()`: fixed keyword rules that route chat messages to the symptom checker |
| `ui.tsx` | Small shared pieces: cards, switches, check boxes, segmented control, disclaimer, SOS pill |
| `screens/` | Home, Ask Neema, Diet, Family planning (switches on the journey), Checklist, Profile |
| `overlays/` | SOS sheet, symptom checker, notifications |

Earlier screens (week-by-week tracker, contraction timer, spiritual support, partner view) are listed in Profile › More from Neema.

## Design rules

- Colours come from the `neema-*` Tailwind tokens. `neema-sos` is for SOS and danger touch points only.
- Body text at least 16px, tap targets at least 48×48px, cards `rounded-2xl` with `shadow-neema-card`.
- Every symptom result and AI answer shows the disclaimer in `ui.tsx` (`DISCLAIMER`).
- Symptom results lead with calm guidance, then next steps, then a way to reach care. No full-screen red alerts.

## Still to connect (search for `TODO` in this folder)

- Ask Neema answers: replace the keyword lookup in `AskTab.tsx` with the real back end.
- SOS SMS alert, saved emergency contacts and GPS distance to facilities.
- Data export, account deletion and PIN storage in Profile.
- Weather for the water target, real reminders in notifications, and a licensed photo for today's tip.

Clinical wording in `data.ts` must be reviewed by Neema's clinical reviewer before release.

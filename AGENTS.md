# Architecture rules
- Keep sign-up and pregnancy-entry schemas in `src/lib/form-validation.ts`, shared by screens and account save helpers, so validation cannot drift between input and submission.
- Await pregnancy setup saves before navigating; the setup screen owns its pending state and the account flow confirms success only after persistence succeeds.
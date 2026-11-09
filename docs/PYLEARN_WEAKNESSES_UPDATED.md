# Pylearn Weaknesses Updated

**Checkpoint date:** 2026-11-07  
**Repository:** `YAbu528/Pylearn`  
**Purpose:** Canonical, easy-to-find continuation handover for the PyLearn reward-integrity weakness audit and Phase 2 server-authoritative reward milestone.

> This document is the named successor checkpoint requested by the user. A new ChatGPT conversation should fetch and read this file first, then fetch the linked Phase 2 design/contract files before asking the user to repeat context.

## Current status at this checkpoint — updated 2026-11-07

- **Audit:** inspected; 14 quiz answer indexes and the three objective challenge answer rules inventoried.
- **Architecture/contract:** documented. Database/API boundary implemented in isolated Pylearn-Dev; frontend integrated on the feature branch.
- **Development database:** separate Supabase Free project `Pylearn-Dev` created and verified at $0/month; project ref `rhtfripfqwccbhcwgoxy`.
- **Implementation:** database migrations and JWT-verified Edge Function deployed to Pylearn-Dev; frontend changes committed on `feat/server-authoritative-rewards-20261107`.
- **Preview:** Vercel feature-branch deployment reached READY. Preview routes to Pylearn-Dev; GitHub Pages and stable Vercel domains remain pointed at production.
- **Tests:** SQL transaction assertions passed and rolled back; synthetic Auth bootstrap test passed; Supabase security advisor returned no lints; GitHub Actions source-check run 4 passed.
- **Still pending:** Auth redirect allowlist setup, authenticated browser tests, Android Chrome/Samsung Internet regression, and production rollout review.
- **Production:** unchanged. No production migration, Edge Function deployment, or user-data write has occurred. Do not describe the reward weakness as fixed in production.

## Repository and branch references

- Repository: https://github.com/YAbu528/Pylearn
- Live site: https://yabu528.github.io/Pylearn/
- Supabase project ref: `vzgbxoxscmlmacxciwze`
- Phase 1 recovery/audit branch: `audit/reward-integrity-phase1-20261107`
- Phase 2 feature branch: `feat/server-authoritative-rewards-20261107`
- Phase 2 base commit: `faeb179c337d5c063a266086fc2b97b624a6215e`
- Latest Phase 2 feature-branch checkpoint at this update: `d5fc0b2ecde4fabe7b35b5365e024f0edb34ad98`.
- Latest Phase 2 design document commit: `2043762df53161378b4836b641f95e5899ffb02f`.
- Latest Phase 2 contract document commit: `a17c4efa5b2d884404734065413a81d19e47b932`.
- PR #38 source-recovery merge commit on main: `faeb179c337d5c063a266086fc2b97b624a6215e`
- PR #38: https://github.com/YAbu528/Pylearn/pull/38
- Original Phase 1 handover: https://github.com/YAbu528/Pylearn/blob/audit/reward-integrity-phase1-20261107/docs/REWARD_INTEGRITY_PHASE1_HANDOVER.md
- Phase 2 design: https://github.com/YAbu528/Pylearn/blob/feat/server-authoritative-rewards-20261107/docs/SERVER_AUTHORITATIVE_REWARDS_DESIGN.md

## User's mandatory continuity and quality rules

1. Keep this named handover current throughout substantial work.
2. Record exact branches, commits, files, database objects, implementation state, tests actually run, results, and remaining risks.
3. Clearly distinguish inspected, proposed, implemented, preview-tested, and production-deployed.
4. Never claim a fix or test succeeded without actually inspecting the result.
5. Before ending a substantial session, commit the checkpoint and fetch it again from GitHub to verify the saved content.
6. A new chat must read this file first and should not ask the user to repeat known project context.
7. Work on the Phase 2 feature branch. Do not make production database/function changes without explicit review and approval.
8. Small changes can be made without advance announcement; announce major changes.

## Confirmed weakness baseline

Live Supabase project `vzgbxoxscmlmacxciwze`:

- `award-learning-reward`: ACTIVE version 3, `verify_jwt=true`.
- `award-python-run`: ACTIVE version 1, `verify_jwt=true`.
- The service-role-only `public.award_learning_xp(uuid,text,text,text)` RPC is SECURITY DEFINER, has an empty search_path and explicitly checks the service_role JWT. Keep these protections.
- The RPC currently trusts client-writable `public.lesson_progress` fields: `quiz_best_score`, `completed`, and `challenge_completed`.
- Existing reward values are quiz 15 XP, lesson 20 XP, challenge 30 XP.
- `public.xp_events` deduplicates on `(user_id,event_key)`; existing event keys are `<lesson_id>:<event_type>`.
- Authenticated users can write their own progress rows under RLS but cannot directly write the reward tables.
- `challenge_attempts` is client-originated activity history, not trusted reward evidence.
- Frontend local quiz state and Worker result are currently trusted by UI reward paths.
- The Python-run achievement is requested from local `state.runs >= 1`; the server does not independently verify execution.

Relevant live row counts at prior read-only inspection: 9 profiles/user-stat rows, 126 lesson-progress rows, 87 XP-event rows, 21 achievement rows, 18 challenge-attempt rows. These are historical inspection-time aggregate counts, not live guarantees.

Applied migration IDs at prior inspection: `20261024171501`, `20261024181332`, `20261024181913`, `20261024182004`, `20261025120628`, `20261027163024`, `20261031181048`.

### Protections and user data to preserve

- Existing Supabase accounts and auth providers.
- Existing XP totals, XP event history, achievements and event keys.
- Existing visible lesson progress and cross-device sync.
- Notes, bookmarks, lesson reviews, challenge-attempt history.
- RLS user isolation, service-role-only reward writes, JWT validation and idempotency.
- Sign-in/sign-out and account switching.

Never backfill trusted evidence from old client-writable progress flags. Never reset users or recalculate/delete historical XP or achievements.

## Exact source inventory

Inspected on `feat/server-authoritative-rewards-20261107`:

- `script.js`, blob SHA `a2144b358d104c395c5dd800db76d12ba641af14`.
- `python-worker.js`, blob SHA `77da2d933177045028def3e1837a1c6ee6cf384c`.

### All 14 browser-shipped quiz answer keys

Indexes are zero-based lesson IDs and zero-based answer indexes.

| Lesson ID | Lesson | Quiz answer index | Explanation |
|---:|---|---:|---|
| 0 | Python Basics: variables & print() | 1 | A single `=` assigns the right-side value to the name on the left. |
| 1 | Data Types: strings, integers & floats | 2 | 3.14 has a decimal part, so it is a float. |
| 2 | Operators & input() | 0 | `input()` returns text; `int()` converts numeric text to an integer. |
| 3 | Conditions: if, elif & else | 1 | `=` assigns; `==` compares two values. |
| 4 | Loops: for & while | 0 | `range(1, 5)` produces 1, 2, 3, 4. |
| 5 | Functions: reusable code | 1 | `return` sends a value back to the caller. |
| 6 | Lists & dictionaries | 1 | The first list item is at index 0. |
| 7 | Errors & modules | 1 | Python uses `import` followed by the module name. |
| 8 | String Skills | 0 | `text[0:3]` for `"Python"` returns `"Pyt"`. |
| 9 | Tuples & sets | 1 | A set stores unique elements. |
| 10 | Comprehensions | 0 | `range(3)` gives 0, 1, 2; doubling produces `[0, 2, 4]`. |
| 11 | File handling | 1 | `w` opens a file for writing and replaces old contents. |
| 12 | Object-oriented Python | 0 | An object is an instance of a class. |
| 13 | APIs & JSON | 0 | Python's built-in `json` module parses JSON text. |

The question, options, answer index and explanation are all currently bundled in `script.js` lesson definitions. The future browser payload must not contain the answer index. Explanations can be returned as safe post-submission feedback.

### All objective challenge reward candidates

Current lesson challenge modes by lesson ID:

`0 code, 1 code, 2 predict, 3 debug, 4 code, 5 code, 6 mcq, 7 code, 8 fill, 9 code, 10 debug, 11 code, 12 code, 13 predict`.

Initial server-verifiable challenge scope is deliberately limited to:

| Lesson ID | Mode | Expected answer | Current client normalization |
|---:|---|---|---|
| 2 | predict | `16` | Trim outer whitespace, then case-insensitive string equality. |
| 6 | mcq | answer index `1` (`sum(numbers)`) | Exact integer option index. |
| 13 | predict | `95` | Trim outer whitespace, then case-insensitive string equality. |

Do not use loose substring matching. Pin a validator version and test whitespace/case behavior. Do not award authoritative challenge XP for code, debug or fill modes in the first release. Keep their local feedback only, and never trust a Worker `ok:true` result for XP.

Worker flaw: `python-worker.js` currently uses `validators[Number(validatorIndex)] || "valid = True"`; an invalid index defaults to success. Correct this for local feedback reliability if touching the Worker, but it must never be a server reward gate.

## Proposed server event contract

Proposed Edge Function: `verify-learning-activity`, JWT required. Authenticate with Supabase Auth `getUser(token)`; derive user identity only from the validated JWT.

Endpoint: `POST /functions/v1/verify-learning-activity`

Strict request allowlist:

- Quiz: `{ "lesson_id": "0", "event_type": "quiz", "answer_index": 1 }`
- Lesson: `{ "lesson_id": "0", "event_type": "lesson" }`; server requires verified quiz evidence for that same user and lesson.
- Objective MCQ: `{ "lesson_id": "6", "event_type": "challenge", "answer_index": 1 }`
- Objective prediction: `{ "lesson_id": "2", "event_type": "challenge", "answer": "16" }` or lesson 13 with `"95"`.

Reject or ignore client-supplied `user_id`, XP amount, event key, `ok`, validation result, validator index, and reward amount. Unknown request properties should be rejected to keep the boundary explicit.

Proposed successful response:

```json
{
  "ok": true,
  "status": "recorded",
  "lesson_id": "0",
  "event_type": "quiz",
  "xp_awarded": 15,
  "total_xp": 135,
  "streak": 2,
  "newly_unlocked_achievements": [],
  "feedback": {
    "correct": true,
    "explanation": "A single = assigns a value."
  }
}
```

For an already-recorded evidence event, return HTTP 200 with `status: "already_recorded"` and `xp_awarded: 0`. A new evidence row whose legacy XP event key already exists may return `status: "recorded"` and `xp_awarded: 0`; it must not duplicate historical XP. Totals must be server-derived.

Proposed stable error responses:

- 401 `unauthorized`: missing/invalid session.
- 405 `method_not_allowed`: non-POST request.
- 400 `invalid_request`: malformed JSON, unknown property or invalid shape.
- 404 `unknown_lesson`: lesson ID not in the server catalog.
- 409 `quiz_required`: lesson event attempted without verified quiz evidence.
- 422 `invalid_answer`: wrong quiz/challenge answer.
- 422 `unsupported_event`: challenge mode is not in the initial supported set.
- 429 `rate_limited`: bounded abuse/guessing protection.
- 500 `server_error`: transient/internal failure; client may retry safely.

The database transaction must atomically insert private evidence, create/dedupe the existing `xp_events` key, update `user_stats`, and calculate new achievements. Unique evidence key: `(user_id, lesson_id, event_type)`. Existing XP key format remains `lesson_id:event_type`.

## Legacy-account transition UX

- Preserve the user's existing completed/quiz/challenge progress display and existing XP/achievements.
- Never silently convert old client flags into verified evidence.
- When a legacy completed lesson has no trusted quiz evidence, explain that the saved completion remains intact; the learner only needs to retake that short quiz if they want to verify the prerequisite for any lesson reward not already recorded.
- Do not require rereading the lesson or reset its completion state.
- Existing XP event keys remain authoritative for dedupe: if quiz/lesson XP was already granted historically, verification can create missing trusted evidence without granting that XP again.
- If a quiz was historically marked complete but has no trusted evidence, the learner must submit a correct answer to the server before the lesson event can be verified.
- Show pending/network retry separately from incorrect-answer feedback. Never tell the learner XP was earned until the server confirms it.

## Pending request retry and account switching

Use a durable queue namespaced by exact account ID, for example `pylearn_verified_events:<uid>`. Queue only verifier request payloads and local metadata; it is transport state, never evidence. On retry, compare the currently authenticated user ID with the queue namespace before sending. Never submit one account's queued event under another account. Remove requests after a definitive accepted/already-recorded/invalid-answer response; retain only transient network/5xx failures with bounded retry/backoff. Ensure sign-out and account switch do not migrate queue contents.

## Development database — paid branch declined; Free project created

The user explicitly declined a Supabase development branch at **US$0.01344/hour**. Do not create a paid branch unless the user independently reopens that option.

A separate Free project was subsequently authorized and created after a $0 cost quote:
- Organization: `zcenoqlgbbmshhkreceg`, plan `free`.
- Project: `Pylearn-Dev`.
- Project ref: `rhtfripfqwccbhcwgoxy`.
- Region: `eu-west-1`.
- Status: `ACTIVE_HEALTHY`.
- Project creation quote: `$0/month`.
- Production project: `vzgbxoxscmlmacxciwze`, unchanged.

Dev-only fixtures:
- `supabase/tests/fixtures/pylearn_dev_baseline.sql`
- `supabase/tests/fixtures/pylearn_dev_auth_trigger.sql`

Use synthetic test users and data only. Do not copy production users, auth identities, XP history, personal data or secrets. Free project inactivity pausing is acceptable for this test environment. The paid branch remains declined.

## Completed in this conversation

- Re-fetched the original Phase 1 handover and Phase 2 design before continuing.
- Re-inspected current feature-branch `script.js` and `python-worker.js`.
- Extracted all 14 quiz answer indexes and the 3 objective challenge expected answers/normalization rules.
- Rechecked Supabase project details and development branches (none found).
- Retrieved current development branch hourly cost quote.
- No source code or database was changed during inspection.

## Exact next session entry point

1. Read this handover first, then fetch the Phase 2 design and contract documents on `feat/server-authoritative-rewards-20261107`.
2. Add the Vercel feature-preview origin to Supabase Pylearn-Dev Authentication → URL Configuration → Redirect URLs. Current branch alias: `https://pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app/**`.
3. Test email signup/sign-in with a synthetic development account only. Social provider credentials were intentionally not copied; social buttons are hidden in preview.
4. Run authenticated Edge Function tests and mobile browser regression in Android Chrome and Samsung Internet.
5. Fix any failures and re-run the source/SQL test matrix. Keep all work on the feature branch and Pylearn-Dev.
6. Do not deploy any migration/function or merge to production without a separate review and explicit user approval. The production `award-python-run` endpoint remains a separate hardening/retirement item; code-run achievement is deferred.
7. Keep this handover current and fetch it again after substantial checkpoints.

## Companion contract document

The full API request/response contract, 14 quiz answer indexes, objective challenge normalization, legacy-account transition, and development-environment gate are also recorded in [SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md](https://github.com/YAbu528/Pylearn/blob/feat/server-authoritative-rewards-20261107/docs/SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md) on `feat/server-authoritative-rewards-20261107`.


## Session checkpoint — Pylearn-Dev reward-integrity implementation started (2026-11-07)

### Environment
- Pylearn-Dev: ref `rhtfripfqwccbhcwgoxy`, organization `zcenoqlgbbmshhkreceg`, Free plan, region `eu-west-1`, status `ACTIVE_HEALTHY`, verified project creation quote $0/month.
- Production Pylearn remains `vzgbxoxscmlmacxciwze`; no production writes or deployments were made.
- Paid Supabase preview branch at US$0.01344/hour remains declined.

### Dev database and migrations
- Dev-only baseline fixture: `supabase/tests/fixtures/pylearn_dev_baseline.sql`.
- Dev-only Auth trigger fixture: `supabase/tests/fixtures/pylearn_dev_auth_trigger.sql`; mirrors production `handle_new_user` to create profile and user_stats rows for synthetic users.
- Additive migration applied only to Pylearn-Dev: `20261107194500_server_authoritative_learning_rewards.sql`.
- Explicit private-table deny-policy migration applied only to Pylearn-Dev: `20261107200500_private_reward_tables_deny_policies.sql`.
- Private evidence and attempt tables are not browser-readable. Public RPC shims are SECURITY INVOKER and execute-only for service_role; private SECURITY DEFINER implementations use an empty search_path and explicit service_role JWT checks.
- Old `public.award_learning_xp` fails closed in Pylearn-Dev. It rejects the legacy client-progress flag path.
- Rate limit: 10 attempts per 10 minutes per user/lesson/event. Answers and learner code are not stored.

### Edge Function and frontend
- `verify-learning-activity` deployed to Pylearn-Dev, ACTIVE version 1, `verify_jwt=true`.
- Function validates the JWT with Auth `getUser`, derives user ID from the authenticated session, validates all 14 quiz answer indexes and objective challenge answers for lesson IDs 2, 6 and 13, then calls the atomic RPC.
- Frontend `script.js` on the feature branch no longer ships the 14 quiz answer indexes or objective challenge expected answers. Quiz and supported objective challenge submissions use the verifier.
- Account-scoped retry queue key: `pylearn_verified_events:<uid>`. It retains transient network/5xx failures and cannot submit one user's queue under another account.
- Old flag-based reward replay and the `award-python-run` frontend call were removed. Code/debug/fill challenges keep local feedback but award no XP until trusted validators exist.
- Visible progress upserts, notes, bookmarks, reviews and challenge-attempt history remain independent.
- Vercel preview deployments use Pylearn-Dev. GitHub Pages and stable Vercel domains remain on production. Preview social sign-in is hidden because OAuth credentials were intentionally not copied.

### Tests actually run
- SQL transaction assertions passed for service-role authorization, forged-progress legacy RPC rejection, lesson quiz prerequisite, 10/10 rate limit, quiz +15 XP, lesson +20 XP, supported challenge +30 XP, duplicate idempotency, achievement unlocks, unsupported challenge rejection and legacy XP-event deduplication.
- Auth bootstrap transaction confirmed synthetic auth user creates profile and user_stats.
- Both SQL test transactions rolled back; post-test counts verified zero synthetic auth users, profiles, user_stats, XP events, evidence rows and attempts.
- Supabase security advisor returned no lints.
- GitHub Actions run 4 passed source checks (Node syntax checks for script.js and python-worker.js plus answer-key/legacy-call guards).
- Vercel preview deployment for feature branch reached READY; deployed script inspected to confirm preview dev-project routing, no client answer keys and no legacy reward calls.

### Remaining gates / risks
- Add current Vercel preview origin to Pylearn-Dev Auth Redirect URLs: `https://pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app/**`.
- Complete authenticated browser testing and Android Chrome/Samsung Internet regression.
- No authenticated browser invocation of the Edge Function has been completed yet.
- Production still has the audited legacy reward path and the separate `award-python-run` endpoint active until a separately approved production rollout. Do not say the weakness is fixed in production.
- Do not merge or deploy to production without a complete test matrix, rollback review and explicit user approval.

### Latest feature-branch references
- Branch: `feat/server-authoritative-rewards-20261107`
- Latest feature-branch HEAD after documentation updates: `2043762df53161378b4836b641f95e5899ffb02f`.
- Latest app-source preview deployment commit: `d5fc0b2ecde4fabe7b35b5365e024f0edb34ad98` (Vercel READY).
- Design doc commit: `2043762df53161378b4836b641f95e5899ffb02f`.
- Contract doc commit: `a17c4efa5b2d884404734065413a81d19e47b932`.
- Preview alias: `pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app`.


## Session checkpoint — preview/auth readiness inspection (2026-11-09)

### Work completed in this session

- Re-read this canonical handover, plus:
  - `docs/SERVER_AUTHORITATIVE_REWARDS_DESIGN.md` on `feat/server-authoritative-rewards-20261107`.
  - `docs/SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md` on `feat/server-authoritative-rewards-20261107`.
- Verified Pylearn-Dev still reports `ACTIVE_HEALTHY` at ref `rhtfripfqwccbhcwgoxy`.
- Verified Edge Function `verify-learning-activity` is still `ACTIVE`, version 1, with `verify_jwt=true`.
- Verified Phase 2 feature branch HEAD before this documentation checkpoint: `2043762df53161378b4836b641f95e5899ffb02f`.
- Verified Vercel deployment for that feature-branch HEAD is READY:
  - Deployment ID: `dpl_8bSCC1oS5CNjsXWuXUREwnK8cSqx`.
  - Deployment URL: `https://pylearn-l5p4aj3jk-yabu528s-projects.vercel.app`.
  - Branch alias: `https://pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app`.
  - The branch alias matches the preview origin recorded in the previous checkpoint.
- Retrieved the branch alias page successfully (HTTP 200) and inspected the deployed `script.js`:
  - Preview uses Supabase project ref `rhtfripfqwccbhcwgoxy`.
  - Frontend invokes `verify-learning-activity`.
  - No `award-learning-reward` frontend call was found.
  - The deployed frontend does not include the quiz answer-key field `quiz.answer`.
  - Preview sign-up sets `emailRedirectTo: location.origin`; the production path remains `https://yabu528.github.io/Pylearn/`.
- Retrieved the deployed Edge Function source and confirmed its CORS allowlist includes the branch preview alias pattern, GitHub Pages, and the stable PyLearn Vercel domain.
- User stated in the preceding conversation that the preview redirect URL had already been added to Pylearn-Dev. The branch alias was independently confirmed from Vercel deployment metadata. **The Supabase Auth URL Configuration itself was not independently read back** because the available Supabase connection does not expose an Auth configuration read action.
- No application source, database schema/data, Edge Function, or production resource was changed in this session. No authenticated browser test has yet been run.

### Current status (supersedes the earlier pending redirect note)

- Preview deployment and branch alias: **inspected; READY**.
- Preview-to-development Supabase routing: **inspected in deployed script**.
- Edge Function deployment/JWT setting: **inspected; ACTIVE version 1; JWT required**.
- Redirect allowlist: **user-reported as added; exact Supabase setting not independently read back**.
- Authenticated signup, email confirmation redirect, sign-in, reward requests, retry behavior, account switching, and mobile regression: **not yet tested**.
- Production: **unchanged**. No production rollout is authorized by this checkpoint.

### Exact next actions

1. Use only the Vercel preview branch alias:
   `https://pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app/`.
2. In the preview, create or use a **synthetic development-only account**. Do not use production accounts for this test and do not send passwords or email verification codes in chat.
3. Verify that the confirmation email arrives and that its link returns to the same preview alias (not GitHub Pages or the stable production domain). If it does not, record the exact error and inspect the Auth redirect/template configuration before changing anything.
4. Sign in and verify the authenticated session survives reload. Then test one quiz submission and inspect the server-confirmed XP response and the corresponding dev database rows. Use a disposable synthetic account and avoid creating unnecessary test data.
5. Test negative cases and idempotency: incorrect answer, lesson completion without verified quiz evidence, duplicate accepted submission, and unsupported challenge mode. Confirm no client-only result grants XP.
6. Test sign-out and account switching; then run the same focused flow in Android Chrome and Samsung Internet.
7. After each code/config change, update this handover with exact files, tests/results, branch and commit SHA. Commit the handover checkpoint, then fetch it again from GitHub and verify the saved text. Do not merge or deploy to production without a separate review and explicit user approval.

### Reference state for this checkpoint

- Canonical handover branch: `audit/reward-integrity-phase1-20261107`.
- Canonical handover path: `docs/PYLEARN_WEAKNESSES_UPDATED.md`.
- Feature branch: `feat/server-authoritative-rewards-20261107`.
- Feature branch HEAD before this handover update: `2043762df53161378b4836b641f95e5899ffb02f`.
- READY preview deployment: `dpl_8bSCC1oS5CNjsXWuXUREwnK8cSqx`.
- READY preview alias: `pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app`.
- Pylearn-Dev project ref: `rhtfripfqwccbhcwgoxy`.
- Active Edge Function: `verify-learning-activity`, version 1, `verify_jwt=true`.


## Session record — missing signup email investigation and OTP requirement (2026-11-09)

### User decisions and required behavior

- The user confirmed that email-code verification is required **only during new account registration**.
- Existing users must continue to sign in with their existing email + password flow. Do not add an OTP challenge to ordinary password sign-in.
- The user explicitly rejected **all paid options** for email delivery. Do not configure paid SMTP, create paid accounts, enable paid add-ons, or incur any cost without a new explicit decision. Current instruction is to pursue a genuinely free path only.
- Desired registration UX: after signup, show six separate digit boxes; send a six-digit code to the submitted email; verify the code on the PyLearn preview; only then complete/activate registration.
- Desired email branding: display sender name **PyLearn**, not Supabase. This is a requirement to investigate, not yet implemented.

### What was inspected in this session

- Re-fetched this canonical document from `audit/reward-integrity-phase1-20261107` before work. Starting blob SHA: `f7ed216f94838b7864429fcbb0d26c93904a9462`.
- Re-fetched feature-branch `script.js` at `feat/server-authoritative-rewards-20261107`. Blob SHA: `43a2f00237972dbf449fc1787eab965b88978684`.
- Re-inspected the signup form in `index.html`. Blob SHA: `2d296b774e979b82909d9afecaed6233e96c04fa`.
- Confirmed the current feature-preview signup implementation calls `supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: ... } })`. If there is no immediate session, it tells the user to check email for a **confirmation link**, then return and sign in. No six-digit OTP entry UI or `verifyOtp` signup handler exists in the inspected source excerpt.
- Confirmed the preview selects Pylearn-Dev project ref `rhtfripfqwccbhcwgoxy`; production routing remains separate.
- Confirmed Pylearn-Dev project status is `ACTIVE_HEALTHY`, region `eu-west-1`. This was a read-only project metadata check.

### Evidence from Pylearn-Dev Auth logs for the failed registration

- Read the development project's unified logs, filtering Auth/email-related events.
- At `2026-11-09T16:38:24Z`, Auth recorded `user_confirmation_requested` for an email signup.
- At `2026-11-09T16:38:25Z`, Auth recorded a `mail.send` event with mail type `confirmation`, using the default sender `noreply@mail.app.supabase.io`.
- The signup API request completed with HTTP 200 and came from the PyLearn feature-preview alias.
- These records establish that the Auth signup path requested confirmation and emitted a mail-send event. **They do not prove inbox delivery, acceptance by the recipient's mail server, or successful arrival in Inbox/Spam.** No delivery receipt or bounce evidence was established in this inspection.
- A detail to verify privately with the user: the recipient domain visible in the Auth log appears to be `gmile.com`. If the intended address was a Gmail address, this may be a spelling error. Do not repeat the full address in this document or in user-facing messages.
- A first query against the logs used a nonexistent `log_level` column and returned a schema error; the query was corrected by removing that column. The corrected read-only query returned the Auth and mail events described above.

### Supabase email-delivery constraints discovered in current documentation

- Current Supabase documentation says the built-in/default SMTP service is for development/testing and is heavily restricted. Without custom SMTP, it only sends to pre-authorized addresses belonging to the project's organization team; other destinations can fail as unauthorized. It also has a project-wide hourly rate limit and no delivery SLA.
- The same documentation says custom SMTP is needed to send Auth emails to arbitrary end-user addresses. The documented SMTP setup includes a sender email and `smtp_sender_name`, which is where a branded sender name such as PyLearn is configured.
- Consequently, the current free built-in SMTP service is **not a viable public-user email-delivery solution** for PyLearn. Adding ordinary learners to the Supabase organization team is not an acceptable production workaround. It could at most be used for controlled team-member testing, and must not be treated as scalable public signup delivery.
- No paid SMTP provider was selected or configured. No email settings were changed.
- Documentation consulted:
  - Supabase “Send emails with custom SMTP”: https://supabase.com/docs/guides/auth/auth-smtp
  - Supabase “Test auth flows”: https://supabase.com/docs/guides/auth/testing-auth-flows
  - Supabase password-based Auth: https://supabase.com/docs/guides/auth/passwords

### Technical design direction for the requested six-digit code

- Supabase Auth supports email OTP templates using the `{{ .Token }}` template variable and client-side verification through `supabase.auth.verifyOtp(...)`. The signup-specific flow must be confirmed against the current supabase-js version/API before implementation.
- The OTP should be requested as part of the email/password **signup confirmation** flow, not as a second factor on every sign-in.
- The browser UI should provide six accessible one-character numeric inputs (with paste/autofill support, focus movement, keyboard navigation, and a single combined code value), a Verify action, clear invalid/expired-code feedback, and a resend action that respects Auth rate limits.
- Preserve password signup, existing password sign-in, existing social sign-in behavior outside preview, account data, and reward integrity. Do not disable email confirmation or auto-confirm unverified users as a shortcut.
- Branding the body/subject of an email template may be possible independently, but the **From display name** is controlled by the configured mail sender/SMTP settings. With the current default Supabase sender, do not claim that the sender can be changed to PyLearn unless a supported free configuration is verified.

### Current result and scope boundaries

- **Root-cause evidence:** Auth attempted the confirmation-mail send through Supabase's default sender; delivery was not proven. Supabase's documented default SMTP recipient restrictions are a likely explanation if the address is not a pre-authorized organization-team address. The apparent recipient-domain spelling also needs user confirmation. Neither should be stated as a conclusively proven bounce cause.
- **OTP implementation:** not started.
- **Six-box UI:** not implemented.
- **Email template / sender settings:** not changed.
- **Paid services:** none selected or configured; user explicitly disallows paid options.
- **Application source, database schema/data, Edge Functions, Auth configuration, and production resources:** unchanged in this session.
- **Production:** untouched.

### Next actions — continue from here

1. Ask the user to confirm privately whether the email address entered during signup was spelled correctly (especially its domain); do not ask them to post the full address or any password/code in chat.
2. Determine whether the recipient is an authorized member of the Supabase organization team. Do not add anyone to the team without the user's explicit approval and do not treat team membership as the public delivery solution.
3. Inspect current Supabase Auth email OTP documentation and the exact `verifyOtp` signup type for the installed supabase-js version used by this static frontend. Establish whether Pylearn-Dev can send a test OTP to the user's authorized address using its existing free built-in SMTP.
4. Before implementing the OTP flow, decide and document a genuinely free email-delivery route for arbitrary PyLearn users. If none is available without a paid provider/domain or unsuitable restrictions, report that limitation honestly and ask the user how to prioritize the requirement; do not silently substitute a paid service or weaken email verification.
5. If a viable free test route exists, implement on `feat/server-authoritative-rewards-20261107` only: OTP signup request, six-box UI, signup OTP verification, resend/rate-limit feedback, and keep ordinary email/password sign-in unchanged. Do not alter production Auth.
6. Investigate whether sender-name branding is possible with the chosen no-cost route. Do not claim “From: PyLearn” until an actual received test email proves it.
7. Deploy only to the existing Vercel feature preview and Pylearn-Dev. Run registration, wrong-code, expired-code, resend, successful verification, duplicate signup, existing-user password sign-in, reload/session, and Android Chrome/Samsung Internet tests.
8. Record each source/configuration change, exact branch and commit, deployment ID/URL, test evidence, failures and next steps in this canonical handover. After every checkpoint update, fetch this file again and verify the saved text. No production changes or paid services without separate explicit approval.

### Source branch reference at start of this investigation

- Feature branch: `feat/server-authoritative-rewards-20261107`.
- Inspected `script.js` blob SHA: `43a2f00237972dbf449fc1787eab965b88978684`.
- Inspected `index.html` blob SHA: `2d296b774e979b82909d9afecaed6233e96c04fa`.
- Feature branch source was read only; no new feature-branch commit was created in this investigation.
- Canonical handover branch: `audit/reward-integrity-phase1-20261107`.


## Session record — OTP signup protocol and free email-provider research (2026-11-09, continuation)

### User's standing rule reaffirmed

The user clarified that “don't forget the rule” refers to the previously established quality/continuity requirements. In particular:
- Never report a fix as complete unless the relevant code/configuration has been inspected and the actual behavior tested.
- Preserve the canonical chronological handover after each substantive work step; record findings and evidence, then fetch the saved document again to verify it.
- Keep production untouched and do not incur any cost or enable paid services without explicit approval.

### Read-only inspection performed in this continuation

- Re-read the canonical handover on `audit/reward-integrity-phase1-20261107`; starting blob SHA was `9d67b803482d8809f4dfdb19c6275ba4b7941d66`.
- Re-fetched `script.js` from `feat/server-authoritative-rewards-20261107`; blob SHA remains `43a2f00237972dbf449fc1787eab965b88978684`.
- The current frontend still calls `supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo } })`, then shows a message telling the user to check email for a confirmation link and return to sign in.
- The ordinary sign-in handler still uses `signInWithPassword`. It is a separate handler and must remain unchanged by the signup OTP work.
- No `verifyOtp` or `resend` call exists in the inspected `script.js` source. There is no six-digit signup verification UI in the current inspected source.
- The development Supabase project `rhtfripfqwccbhcwgoxy` was read again and reports `ACTIVE_HEALTHY`, region `eu-west-1`, database engine PostgreSQL 17. Production project `vzgbxoxscmlmacxciwze` was not changed.
- No frontend, Supabase configuration, schema, Edge Function, or production resource was changed during this continuation.

### Current Supabase OTP API behavior verified against official docs

Official references consulted:
- JavaScript verify OTP: https://supabase.com/docs/reference/javascript/auth-verifyotp
- JavaScript resend: https://supabase.com/docs/reference/javascript/auth-resend
- Email templates: https://supabase.com/docs/guides/auth/auth-email-templates
- Passwordless email OTP guide: https://supabase.com/docs/guides/auth/auth-email-passwordless

Findings:
- Supabase's current JavaScript reference explicitly demonstrates signup OTP verification as `supabase.auth.verifyOtp({ email, token, type: 'email' })`.
- The current passwordless guide also documents six-digit email OTP verification using `type: 'email'`. This is the correct verification call shape for the email token in the documented flow; do not blindly substitute `type: 'signup'` here.
- Resending an existing signup confirmation is a distinct call: `supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo } })`.
- The email template must include `{{ .Token }}` to deliver a code rather than only a confirmation link. The template subject/body can be branded, but this does not itself change the SMTP envelope/From identity.
- OTP expiry and request rate limits are Auth configuration values; the guide documents a default one-minute resend interval and one-hour validity in the current reference material. Preserve server-enforced limits and show clear UI feedback; do not implement client-side bypasses.
- The `EmailOtpType` TypeScript union includes both `signup` and `email` values, but the current verifyOtp signup example and guide use `email`; resend uses `signup`. Follow the documented method-specific examples.
- The browser source uses the global `window.supabase.createClient` and the inspected script contains no package import. The exact CDN supabase-js version still needs to be extracted from the script tags in `index.html` before implementation; do not assume a package version.

### Free email provider research — no service selected or connected

Official references consulted:
- Supabase SMTP restrictions: https://supabase.com/docs/guides/auth/auth-smtp
- Mailjet free plan: https://documentation.mailjet.com/hc/en-us/articles/19154256993051-Understanding-Mailjet-Free-Plan-Limits
- Mailjet sender onboarding: https://documentation.mailjet.com/hc/en-us/articles/37251169295003--Quick-Start-with-Mailjet
- Brevo free plan: https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan
- Brevo sender requirements: https://help.brevo.com/hc/en-us/articles/14925263522578-Comply-with-Gmail-Yahoo-and-Microsoft-s-requirements-for-email-senders
- Resend pricing: https://resend.com/pricing

Findings:
- Supabase built-in SMTP is currently limited to pre-authorized organization-team email addresses and a very low project rate limit (currently documented as 2 messages/hour); it is explicitly best-effort and not a public signup mail solution.
- Mailjet currently advertises a no-cost tier of 6,000 emails/month, capped at 200/day, with SMTP relay. Its current onboarding guide says a sender email address can be added and verified via a confirmation link; a domain can alternatively be verified through DNS. This makes Mailjet a candidate worth checking further, but it is not yet proven that a non-domain sender can reliably deliver to public Gmail/Outlook recipients or satisfy their current sender-authentication rules. Do not configure it or represent it as a confirmed solution yet.
- Brevo currently advertises 300 emails/day on its free tier. Its current documentation says domain authentication is mandatory for transactional SMTP, free-mail sender domains such as Gmail cannot be authenticated, and free email sender addresses may be rewritten to a Brevo-managed domain. Therefore it does not currently meet the user's PyLearn From-branding requirement without a domain the user controls.
- Resend currently advertises 3,000 emails/month and 100/day on its free tier, but its onboarding examples require a verified sending domain for sending to arbitrary users; its test sender is restricted to the account owner's address. It is not currently a no-domain public signup solution.
- A custom SMTP provider can set Supabase's `smtp_sender_name` to `PyLearn`, but the actual received message must be inspected before claiming that recipients see the requested sender name.
- No provider account was created, no SMTP credentials were requested or stored, no service was connected, and no billing or paid feature was enabled.

### Recipient-domain confirmation remains pending

The prior Auth log investigation showed the attempted recipient's domain as `gmile.com`. The user has not yet confirmed whether that was intentional or a typo for `gmail.com`. Do not reproduce the full address in notes or chat. Before attempting a live recipient test, obtain that simple domain confirmation; do not ask the user to share their full email, password, or OTP.

### Next actions

1. Extract the exact Supabase JS CDN URL/version from the `index.html` script tags on the feature branch.
2. Continue checking Mailjet's sender-address-only requirements and Gmail/Outlook deliverability rules. Keep this a read-only evaluation until there is a verified free option and the user explicitly authorizes connecting it.
3. Await the user's confirmation of the recipient-domain spelling before any live delivery test.
4. If no free route can meet public-recipient delivery and PyLearn sender branding without a user-owned domain, explain that constraint plainly; do not disable email verification or auto-confirm accounts.
5. Only after a viable delivery route is established, implement signup OTP on `feat/server-authoritative-rewards-20261107`, with six digit boxes, paste/autofill/accessibility support, wrong/expired-code feedback, resend rate-limit feedback, and signup-only verification. Keep `signInWithPassword` unchanged.
6. Preview-test all relevant cases in Pylearn-Dev and on Android Chrome and Samsung Internet. Do not claim success until those tests have actually been run and observed.


### Supabase JS CDN version extraction completed

The feature-branch `index.html` was inspected in full enough to locate the script imports:
- Line 459: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
- Line 460: `<script src="script.js?v=feature-navigation-20261105-1"></script>`
- `@supabase/supabase-js@2` is a floating major-version CDN selector, not an exact pinned release. There is no package lock or imported package version in the inspected frontend path.
- Before changing auth behavior, choose and pin a tested exact v2 release in the CDN URL (and record the selected version) rather than allowing the dependency to change silently. Validate that the selected release retains the documented `signUp`, `verifyOtp`, and `resend` API shapes.
- This is an inspection finding only; `index.html` was not changed.


## Session record — recipient corrected to Gmail; Mailjet sender feasibility decision (2026-11-09)

### User clarification

The user confirmed that the recipient domain in the failed signup attempt was intended to be `gmail.com`, not `gmile.com`. The prior log observation was therefore a typing error in the attempted recipient address, not evidence that the user intended a different mail provider. Do not record or expose the full recipient address.

### Mailjet sender feasibility research completed

Current official Mailjet documentation and Gmail sender guidance were reviewed:
- Mailjet free plan limits: https://documentation.mailjet.com/hc/en-us/articles/19154256993051-Understanding-Mailjet-Free-Plan-Limits
- Mailjet sender address validation: https://documentation.mailjet.com/hc/en-us/articles/360042759253-How-to-add-a-sender-address
- Mailjet warning about free webmail sender addresses: https://documentation.mailjet.com/hc/en-us/articles/19308800104091-Why-you-should-avoid-free-webmail-as-a-sender-address
- Mailjet SPF/DKIM and domain authentication: https://www.mailjet.com/email-playbook/deliverability/domain-authentication/
- Mailjet quick start (updated 2026-11-03): https://documentation.mailjet.com/hc/en-us/articles/37251169295003--Quick-Start-with-Mailjet
- Gmail sender requirements: https://support.google.com/mail/answer/81126

Findings:
- Mailjet Free currently advertises $0/month, no credit card required to sign up, SMTP/API access, 6,000 messages/month and 200/day. This is a genuine free quota, but the quota alone does not establish that the desired sender setup is deliverable.
- Mailjet permits an individual sender address to be added and validated by clicking a confirmation link sent to that address. This is not the same as authenticating the sender domain.
- Mailjet explicitly warns that using Gmail/Outlook/Yahoo free-webmail addresses as the sender can cause spam placement or non-delivery. Its SPF/DKIM guidance says domain authentication requires control of the sending domain's DNS and cannot be configured for free-webmail domains.
- Gmail's current sender requirements say senders must authenticate their sending domain with SPF or DKIM and warns against impersonating Gmail From headers.
- Therefore, using the user's personal Gmail address as Mailjet's sender—even if the address can be verified—would not be a dependable or appropriate public signup-email solution. A display name of `PyLearn` does not solve sender-domain authentication and does not prove that recipients will see a trustworthy, authenticated PyLearn sender.
- Mailjet remains a possible free SMTP relay only if PyLearn can use a domain it controls and configure the required SPF/DKIM records. No domain ownership or DNS access has yet been established.
- No Mailjet account was created, no sender was registered, no API/SMTP credentials were generated, and no provider was connected.

### Decision and current status

- Do not configure Mailjet using a personal Gmail From address as a workaround.
- Do not claim that the sender name will appear as `PyLearn` until a real received message confirms it.
- The recipient typo is resolved: the intended recipient provider is Gmail.
- A free public signup email route with authenticated PyLearn branding is **not yet established**. A domain under the user's control with DNS access may make a free-tier SMTP route feasible, subject to the provider's actual verification and test delivery.
- Supabase built-in SMTP remains unsuitable for public signups because its default service is restricted to pre-authorized team addresses and is best-effort.
- No code, Auth settings, database, Edge Function, Vercel deployment, or production resource was changed in this continuation.

### Next decision needed

Ask whether the user owns or can manage DNS for any custom domain (not merely the GitHub Pages URL). If yes, assess whether it can be used for an authenticated sender on a free SMTP tier. If no, explain that the requirements—public Gmail delivery, no paid service, no owned domain, and authenticated `PyLearn` sender identity—may not all be achievable simultaneously with a dependable provider. Do not quietly relax any of the requirements.

### Exact handover state

- Canonical branch: `audit/reward-integrity-phase1-20261107`
- Canonical file: `docs/PYLEARN_WEAKNESSES_UPDATED.md`
- Feature source branch: `feat/server-authoritative-rewards-20261107`
- Signup source still uses confirmation-link `signUp`; ordinary sign-in still uses `signInWithPassword`.
- No OTP UI or `verifyOtp`/resend handler has been implemented.
- The next implementation step remains blocked on establishing a viable free, authenticated email sender. Keep production untouched and require explicit approval before connecting any provider.


## Standing project continuity and evidence rule — user-mandated (2026-11-09)

This rule is mandatory for every future PyLearn session and must be read before project work resumes.

### Canonical record
- The single source of truth is this file: `docs/PYLEARN_WEAKNESSES_UPDATED.md`.
- Repository: `YAbu528/Pylearn`.
- Canonical handover branch: `audit/reward-integrity-phase1-20261107`, unless a later entry explicitly changes it.
- Do not create a parallel weakness report, replace this record with a summary, or rely only on chat memory.
- Before making a project change, fetch and read the latest version of this file. Continue from its exact latest checkpoint.
- After every substantive inspection, discovery, attempt, failure, decision, implementation, test, or change in next steps, append a dated, structured entry here. Record negative results and unsuccessful attempts, not just successes.
- Save the entry to GitHub with a clear commit message. Then fetch the file again and verify that the new entry was actually saved. Report the commit SHA and new blob SHA.
- Never say an entry was saved, committed, deployed, tested, or fixed unless the corresponding operation succeeded and was independently checked.
- If a change cannot be committed immediately, state that clearly and preserve the exact unsaved work in the chat until it can be recorded. Do not silently treat an unsaved note as part of the canonical document.

### Required structure for every work entry
Record:
1. Date and session purpose.
2. Starting branch, commit SHA, file path and relevant blob SHA.
3. User decisions, constraints and approvals, including explicit refusals and cost limits.
4. What was inspected, including exact files/configuration/resources and relevant versions or identifiers.
5. Every attempt made, with outcome; include failures, errors, limitations and what was not established.
6. Changes actually made, with exact files, branch and commit SHA. If no changes were made, say so explicitly.
7. Tests actually run, environment/device, expected result and observed result. Separate inspected, tested, user-reported and unverified states.
8. Production/development impact and confirmation of what was not touched.
9. Current status and unresolved risks.
10. Exact next actions in plain English, in order.
11. A traceability table containing a stable task ID, planned/actual commit message, branch, commit SHA (or explicitly “PENDING — not committed”), and verification status. Never invent a SHA or attach a future commit SHA before it exists.

### Strict verification and safety boundaries
- Inspection is not testing. A successful deployment is not proof of correct runtime behavior. A user report is not independent verification. Label evidence accurately.
- Never describe a weakness as fixed until the relevant behavior has been tested and the result observed. If only source inspection was performed, say “inspected, not runtime-tested.”
- Keep production untouched unless the user gives separate explicit approval for the specific production change.
- Do not incur costs, select paid plans, enable paid features, or create billable resources without the user's explicit approval. The user's prior rejection of the US$0.01344/hour Supabase development branch remains binding.
- Use the existing free Pylearn-Dev environment and feature preview where appropriate; use synthetic accounts/data only.
- Keep work on a feature branch and preview first. Do not merge or deploy to production without a separate review and explicit approval.
- Do not expose secrets, passwords, OTPs, API keys, private user data, or full email addresses in this document.
- If a chat is approaching its context limit, create and verify a complete checkpoint here before switching chats. The next chat must retrieve this file first and continue from the last verified entry.

### User's latest email-delivery constraint
- The user confirmed they do **not** own or have access to DNS settings for any custom domain.
- This is now a firm constraint unless the user later changes it. Do not assume a custom domain can be acquired, configured, or used.
- The required signup behavior remains: six-digit email code only for new account registration; ordinary existing-user email/password sign-in remains unchanged.
- The user has not authorized any paid email service. No paid option is allowed.
- No email provider has been selected or connected, and no SMTP credentials exist in this workflow.

## Session record — no custom-domain DNS access; email path decision pending (2026-11-09)

### User clarification
The user explicitly answered that they do not own or have access to DNS settings for any custom domain. This removes the custom-domain authentication route previously considered for free SMTP providers. The user also issued the strict canonical-record rule above and requires every discovery, attempt, failure, decision, next action and commit reference to be saved in this file for future-chat continuity.

### Current evidence-based position
- Supabase built-in SMTP remains restricted to authorized team addresses and is not an acceptable public signup mail route.
- Mailjet sender-address-only verification does not provide authenticated domain identity; its own guidance warns against free-webmail sender addresses. A personal Gmail sender is not an acceptable dependable public service workaround.
- Brevo's documented sender/domain restrictions do not meet the requested branded sender requirement without a domain.
- Resend's public-user sending path requires a verified domain; its test sender is not a public signup solution.
- The user has no custom-domain DNS access, and no provider has been authorized or connected.
- Therefore, **a dependable free public signup email route that also presents an authenticated PyLearn sender identity has not been established**. Do not present the earlier provider candidates as a working solution.
- The six-digit OTP UI and verification handler remain unimplemented. The existing signup flow still uses Supabase confirmation-link behavior; ordinary password sign-in uses `signInWithPassword`.
- No code, Auth configuration, database, Edge Function, Vercel deployment, or production resource was changed as part of this decision.

### Next move — research alternatives before implementation
1. Investigate whether a no-cost, no-user-domain route can meet public Gmail delivery and signup-only six-digit OTP, using a provider-managed sender identity (for example, a managed authentication email service). Check current official pricing, free-tier limits, sender requirements, account eligibility and whether it can integrate without replacing or weakening the existing Supabase account model.
2. Consider whether a managed sender that displays its own service identity is acceptable. Do **not** assume this relaxes the user's PyLearn sender-branding requirement; ask before adopting it if that is the only free route.
3. Compare the cost and migration risks of keeping Supabase Auth versus an alternative identity provider. Do not migrate users or change auth architecture during research.
4. If no acceptable free route exists, present the real constraint and ask the user to choose which requirement (sender branding, no-domain requirement, or public email OTP) may be relaxed. Do not silently disable email verification, auto-confirm accounts, substitute a link, or impose OTP on existing sign-ins.
5. Only after a feasible route and user approval are established, implement on `feat/server-authoritative-rewards-20261107`, deploy only to Pylearn-Dev and the Vercel preview, and run the complete signup/sign-in/mobile test matrix. Production remains untouched.

### Traceability / planned work
| Task ID | Work | Branch | Planned commit message | Commit SHA | Status |
|---|---|---|---|---|---|
| EMAIL-ALT-01 | Research managed-sender free alternatives and Supabase-compatible integration | `feat/server-authoritative-rewards-20261107` (research first; no code change) | `docs: evaluate free signup email delivery without custom domain` | PENDING — not committed | Next |
| EMAIL-OTP-02 | Implement six-digit signup-only OTP if a compliant route is approved | `feat/server-authoritative-rewards-20261107` | `feat(auth): add signup-only email OTP verification` | PENDING — not authorized/implemented | Blocked |
| EMAIL-TEST-03 | Preview and Android regression tests after implementation | Feature preview / Pylearn-Dev only | `test(auth): verify signup OTP and existing sign-in flows` | PENDING — not run | Blocked |
| PROD-REVIEW-04 | Review production rollout separately | Production | No production commit planned | PENDING — requires separate explicit approval | Not authorized |

### Record update status
This entry is being appended to the canonical handover on `audit/reward-integrity-phase1-20261107`. It records the user's DNS clarification and continuity rule. It does not claim that the email-delivery issue is solved.

# PyLearn feature-preservation audit

**Scope:** preview branch `architecture/multipage-foundation` only. Do not merge PR #31 or change the live GitHub Pages site during this work.

**Reference:** the original live single-page experience, retained in the preview as `legacy.html`. The classic page is the source of truth for existing behavior and content; the multipage experience should preserve those capabilities rather than silently replace them.

## Page-by-page comparison

| Area | Original live experience | Multipage preview status | Work / remaining gap |
|---|---|---|---|
| Home | Hero, account entry, progress dashboard, learning overview and section navigation | New landing page with route cards and a sign-in entry | Keep the new page, but make sign-in and the path into learning unmistakable |
| Welcome / authentication | Email sign-in and registration, Google and Microsoft OAuth | Dedicated `/welcome/` authentication route exists and is linked from the home CTA and shared footer | Verify the route and both auth flows in the protected preview on mobile and desktop |
| Dashboard | XP, lesson progress, next step, insights, missions, themes and badges | Basic account statistics and lesson progress | Migrate the original insights, mission board, theme collection and badge/achievement views |
| Learning path | 14 lessons, progress states, search and saved-study context | 14-lesson list | Restore lesson search and convenient access to saved lessons/bookmarks |
| Lesson workspace | Explanations, analogy, worked example, objectives, step-by-step guidance, common mistakes, recap, optional practice, quiz, notes, bookmarks, completion, challenge and review schedule | Core lesson structure existed; the preview lacked several original teaching panels | Restored detailed guidance, common mistakes, quick recap, the original optional practice set, bookmarks and review scheduling. Verify account sync and lesson completion |
| Python playground | Real Pyodide execution, input/output, editor controls, challenges and lesson loading | Separate playground with a module worker and challenge modes | Hardened worker startup/retry handling and added direct loading of optional practice starters. Still requires real Chrome and Samsung Internet execution tests |
| Projects | Guided project lab, project completion and project-related progress | Six project idea cards; tracker/lab not yet migrated | Restore the original interactive project lab and saved completion behavior |
| Study tools | Search, saved lessons/bookmarks and notes | Notes and bookmarks are available inside lesson pages; the full study-tools hub is not yet migrated | Add a central saved-items/search view to the multipage experience |
| Achievements | Badge collection and progress toward badges | Remains in the classic experience | Migrate badge collection and unlock progress to the dashboard |
| Profile | Basic account information | Expanded account-management page | Added profile details, avatar URL, email/password controls, connected-provider display, learning summary, theme preference and session sign-out controls |
| Branding / layout | Dark navy surfaces, blue accents, light theme, responsive header and footer logos | New pages had mixed violet/blue accents; Playground did not receive the same page theme variables | Standardized accents to the original blue palette, widened the desktop Playground layout, and aligned shared footer branding. Verify rendered mobile/desktop layouts |

## Fixes made in this pass

- Kept all code changes on the preview branch.
- Made the welcome authentication route easier to reach from shared navigation.
- Unified multipage accents with the original PyLearn blue palette and dark navy surfaces.
- Added the shared page theme variables to the Playground so its injected header/footer receive valid colors.
- Increased the Playground's desktop content width.
- Improved mobile logo sizing and footer-logo alignment.
- Fixed the Playground's worker-startup failure path so worker import errors and message errors release the loading state and allow retry.
- Expanded Profile into a multi-section account-management page.
- Restored detailed lesson guidance, common mistakes, recap, optional practice, bookmark controls and review scheduling.

## Verification still required

The Vercel preview is protected, so automated unauthenticated page fetches return the Vercel access screen rather than the application. Source inspection is possible, but that is not a substitute for rendered testing. Before calling this pass complete, verify:

1. `/` and `/welcome/` load directly and the email, Google and Microsoft flows remain functional.
2. Header and footer logos are visible and aligned at mobile widths in Chrome and Samsung Internet, and at desktop widths.
3. The Playground starts Pyodide, runs simple code, handles input, returns errors, and successfully retries after a startup failure.
4. Profile changes, email/password updates, saved learning statistics, notes, bookmarks and review schedules behave correctly with a signed-in account.
5. No route, page content or auth redirect regresses.

## Remaining feature-preservation work

1. Migrate dashboard insights, missions, theme collection and badges.
2. Migrate the full project lab and project completion.
3. Restore a central search and saved-study hub.
4. Complete cross-page responsive and authentication regression testing.

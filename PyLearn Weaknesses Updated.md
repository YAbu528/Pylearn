# PyLearn — Project Memory and Weaknesses Tracker

Last updated: 2026-11-17
Repository: https://github.com/YAbu528/Pylearn
Live site: https://yabu528.github.io/Pylearn/
Current contact-form branch: `feature/contact-return-feedback-20261117`
Current pull request: https://github.com/YAbu528/Pylearn/pull/41

> This document is the continuity record for future PyLearn work. Update it whenever meaningful work is done: decisions, implementation details, failures, test evidence, unresolved issues, and the exact next step. Do not silently replace or omit previous findings.

---

## 1. Project purpose and working principles

PyLearn is intended to become a complete, practical Python-learning ecosystem, not just a static collection of lessons. It should combine clear teaching, hands-on coding, projects, learner progress, and a coherent gamified experience.

Working principles:
- Preserve the existing working features; inspect before changing shared code.
- Work on a feature branch, not directly on `main`.
- Build a Vercel preview and let the owner test it before merging.
- Never claim a fix is complete or tested without actual evidence.
- Do not merge or change production without the owner's explicit approval.
- Make small safe improvements without unnecessary announcements; explain major changes and risks.
- Record the work, failures, decisions, tests, and remaining work here.
- The owner's manual mobile testing is important. Main test device is a Samsung Galaxy A15 (Android 14); desktop testing is not reliably available.
- Keep solutions mindful of free-tier and low-data constraints. Avoid introducing paid subscriptions or large downloads without discussing the trade-off first.
- Development progress is more important than preserving disposable test data, but never delete real user data without explicit approval.

## 2. Known technical setup

- Frontend repository: `YAbu528/Pylearn`.
- Production hosting: GitHub Pages at `https://yabu528.github.io/Pylearn/`.
- Vercel is connected for preview deployments.
- Supabase is used for authentication and cloud-synchronized learner data.
- Authentication already tested: email/password with confirmation, Google, Microsoft, and GitHub. Apple sign-in was postponed because of the developer membership cost.
- The site includes lessons, Python playground, projects, challenges, progress/XP, badges, notes, bookmarks, themes, and a footer/legal section.
- Do not place private credentials, passwords, app passwords, OAuth tokens, or service-role keys in browser code or GitHub.

## 3. Important completed work and verified behavior

The following items were reported as completed and tested in prior work. Re-test if a later change touches them:
- Guest activity no longer falsely appears as cloud-saved progress.
- Signed-in learning progress synchronizes through Supabase.
- XP accounting mismatch between Chrome and Samsung browser was fixed.
- Notes and bookmarks synchronize across browsers.
- Lesson, quiz, challenge, project, bookmark, and level-up feedback were tested.
- Badge unlocks persist after refresh and do not repeatedly announce an already-earned badge.
- Theme unlocks and light/dark theme behavior were tested.
- Google, Microsoft, and GitHub authentication were tested; Apple sign-in remains postponed.
- Footer and navigation cleanups have been completed in previous preview/merge cycles.
- Google Search Console verification and sitemap submission were completed; indexing was requested.

Do not infer that all these areas remain defect-free after future code changes. Re-test affected paths.

## 4. Current task — Contact Us feedback and email submission

### The actual user problem

The original footer Contact Us action used a `mailto:` link. PyLearn opened the visitor's email application. After the visitor sent the email—or cancelled and returned—PyLearn could not know which action occurred. It therefore could not give the visitor useful, reliable feedback.

The problem is **not** that opening an email application is inherently undesirable. The problem is that PyLearn cannot observe whether the visitor actually sent the message and cannot tell them what happened after they return.

### Agreed requirement

The current selected approach is an on-site contact form that sends the message through an email service in the background. This allows PyLearn to receive a provider response and give the visitor feedback.

Required user-facing messages:
- Success: `Your message has been submitted successfully.`
- Failure: `We couldn't submit your message. Please try again.`

Critical rule:
- Never show success merely because the visitor clicked Send, closed a dialog, or returned from another application.
- Show success only after the email service explicitly accepts the send request.
- If the service rejects the request, configuration is missing, the SDK is unavailable, or the response is unexpected, show failure.
- Provider acceptance is not proof of final inbox placement, absence of a later bounce, or that the recipient read the message. The UI should say submitted successfully, not guarantee delivered/read.

### Current implementation on the feature branch

Branch: `feature/contact-return-feedback-20261117`
PR: https://github.com/YAbu528/Pylearn/pull/41
PR state at this checkpoint: open, not merged.
Latest recorded PR head commit before this memory-file update: `87ad77f4d8b2868bbb0510b2e8f5453bd863c810`.

Changed files:
1. `index.html`
   - Footer Contact Us opens an accessible native dialog.
   - Form collects name, email, subject, and message.
   - Includes required-field validation and a hidden honeypot field.
   - Loads the EmailJS browser SDK.
2. `script.js`
   - Sends the form through EmailJS `sendForm`.
   - Requires an explicit HTTP 200 response before showing success and resetting the form.
   - Uses the exact agreed success/failure toast messages.
   - Keeps entered data on failure so the visitor can retry.
   - Disables the submit button while sending and applies a client-side throttle.
   - EmailJS public key, service ID, and template ID are currently blank placeholders.
3. `style.css`
   - Adds responsive dialog/form styling and focus states.
4. `privacy.html`
   - Adds a disclosure about contact-form information and EmailJS processing.
5. `CONTACT_FORM_SETUP.md`
   - Records provider setup, template fields, testing steps, and delivery-confirmation limits.

EmailJS template configuration expected by the code:
- Variables: `from_name`, `from_email`, `subject`, `message`.
- Fixed recipient: `pylearnnotification@gmail.com`.
- Reply-To: `{{from_email}}`.
- Use the provider's authorization flow to connect the mailbox; never request or commit Gmail passwords or app passwords.
- Only the EmailJS public key, service ID, and template ID belong in the browser configuration. Never expose a private key or other secret.
- Restrict allowed origins to the exact production and preview origins; do not use a wildcard.
- EmailJS account eligibility/terms must be followed. Do not bypass age requirements; an eligible account owner must handle setup as allowed by the provider's terms.

### Current status

Completed in code:
- [x] On-site form UI and dialog.
- [x] Required fields and browser validation.
- [x] Provider request path and explicit success-response check.
- [x] Exact success and failure feedback.
- [x] Failure keeps the message available for retry.
- [x] Loading/disabled submit state and basic honeypot/throttle.
- [x] Privacy disclosure added to the preview branch.
- [x] Setup/testing notes created.

Not completed:
- [ ] Configure an eligible EmailJS account, service, and template.
- [ ] Add the three public EmailJS identifiers to the feature branch.
- [ ] Confirm the exact allowed origins in the provider dashboard.
- [ ] Test a successful message and verify it arrives in the PyLearn support inbox.
- [ ] Test a genuine provider/network failure and confirm the failure message appears without losing the visitor's text.
- [ ] Test dialog layout and behavior on the Samsung Galaxy A15 in both themes.
- [ ] Re-check the privacy wording and provider settings before launch.
- [ ] Rebuild and inspect the latest Vercel preview after any new commit.
- [ ] Merge only after the owner explicitly approves.

Important: the code currently has blank EmailJS identifiers, so real email sending is not enabled yet. A preview showing the failure message before configuration is expected; it is not evidence that live email delivery works.

## 5. Other known priorities and weaknesses

These are previously raised priorities, not claims that work has already started:
- Review backend/source-control gaps and ensure critical backend configuration and changes are documented.
- Investigate the Python playground loading experience. The current client-side Python engine download was reported as over 200 MB; compare a server-side execution design before changing architecture.
- Continue curriculum expansion after the foundation and current maintenance work.
- Consider comments and recommendations/AI features only after the core foundation is reliable.
- Improve the profile/account-management experience beyond displaying an email and editing a name.
- Preserve the intended gamified-learning feel without making the learning experience feel forced.
- Re-test mobile layout, header/footer branding, and all pages after multi-page or shared CSS changes.

## 6. Testing and change log

### 2026-11-17 — Contact Us implementation checkpoint

- The original issue was clarified: `mailto:` cannot report back to PyLearn whether the visitor sent or cancelled the message.
- The owner selected the on-site form approach so PyLearn can receive a response from an email service and provide reliable feedback.
- PR #41 was updated to implement the form and EmailJS request path.
- Static code inspection confirmed that the success path checks for HTTP 200 before resetting the form and showing success.
- Static code inspection confirmed that the failure path uses the requested failure toast and does not reset the form.
- EmailJS identifiers are blank; no live send has been verified.
- Manual visual/mobile testing and actual delivery testing have not yet been performed in this checkpoint.
- The original requested file `PyLearn Weaknesses Updated.md` was not present on either `main` or the current feature branch, and no matching project-memory document was found in the accessible Library. This file is being created now on the feature branch to restore the requested continuity record. It is not yet merged into production.

### How to continue

At the start of a new chat, read this file and `CONTACT_FORM_SETUP.md` before asking the owner to repeat project context. Then inspect the current PR/branch and deployment state because these can change. Continue from the first unchecked item in the relevant task. Update this file after each meaningful action, including failures and the evidence for any claimed test result.


### Additional checkpoint — 2026-11-17, continuation

- Created `PyLearn Weaknesses Updated.md` on the feature branch as the persistent project-memory record. It captures project purpose, workflow rules, known completed features, current contact-form work, outstanding weaknesses, and handoff instructions.
- Cleaned and updated `CONTACT_FORM_SETUP.md` so the root problem, provider-confirmation boundary, setup steps, and test status are consistent. The privacy-policy disclosure is now marked complete.
- Updated PR #41 to describe the actual problem accurately: the `mailto:` flow gives PyLearn no way to tell whether the visitor sent or cancelled; the selected on-site form lets PyLearn receive a provider response.
- Latest Vercel deployment verified before this memory-file update: `https://pylearn-orjwpee09-yabu528s-projects.vercel.app`, state READY, commit `87ad77f4d8b2868bbb0510b2e8f5453bd863c810`.
- Fetched the deployed preview HTML successfully (HTTP 200) and verified it contains the Contact Us opener, contact dialog, contact form, EmailJS browser SDK reference, and the current contact-form script cache reference.
- This is a static deployment/HTML check only. It does not verify mobile layout, visual quality, form interaction in a real browser, EmailJS configuration, or actual email delivery.
- No email-provider account was configured and no email was sent. No production changes were made. PR #41 remains open and unmerged.
- Next action: let the latest documentation commit finish its Vercel preview build, then the owner should manually test the preview on the Samsung phone. Only after UI testing should provider setup and real-send/failure testing proceed.

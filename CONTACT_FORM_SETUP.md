# PyLearn Contact Form — Setup and Test Record

Last updated: 2026-11-17
Feature branch: `feature/contact-return-feedback-20261117`
Pull request: https://github.com/YAbu528/Pylearn/pull/41
Latest preview deployment (READY): https://pylearn-pvu1js2c8-yabu528s-projects.vercel.app

## 1. The problem and agreed solution

The original footer `mailto:` action opens the visitor's email application. When the visitor returns to PyLearn, the website cannot know whether the visitor sent the email or cancelled. The issue is the missing feedback, not the act of opening an email application.

The selected solution is an on-site contact form that submits through an email service and gives PyLearn a provider response it can use to inform the visitor.

Exact notifications:
- Success: **Your message has been submitted successfully.**
- Failure: **We couldn't submit your message. Please try again.**

PyLearn must never show success just because the Send button was clicked. It must wait for an explicit successful response from the email service.

## 2. Current implementation

The footer's **Contact Us** link opens an on-site dialog with:
- Name
- Email address
- Subject
- Message
- Hidden honeypot field for basic bot filtering

The browser sends the form through the EmailJS SDK. The code:
- Checks required fields with browser validation.
- Checks the honeypot.
- Disables the submit button while the request is in progress.
- Applies a client-side request throttle.
- Requires an explicit HTTP 200 response before it resets the form or displays success.
- Displays the exact failure toast if configuration is missing, the SDK is unavailable, the request rejects, or the response is unexpected.
- Keeps the entered message when a request fails so the visitor can retry.

**Current limitation:** EmailJS public key, service ID, and template ID are blank placeholders. Real email sending is therefore not enabled yet. A failure notification before provider configuration is expected.

## 3. Delivery confirmation boundary

An HTTP 200 response confirms that EmailJS accepted the submission request. It does not independently prove that the recipient's mail provider placed the message in the inbox, rule out a later bounce or spam placement, or prove that the recipient read it.

For that reason, the visitor-facing success message says **submitted successfully** rather than guaranteeing **delivered** or **read**. During the real-send test, the message must also be checked in the PyLearn support inbox.

## 4. EmailJS setup requirements

EmailJS was selected for this static GitHub Pages site because it can connect to a mailbox through the provider's authorization flow without putting a Gmail password or SMTP app password in the website.

Account eligibility and supervision terms must be followed. Do not bypass age requirements or supervision rules. If an eligible account owner cannot configure the service under the provider's terms, stop and choose a compliant alternative rather than bypassing those requirements.

Official setup guides:
- https://www.emailjs.com/docs/tutorial/adding-email-service/
- https://www.emailjs.com/docs/tutorial/creating-email-template/
- https://www.emailjs.com/docs/tutorial/creating-contact-form/
- https://www.emailjs.com/pricing/

Required configuration:
1. Connect the PyLearn support mailbox (`pylearnnotification@gmail.com`) using the provider's supported authorization flow. Never share or commit mailbox passwords or app passwords.
2. Allow only the exact production origin `https://yabu528.github.io` and the exact Vercel preview origin. Do not use a wildcard.
3. Create a template with `{{from_name}}`, `{{from_email}}`, `{{subject}}`, and `{{message}}`.
4. Set the fixed **To Email** to `pylearnnotification@gmail.com`.
5. Set **Reply-To** to `{{from_email}}`. Keep the From address controlled by the connected service.
6. Send a dashboard test and confirm it reaches the support inbox.
7. Add only the EmailJS **Public Key**, **Service ID**, and **Template ID** to the `PYLEARN_EMAIL_CONFIG` object in `script.js`.
8. Never put an EmailJS private key, OAuth token, Gmail password, or app password in browser-visible files or GitHub.

## 5. Test checklist

- [ ] Owner opens the latest Vercel preview on the Samsung Galaxy A15.
- [ ] Open Contact Us from the footer.
- [ ] Check the dialog in dark and light themes.
- [ ] Submit empty/invalid fields and confirm browser validation.
- [ ] Confirm the dialog is usable on a narrow mobile screen and does not overflow.
- [ ] Configure an eligible EmailJS account, service, and template.
- [ ] Add the three public identifiers on the feature branch.
- [ ] Confirm allowed origins are exact and restricted.
- [ ] Submit a valid test message; confirm the success toast appears only after the provider accepts it.
- [ ] Verify the message actually arrives in `pylearnnotification@gmail.com` and Reply-To points to the visitor's email.
- [ ] Test a genuine provider/network failure; confirm the failure toast appears and the entered text remains available for retry.
- [ ] Review EmailJS request history/quota and privacy settings.
- [ ] Re-check the Privacy Policy disclosure before launch.
- [ ] Owner explicitly approves before merge.

## 6. Status at 2026-11-17

Completed in the feature branch:
- [x] Replaced the footer's `mailto:` link with an on-site contact dialog.
- [x] Added name, email, subject, and message fields.
- [x] Added required-field validation and a honeypot.
- [x] Added responsive styling, focus states, and loading/disabled submit state.
- [x] Added provider submission and explicit HTTP 200 success check.
- [x] Added the exact success and failure notifications.
- [x] Confirmed by static code review that the failure path does not reset the form.
- [x] Updated the Privacy Policy disclosure for contact-form data and EmailJS processing.
- [x] Created `PyLearn Weaknesses Updated.md` as the long-term project memory record.
- [x] Latest Vercel preview build for commit `1df0069b9793aac036bcdc095e5020e353aa3805` reached READY.

Still pending:
- [ ] Configure the EmailJS service and template under compliant account ownership.
- [ ] Add the three public identifiers.
- [ ] Perform the owner's manual mobile/theme/layout test.
- [ ] Perform a real successful email test and verify receipt in the support inbox.
- [ ] Perform a failure/retry test.
- [ ] Merge only after explicit owner approval.

## 7. Change log — 2026-11-17

- Clarified the real requirement: users need feedback because PyLearn cannot observe whether a `mailto:` message was sent or cancelled.
- Implemented an on-site form so PyLearn can wait for a provider response before reporting success or failure.
- Audited the submit handler: only HTTP 200 is accepted as success; failure preserves the message.
- Added the delivery-confirmation boundary so the UI does not overpromise inbox delivery.
- Created the missing project-memory file `PyLearn Weaknesses Updated.md` on the feature branch. It records the broader project context, workflow rules, known completed work, current task, and next priorities.
- Static preview fetch returned HTTP 200 and the deployed HTML contains the contact dialog, EmailJS SDK reference, and updated script reference.
- No real email was sent in this checkpoint. No manual device test was performed in this checkpoint.
- Production was not changed. PR #41 remains open and unmerged.

# PyLearn Contact Form Setup

## Current implementation

The footer's **Contact Us** link opens an on-site form with name, email address, subject, message, and a hidden honeypot field for basic bot filtering.

The browser sends the form through EmailJS. PyLearn only shows the success notification after EmailJS accepts the request. If the SDK is unavailable, account configuration is missing, or the request fails, the form shows the failure notification and keeps the visitor's message in the form.

## Email delivery provider

EmailJS was selected for this static GitHub Pages site because it can connect to an existing Gmail mailbox without putting a Gmail password or SMTP app password in the website. Its current terms require users to be at least 16; users who are under the age of majority must use it only under the supervision of a parent or guardian who agrees to the terms. The account setup therefore must follow those terms; do not create an account in violation of them. Its browser SDK uses a public key, service ID, and template ID. The public key is designed to be exposed in browser code; do not add an EmailJS private key or Gmail password to the repository.

Official setup guides:
- https://www.emailjs.com/docs/tutorial/adding-email-service/
- https://www.emailjs.com/docs/tutorial/creating-email-template/
- https://www.emailjs.com/docs/tutorial/creating-contact-form/
- Pricing and current limits: https://www.emailjs.com/pricing/

## Required account configuration

1. Create an EmailJS email service and connect the PyLearn support Gmail account (pylearnnotification@gmail.com) using the provider's authorization flow. Do not share Gmail passwords or app passwords.
2. Add the exact PyLearn production origin (`https://yabu528.github.io`) and the current Vercel preview origin to EmailJS's allowed-origin/whitelist settings. Do not use a wildcard origin.
3. Send and receive a test email from the EmailJS dashboard.
4. Create a template with these variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, and `{{message}}`.
5. Set the template's fixed **To Email** to pylearnnotification@gmail.com.
6. Set **Reply-To** to `{{from_email}}`. Keep the sender/from address controlled by the connected service rather than trusting a visitor-supplied From address.
7. Copy the EmailJS **Public Key**, **Service ID**, and **Template ID** into the `PYLEARN_EMAIL_CONFIG` object near the contact-form code in `script.js`.
8. Never add a private key, OAuth token, Gmail password, or app password to browser-visible files or GitHub.

## Notifications

- Success: Your message has been submitted successfully.
- Failure: We couldn't submit your message. Please try again.

The success message means EmailJS accepted the submission request. It does not guarantee final delivery by the recipient's mail provider; check the support inbox during testing.

## Testing checklist

- [ ] Open Contact Us from the footer on mobile and desktop.
- [ ] Check the dialog in dark and light themes.
- [ ] Submit with required fields empty and confirm browser validation.
- [ ] Submit a valid test message and confirm success appears only after EmailJS accepts it.
- [ ] Confirm the message arrives in pylearnnotification@gmail.com and Reply-To points to the visitor's email.
- [ ] Simulate a failed request in the preview branch and confirm the failure notification appears while entered text remains available for retry.
- [ ] Check EmailJS request history and quota.
- [ ] Update PyLearn's Privacy Policy to disclose contact-form data and EmailJS processing before public launch.

## Status at 2026-11-17

- [x] Replaced the footer mailto link with an on-site contact dialog.
- [x] Added responsive styling and mobile-friendly fields.
- [x] Added required-field validation, a honeypot field, disabled/loading submit state, and duplicate-click protection.
- [x] Added success/failure toast handling.
- [x] Added EmailJS browser SDK integration.
- [ ] Create/connect EmailJS service and contact template.
- [ ] Add the three public EmailJS identifiers to the branch.
- [ ] Confirm EmailJS origin restrictions are set to the exact production and preview domains.
- [ ] Test actual successful delivery and failure behavior on the Samsung phone.
- [ ] Update privacy disclosure before launch.
- [ ] Merge only after preview testing and explicit approval.

## Notes

The old mailto return reminder is no longer used by the contact link. The feature remains on the existing preview branch and is not production-ready until the provider is configured and a real test email is received.
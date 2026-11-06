# PyLearn — Hosting and runtime notes

PyLearn is a static frontend backed by Supabase Auth, Postgres, and Edge Functions.

## Hosting

The public GitHub Pages site is:
https://yabu528.github.io/Pylearn/

The frontend files are served statically. Keep `index.html`, `style.css`, `script.js`, and `python-worker.js` in the same directory unless the worker URL in `script.js` is changed. Serve over HTTPS; do not open the page with `file://`.

## Python playground

PyLearn uses Pyodide 314.0.7 from jsDelivr and initializes it in a dedicated Web Worker when the learner opens the playground or requests Python execution. The browser does **not** download the entire 200+ MB Pyodide full distribution just to start Python.

The 200+ MB figure refers to the complete Pyodide release archive with all vendored optional packages. A browser session fetches the runtime files needed to initialize Python, then fetches additional package files only if code imports/loads those packages. The exact transferred amount depends on the runtime build, compression, browser cache, and packages used. Measure it in the browser Network panel on a cold cache before quoting a fixed number.

The runtime is browser-side:
- Python code runs in a Web Worker on the learner's device.
- The page remains responsive while Python runs.
- The runtime can be cached by the browser/CDN.
- Initial setup still requires network access, and low-bandwidth devices may experience a noticeable first-load delay.

Do not move arbitrary learner code to a server-side execution service without a separate security and cost design. Server execution requires strong isolation, CPU/memory/time limits, concurrency controls, abuse protection, and careful handling of filesystem/network access.

## Supabase source control

See [BACKEND_SOURCE_RECONCILIATION.md](supabase/BACKEND_SOURCE_RECONCILIATION.md) for the verified deployed function sources and the known migration-history gap.

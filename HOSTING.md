# PyLearn — Static Hosting

PyLearn is now frontend-only. There is no backend, server-side database, or login system.

## Hosting

Upload these files to any static host:

- `index.html`
- `style.css`
- `script.js`
- `python-worker.js`

Serve the site over **HTTPS** (or `http://localhost` during development). Do not open `index.html` directly with `file://`; browser workers and browser security policies can block it.

Examples of static hosting include GitHub Pages, Netlify, and similar services that serve JavaScript/WASM correctly.

## Python engine

PyLearn loads Pyodide only when the Playground is opened or Python execution is needed. The worker imports the current Pyodide 0.314.0.7 module build from jsDelivr. The browser can cache the downloaded engine after the first load.

The first Python load can still be large because the full Pyodide distribution is over 200 MB. This is a Pyodide limitation, not a PyLearn backend requirement.

## Important

Keep `python-worker.js` beside `index.html` unless you update the Worker path in `script.js`.

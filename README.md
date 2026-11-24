# Smart Campus — code-based vs low-code comparison (Practice #12)

The same small feature, a room availability checker for one fictional campus room,
implemented twice against one shared contract ([CONTRACT.md](CONTRACT.md)).

| Folder | What |
| --- | --- |
| `code-based/` | HTML + JavaScript. `rules.js` = validation + availability rules (pure functions), `app.js` = UI only, `test-cases.js` = shared T1–T8 inputs, `rules.test.mjs` = automated tests |
| `low-code/` | Appsmith version: export and build notes |
| `docs/` | Screenshots and the report |

## Run the code-based version

Open it through a local web server (ES modules do not load from `file://`):

```
cd code-based
python -m http.server 8000
# open http://localhost:8000
```

Live demo (GitHub Pages): see the repository description.

## Tests

Requires Node.js 18+. No dependencies to install.

```
npm test
```

The page also has a **Run T1–T8** button that runs the same eight cases in the browser.

## Data and security

- Fictional data only; no login, database, secrets or network calls.
- All user-visible text is written with `textContent`, never `innerHTML`.
- No third-party runtime dependencies.

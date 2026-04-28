# Forma Design System Tracker — Agent Context

This file gives any Claude agent full context about this project so it can make good decisions without asking.

---

## What this project is

A design system tracker website for **Autodesk Forma's** internal design system — called **Forma Weave 3.0 Extended**. It extends Autodesk's official design system (Weave 3.0) with Forma-specific custom components.

The tracker is a static HTML/CSS/JS website hosted on GitHub Pages. It tracks component coverage (done / in progress / missing), shows documentation for completed components, and displays real screenshots from Figma.

**Live site:** https://lordfritzoe.github.io/forma-ds-tracker/
**GitHub repo:** https://github.com/LordFritzoe/forma-ds-tracker (personal account: LordFritzoe — NOT the Autodesk org)

---

## File structure

```
forma-ds-tracker/
  index.html              — Single-page app shell (4 page divs, no build step)
  style.css               — Notion-style design (light, clean, document-like)
  app.js                  — All rendering logic, navigation, localStorage persistence
  data.js                 — All data: components, categories, docs, workflow steps
  fetch-screenshots.js    — Node.js script to download screenshots via Figma REST API
  AGENT.md                — This file
  assets/
    component-map.json    — Maps component IDs → screenshot paths + Figma URLs (written by fetch-screenshots.js)
    screenshots/
      *.png               — Usage example screenshots from the product Figma file
      components/
        comp-*.png        — Component screenshots from the design system Figma file
  changelog.txt           — One line per daily agent run
```

---

## Figma files

| Role | File key | URL |
|------|----------|-----|
| Design system | `HSbzKTshEump0RAkbDWntE` | https://www.figma.com/design/HSbzKTshEump0RAkbDWntE/Forma-Weave-3.0-Extended |
| Product examples | `94M2gPsLpg4LS0xCkJeOu6` | https://www.figma.com/design/94M2gPsLpg4LS0xCkJeOu6/BD---Global-launch |

### Known design system page node IDs

| Component | Page node ID | Notes |
|-----------|-------------|-------|
| Button | `13:8` | |
| Checkbox | `28:10548` | |
| Color Picker | `16:1089` | Extended / Custom |
| Dialog | `28:13563` | |
| Dropdown | `18:7148` | |
| Header (Section Header) | `21:8710` | Extended / Custom — forma-extended-header |
| Icon Button | `28:13938` | |
| Inputs (Text Input) | `28:13560` | |
| Menu | `28:13281` | |
| Panel | `28:13562` | |
| Radio Button | `18:7151` | |
| Slider | `18:7152` | |
| Tab | `21:6971` | |
| Tag | `21:7249` | |
| Toggle | `21:8709` | |
| Tooltip | `28:13564` | |

No dedicated Divider page exists in the design system file.

---

## How the data works

Everything lives in `data.js`. There are three main sections:

### `DS_DATA.components` array
One entry per component. Key fields:
- `id` — kebab-case, matches keys in `docs` and `component-map.json`
- `status` — `done | in-progress | missing | review`
- `source` — `weave | custom | token`
- `figmaNode` — page node ID in the design system file (e.g. `"13:8"`)
- `hasDoc: true` — when a matching entry exists in `DS_DATA.docs`

Status changes made in the browser UI are saved to **localStorage** per device — they do not write back to `data.js`. Only agent edits to `data.js` are shared with colleagues.

### `DS_DATA.docs` object
Keyed by component ID. Each doc has:
- `overview` — 1–2 sentences
- `variants` — array of `{ name, description }`
- `usage` — array of bullet strings (when to use)
- `doNot` — array of bullet strings
- `weaveComponents` — array of Weave 3.0 component names this depends on
- `usageExamples` — array of `{ nodeId, label, note }` pointing to product file frames
- `figmaUrl` — direct link to the component page (overridden by `component-map.json` at runtime)

### `assets/component-map.json`
Written by `fetch-screenshots.js`. Maps component IDs to downloaded screenshot paths and Figma URLs. Loaded at runtime by `app.js` via `fetch()`. Takes precedence over `figmaUrl` values in `data.js`.

---

## Daily monitoring agent

A Claude cron agent runs every morning at **8:47 AM** (session-only, must be recreated if Claude Code restarts).

**What it does:**
1. Reads `data.js` to understand current state
2. Scans the design system Figma file using `mcp__figma-desktop__get_metadata` (requires Figma desktop app to be open)
3. If new component frames are found → adds them to `components` array in `data.js`
4. If a component looks complete → updates status to `done`, adds a doc entry, sets `hasDoc: true`
5. Appends a line to `changelog.txt`
6. Commits and pushes `data.js` + `changelog.txt` via git

**Figma MCP dependency:** The agent can only scan Figma when the desktop app is running. If it's closed, the agent logs "MCP disconnected" to the changelog and still pushes the changelog entry.

**Git push method:** Uses `gh auth token` to authenticate over HTTPS (SSH verification failed in this environment):
```bash
git push "$(gh auth token | xargs -I{} echo https://LordFritzoe:{}@github.com/LordFritzoe/forma-ds-tracker.git)" main
```

---

## Updating screenshots

Run once with a Figma personal access token (read-only scope is enough):
```bash
node fetch-screenshots.js YOUR_FIGMA_TOKEN
```

This downloads:
- Component screenshots from the design system file → `assets/screenshots/components/comp-[id].png`
- Usage example screenshots from the product file → `assets/screenshots/[nodeId].png`
- Writes `assets/component-map.json`

Then commit and push:
```bash
git add assets/ && git commit -m "chore: update screenshots" && git push
```

**Important:** Revoke the token after use — it appears in shell history.

---

## Adding a new component doc

1. Add the component to `DS_DATA.components` with `hasDoc: true`
2. Add a matching entry to `DS_DATA.docs` — follow the existing minimal style
3. Optionally add `usageExamples` pointing to product file frame node IDs
4. Run `fetch-screenshots.js` to download the component screenshot
5. Commit and push

---

## Design principles for this site

- **Notion-style aesthetic** — white background, `#37352f` text, light gray sidebar, clean typography, no dark mode
- **Keep docs short** — overview (1–2 sentences), variants table, when-to-use bullets, do/don't. No long anatomy sections
- **No build step** — plain HTML/CSS/JS, open `index.html` directly or serve statically
- **localStorage for live edits** — status dropdowns save locally per browser; only `data.js` edits are shared via GitHub

---

## Owner

Fredrik Ingebrethsen — Designer at Autodesk Forma
GitHub: LordFritzoe (personal — not the Autodesk org account)

// Downloads two sets of screenshots:
//   1. Component screenshots from the design system file (Forma-Weave-3.0-Extended)
//   2. Usage example screenshots from the product file (BD Global launch)
//
// Usage:
//   node fetch-screenshots.js YOUR_FIGMA_TOKEN
//
// Get a token at: figma.com → Settings → Personal access tokens (read-only is enough)

const https = require("https");
const fs = require("fs");
const path = require("path");

const TOKEN = process.argv[2];
if (!TOKEN) { console.error("Usage: node fetch-screenshots.js YOUR_FIGMA_TOKEN"); process.exit(1); }

const DS_FILE_KEY   = "HSbzKTshEump0RAkbDWntE"; // Forma-Weave-3.0-Extended (design system)
const EX_FILE_KEY   = "94M2gPsLpg4LS0xCkJeOu6"; // BD Global launch (usage examples)
const OUT_COMP      = path.join(__dirname, "assets", "screenshots", "components");
const OUT_EXAMPLES  = path.join(__dirname, "assets", "screenshots");

// Components to find in the design system file — matched against page/frame names
const COMPONENT_TARGETS = [
  { id: "button",         names: ["button"] },
  { id: "icon-button",    names: ["icon button", "iconbutton"] },
  { id: "text-input",     names: ["text input", "textinput", "input"] },
  { id: "dropdown",       names: ["dropdown", "select"] },
  { id: "color-picker",   names: ["color picker", "colorpicker"] },
  { id: "divider",        names: ["divider"] },
  { id: "section-header", names: ["section header", "header", "forma-extended-header"] },
];

// Usage example node IDs from the product file (found via Figma scan)
const EXAMPLE_NODES = [
  "871:45784", "871:46532", "871:46936",
  "843:45562", "834:44429", "868:32850",
  "2782:77141", "855:20120",
];

// ---- Helpers ----
function apiGet(path) {
  return new Promise((res, rej) => {
    const opts = { hostname: "api.figma.com", path, headers: { "X-Figma-Token": TOKEN } };
    https.get(opts, r => {
      let d = "";
      r.on("data", c => d += c);
      r.on("end", () => res({ status: r.statusCode, body: d }));
    }).on("error", rej);
  });
}

function downloadFile(url, dest) {
  return new Promise((res, rej) => {
    const file = fs.createWriteStream(dest);
    https.get(url, r => {
      if (r.statusCode === 302 || r.statusCode === 301) {
        file.close();
        return downloadFile(r.headers.location, dest).then(res).catch(rej);
      }
      r.pipe(file);
      file.on("finish", () => { file.close(); res(); });
    }).on("error", e => { fs.unlink(dest, () => {}); rej(e); });
  });
}

function exportNodes(fileKey, nodeIds, scale = 2) {
  const ids = nodeIds.map(n => encodeURIComponent(n)).join(",");
  return apiGet(`/v1/images/${fileKey}?ids=${ids}&scale=${scale}&format=png`).then(r => {
    if (r.status !== 200) throw new Error(`Image export failed (${r.status}): ${r.body}`);
    const parsed = JSON.parse(r.body);
    if (parsed.err) throw new Error(`Figma error: ${parsed.err}`);
    return parsed.images;
  });
}

// ---- Step 1: Find component pages in the design system file ----
async function findComponentNodes() {
  console.log("\n📐 Scanning design system file for component pages...");
  const { status, body } = await apiGet(`/v1/files/${DS_FILE_KEY}?depth=2`);
  if (status !== 200) throw new Error(`File fetch failed (${status}): ${body}`);

  const file = JSON.parse(body);
  const pages = file.document.children; // array of page nodes

  const found = {}; // componentId → { nodeId, pageName }

  for (const page of pages) {
    const pageName = page.name.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();

    for (const target of COMPONENT_TARGETS) {
      if (found[target.id]) continue;
      if (target.names.some(n => pageName.includes(n))) {
        // Find the first real frame on this page
        const frames = (page.children || []).filter(c => c.type === "FRAME" || c.type === "COMPONENT" || c.type === "COMPONENT_SET");
        const bestFrame = frames[0];
        if (bestFrame) {
          found[target.id] = { nodeId: bestFrame.id, pageName: page.name, frameId: page.id };
          console.log(`  ✓ Found "${target.id}" → page "${page.name}" (node ${bestFrame.id})`);
        } else {
          // Use the page itself
          found[target.id] = { nodeId: page.id, pageName: page.name, frameId: page.id };
          console.log(`  ✓ Found "${target.id}" → page "${page.name}" (page node ${page.id})`);
        }
      }
    }
  }

  const missing = COMPONENT_TARGETS.filter(t => !found[t.id]).map(t => t.id);
  if (missing.length) console.log(`  ⚠ Not found: ${missing.join(", ")}`);

  return found;
}

// ---- Step 2: Download component screenshots ----
async function downloadComponentScreenshots(found) {
  if (!Object.keys(found).length) { console.log("  Nothing to download."); return {}; }

  fs.mkdirSync(OUT_COMP, { recursive: true });

  const nodeIds = Object.values(found).map(f => f.nodeId);
  const images = await exportNodes(DS_FILE_KEY, nodeIds, 2);

  const nodeMap = {};
  for (const [compId, info] of Object.entries(found)) {
    nodeMap[info.nodeId] = compId;
  }

  console.log("\n📥 Downloading component screenshots...");
  const results = {}; // compId → { file, nodeId, figmaUrl }

  for (const [nodeId, imgUrl] of Object.entries(images)) {
    const compId = nodeMap[nodeId];
    if (!compId || !imgUrl) { console.log(`  ⚠ No image for ${nodeId}`); continue; }

    const filename = `comp-${compId}.png`;
    const dest = path.join(OUT_COMP, filename);
    process.stdout.write(`  ${compId}... `);
    await downloadFile(imgUrl, dest);
    console.log("✓");

    const nodeForUrl = (found[compId].frameId || nodeId).replace(":", "-");
    results[compId] = {
      file: `assets/screenshots/components/${filename}`,
      nodeId,
      figmaUrl: `https://www.figma.com/design/${DS_FILE_KEY}/Forma-Weave-3.0-Extended?node-id=${nodeForUrl}`,
    };
  }

  return results;
}

// ---- Step 3: Download usage example screenshots ----
async function downloadExampleScreenshots() {
  fs.mkdirSync(OUT_EXAMPLES, { recursive: true });

  console.log("\n📥 Downloading usage example screenshots...");
  const images = await exportNodes(EX_FILE_KEY, EXAMPLE_NODES, 2);

  for (const [nodeId, imgUrl] of Object.entries(images)) {
    if (!imgUrl) { console.warn(`  ⚠ No image for ${nodeId}`); continue; }
    const filename = nodeId.replace(":", "-") + ".png";
    const dest = path.join(OUT_EXAMPLES, filename);
    if (fs.existsSync(dest)) { console.log(`  ${filename} already exists, skipping`); continue; }
    process.stdout.write(`  ${filename}... `);
    await downloadFile(imgUrl, dest);
    console.log("✓");
  }
}

// ---- Step 4: Write node mapping JSON ----
function writeMapping(results) {
  const mapPath = path.join(__dirname, "assets", "component-map.json");
  const existing = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, "utf8")) : {};
  const merged = { ...existing, ...results };
  fs.writeFileSync(mapPath, JSON.stringify(merged, null, 2));
  console.log(`\n📄 Mapping written to assets/component-map.json`);
}

// ---- Main ----
async function run() {
  try {
    const found = await findComponentNodes();
    const results = await downloadComponentScreenshots(found);
    await downloadExampleScreenshots();
    if (Object.keys(results).length) writeMapping(results);

    console.log("\n✅ Done. Commit and push:");
    console.log("  cd ~/forma-ds-tracker && git add assets/ && git commit -m 'chore: update screenshots' && git push");
  } catch (e) {
    console.error("\n❌ Error:", e.message);
    process.exit(1);
  }
}

run();

// Run once to download example screenshots from Figma:
//   node fetch-screenshots.js YOUR_FIGMA_TOKEN
//
// Get a token at: figma.com → Settings → Personal access tokens

const https = require("https");
const fs = require("fs");
const path = require("path");

const TOKEN = process.argv[2];
if (!TOKEN) { console.error("Usage: node fetch-screenshots.js YOUR_FIGMA_TOKEN"); process.exit(1); }

const FILE_KEY = "94M2gPsLpg4LS0xCkJeOu6";
const OUT_DIR = path.join(__dirname, "assets", "screenshots");

// Node IDs to download — mapped from the BD Global launch overview page
const NODES = [
  "871:45784",  // Façade panel (light)
  "871:46532",  // Façade panel (dark)
  "871:46936",  // Site limit panel
  "843:45562",  // Units panel
  "834:44429",  // Building panel
  "868:32850",  // Façade automation — Simple
  "2782:77141", // Façade automation — empty state
  "855:20120",  // Wall panel
];

function get(url, headers) {
  return new Promise((res, rej) => {
    https.get(url, { headers }, r => {
      let d = "";
      r.on("data", c => d += c);
      r.on("end", () => res({ status: r.statusCode, body: d }));
    }).on("error", rej);
  });
}

function download(url, dest) {
  return new Promise((res, rej) => {
    const file = fs.createWriteStream(dest);
    https.get(url, r => {
      r.pipe(file);
      file.on("finish", () => { file.close(); res(); });
    }).on("error", e => { fs.unlink(dest, () => {}); rej(e); });
  });
}

async function run() {
  const ids = NODES.map(n => n.replace(":", "-")).join(",");
  const apiUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${NODES.map(n => encodeURIComponent(n)).join(",")}&scale=2&format=png`;

  console.log("Fetching image URLs from Figma...");
  const { status, body } = await get(apiUrl, { "X-Figma-Token": TOKEN });

  if (status !== 200) {
    console.error(`Figma API error ${status}:`, body);
    process.exit(1);
  }

  const { images, err } = JSON.parse(body);
  if (err) { console.error("Figma error:", err); process.exit(1); }

  for (const [nodeId, imgUrl] of Object.entries(images)) {
    if (!imgUrl) { console.warn(`  ⚠ No image for ${nodeId}`); continue; }
    const filename = nodeId.replace(":", "-") + ".png";
    const dest = path.join(OUT_DIR, filename);
    process.stdout.write(`  Downloading ${filename}... `);
    await download(imgUrl, dest);
    console.log("✓");
  }

  console.log("\nDone. Now commit and push:");
  console.log("  cd ~/forma-ds-tracker && git add assets/ && git commit -m 'chore: add example screenshots' && git push");
}

run().catch(e => { console.error(e); process.exit(1); });

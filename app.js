// ---- State ----
const state = {
  currentPage: "dashboard",
  currentDoc: null,
  currentCategory: null,
  statusFilter: "all",
  searchQuery: "",
  overrides: {},
  componentMap: {}, // loaded from assets/component-map.json if available
};

// Try loading component-map.json (written by fetch-screenshots.js)
fetch("assets/component-map.json")
  .then(r => r.ok ? r.json() : {})
  .then(data => { state.componentMap = data; })
  .catch(() => {});

// ---- Boot ----
function init() {
  loadOverrides();
  renderSidebar();
  navigate("dashboard");
}

// ---- Persistence ----
function loadOverrides() {
  try { state.overrides = JSON.parse(localStorage.getItem("fds-overrides") || "{}"); } catch {}
}

function saveOverrides() {
  localStorage.setItem("fds-overrides", JSON.stringify(state.overrides));
}

function getComp(id) {
  const base = DS_DATA.components.find(c => c.id === id);
  return base ? { ...base, ...(state.overrides[id] || {}) } : null;
}

function setCompStatus(id, value) {
  state.overrides[id] = state.overrides[id] || {};
  state.overrides[id].status = value;
  saveOverrides();
}

// ---- Stats ----
function stats() {
  const all = DS_DATA.components.map(c => getComp(c.id));
  return {
    total: all.length,
    done: all.filter(c => c.status === "done").length,
    inProgress: all.filter(c => c.status === "in-progress").length,
    missing: all.filter(c => c.status === "missing").length,
  };
}

// ---- Navigate ----
function navigate(page, extra = {}) {
  state.currentPage = page;
  state.currentDoc = extra.doc || null;
  state.currentCategory = extra.category || null;
  if (page !== "components" && page !== "category") {
    state.statusFilter = "all";
    state.searchQuery = "";
  }

  // Sidebar highlight
  document.querySelectorAll(".nav-item").forEach(el => {
    const match =
      (el.dataset.page === page) ||
      (page === "category" && el.dataset.cat === extra.category) ||
      (page === "doc" && el.dataset.doc === extra.doc);
    el.classList.toggle("active", match);
  });

  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));

  if (page === "dashboard")      { renderDashboard(); show("page-dashboard"); }
  else if (page === "components" || page === "category") { renderComponents(extra.category); show("page-components"); }
  else if (page === "workflow")  { renderWorkflow(); show("page-workflow"); }
  else if (page === "tokens")    { renderTokens(); show("page-tokens"); }
  else if (page === "doc")       { renderDoc(extra.doc); show("page-doc"); }
}

function show(id) { document.getElementById(id).classList.add("active"); }

// ---- Sidebar ----
function renderSidebar() {
  const s = stats();
  const catMissing = {};
  DS_DATA.components.forEach(c => {
    const comp = getComp(c.id);
    if (comp.status === "missing") catMissing[c.category] = (catMissing[c.category] || 0) + 1;
  });

  document.getElementById("sidebar-nav").innerHTML = `
    <div class="nav-section-label">Overview</div>
    <button class="nav-item" data-page="dashboard" onclick="navigate('dashboard')">
      <span class="nav-emoji">🏠</span> Dashboard
    </button>
    <button class="nav-item" data-page="components" onclick="navigate('components')">
      <span class="nav-emoji">📦</span> All Components
      <span class="nav-badge">${s.missing} missing</span>
    </button>
    <button class="nav-item" data-page="tokens" onclick="navigate('tokens')">
      <span class="nav-emoji">🎨</span> Tokens
    </button>
    <button class="nav-item" data-page="workflow" onclick="navigate('workflow')">
      <span class="nav-emoji">📋</span> Workflow Guide
    </button>

    <div class="nav-section-label">Categories</div>
    ${DS_DATA.categories.map(cat => `
      <button class="nav-item" data-cat="${cat.id}" onclick="navigate('category',{category:'${cat.id}'})">
        <span class="nav-emoji">${cat.icon}</span> ${cat.label}
        ${catMissing[cat.id] ? `<span class="nav-badge">${catMissing[cat.id]}</span>` : ""}
      </button>
    `).join("")}

    <div class="nav-section-label">Documentation</div>
    ${DS_DATA.components.filter(c => c.hasDoc).map(c => `
      <button class="nav-item" data-doc="${c.id}" onclick="navigate('doc',{doc:'${c.id}'})">
        <span class="nav-emoji">📄</span> ${c.name}
      </button>
    `).join("")}
  `;
}

// ---- Dashboard ----
function renderDashboard() {
  const s = stats();
  const pct = n => Math.round((n / s.total) * 100);

  const highMissing = DS_DATA.components.map(c => getComp(c.id))
    .filter(c => c.status === "missing" && c.priority === "high").slice(0, 8);

  const inProgress = DS_DATA.components.map(c => getComp(c.id))
    .filter(c => c.status === "in-progress").slice(0, 8);

  document.getElementById("page-dashboard").innerHTML = `
    <div class="page-wrap">
      <div class="page-icon">🎨</div>
      <div class="page-title">Forma Design System</div>
      <div class="page-subtitle">
        Weave 3.0 Extended &nbsp;·&nbsp; ${s.total} tracked &nbsp;·&nbsp;
        Last updated ${DS_DATA.meta.lastUpdated} &nbsp;·&nbsp;
        <a href="${DS_DATA.meta.figmaUrl}" target="_blank">Open Figma ↗</a>
      </div>

      <div class="stats-row">
        <div class="stat-block"><div class="sv">${s.total}</div><div class="sl">Total</div></div>
        <div class="stat-block done"><div class="sv">${s.done}</div><div class="sl">Done · ${pct(s.done)}%</div></div>
        <div class="stat-block progress"><div class="sv">${s.inProgress}</div><div class="sl">In Progress · ${pct(s.inProgress)}%</div></div>
        <div class="stat-block missing"><div class="sv">${s.missing}</div><div class="sl">Missing · ${pct(s.missing)}%</div></div>
      </div>

      <div class="two-col">
        <div>
          <div class="section-heading">🔴 High-priority missing</div>
          <div class="quick-list">
            ${highMissing.map(c => `
              <div class="quick-item" onclick="navigate('components')">
                <div class="qi-dot missing"></div>
                <div class="qi-name">${c.name}</div>
                <div class="qi-source">${c.source === "weave" ? "Weave 3.0" : "Custom"}</div>
              </div>
            `).join("") || `<div style="padding:10px 0;color:var(--text-3);font-size:13px">None — looking good!</div>`}
          </div>
        </div>
        <div>
          <div class="section-heading">🟡 In progress</div>
          <div class="quick-list">
            ${inProgress.map(c => `
              <div class="quick-item" onclick="navigate('components')">
                <div class="qi-dot in-progress"></div>
                <div class="qi-name">${c.name}</div>
                <div class="qi-source">${c.notes ? c.notes.split(".")[0] : ""}</div>
              </div>
            `).join("") || `<div style="padding:10px 0;color:var(--text-3);font-size:13px">Nothing in progress</div>`}
          </div>
        </div>
      </div>

      <div class="page-divider"></div>

      <div class="section-heading">Progress by category</div>
      <div class="cat-progress-list">
        ${DS_DATA.categories.map(cat => {
          const comps = DS_DATA.components.filter(c => c.category === cat.id).map(c => getComp(c.id));
          const done = comps.filter(c => c.status === "done").length;
          const total = comps.length;
          const p = total > 0 ? Math.round((done / total) * 100) : 0;
          return `
            <div class="cat-row" onclick="navigate('category',{category:'${cat.id}'})">
              <div class="cat-name">${cat.icon} ${cat.label}</div>
              <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${p}%"></div></div>
              <div class="cat-pct">${p}%</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// ---- Components table ----
function renderComponents(filterCat) {
  const search = state.searchQuery.toLowerCase();
  let comps = DS_DATA.components.map(c => getComp(c.id));

  if (filterCat) comps = comps.filter(c => c.category === filterCat);
  if (state.statusFilter !== "all") comps = comps.filter(c => c.status === state.statusFilter);
  if (search) comps = comps.filter(c => c.name.toLowerCase().includes(search) || (c.notes || "").toLowerCase().includes(search));

  const cat = filterCat ? DS_DATA.categories.find(c => c.id === filterCat) : null;
  const title = cat ? `${cat.icon} ${cat.label}` : "All Components";
  const s = stats();

  // Group by category
  const groups = {};
  comps.forEach(c => { if (!groups[c.category]) groups[c.category] = []; groups[c.category].push(c); });

  const statusLabel = { done: "Done", "in-progress": "In Progress", missing: "Missing", review: "Review" };
  const sourceLabel = { weave: "Weave 3.0", custom: "Custom", token: "Token" };

  document.getElementById("page-components").innerHTML = `
    <div class="page-wrap wide">
      <div class="page-title">${title}</div>
      <div class="page-subtitle">${comps.length} items · <a href="${DS_DATA.meta.figmaUrl}" target="_blank">Figma ↗</a></div>

      <div class="controls">
        <input class="search-input" type="text" placeholder="Search..." value="${state.searchQuery}"
          oninput="state.searchQuery=this.value; renderComponents('${filterCat || ''}')">
        <button class="filter-btn ${state.statusFilter==='all'?'active':''}" onclick="state.statusFilter='all'; renderComponents('${filterCat || ''}')">All</button>
        <button class="filter-btn ${state.statusFilter==='done'?'active':''}" onclick="state.statusFilter='done'; renderComponents('${filterCat || ''}')">Done</button>
        <button class="filter-btn ${state.statusFilter==='in-progress'?'active':''}" onclick="state.statusFilter='in-progress'; renderComponents('${filterCat || ''}')">In Progress</button>
        <button class="filter-btn ${state.statusFilter==='missing'?'active':''}" onclick="state.statusFilter='missing'; renderComponents('${filterCat || ''}')">Missing</button>
      </div>

      ${comps.length === 0 ? `<div class="empty-msg">No components match your filters.</div>` : `
        <table class="comp-table">
          <thead>
            <tr>
              <th style="width:24px"></th>
              <th>Name</th>
              <th>Status</th>
              <th>Source</th>
              <th>Priority</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(groups).map(([catId, items]) => {
              const catInfo = DS_DATA.categories.find(c => c.id === catId);
              return `
                <tr class="cat-group-row">
                  <td colspan="7">${catInfo?.icon || ""} ${catInfo?.label || catId}</td>
                </tr>
                ${items.map(c => `
                  <tr>
                    <td><span style="font-size:8px;color:var(--text-3)">●</span></td>
                    <td class="name-cell ${c.hasDoc ? "has-doc" : ""}"
                      onclick="${c.hasDoc ? `navigate('doc',{doc:'${c.id}'})` : ''}">
                      ${c.name}${c.hasDoc ? " ↗" : ""}
                    </td>
                    <td>
                      <select class="status-select" onchange="setCompStatus('${c.id}',this.value); renderComponents('${filterCat || ''}')" onclick="event.stopPropagation()">
                        <option value="done" ${c.status==="done"?"selected":""}>✓ Done</option>
                        <option value="in-progress" ${c.status==="in-progress"?"selected":""}>⟳ In Progress</option>
                        <option value="missing" ${c.status==="missing"?"selected":""}>○ Missing</option>
                        <option value="review" ${c.status==="review"?"selected":""}>◎ Review</option>
                      </select>
                    </td>
                    <td><span class="chip ${c.source}">${sourceLabel[c.source]||c.source}</span></td>
                    <td><span class="chip ${c.priority==="high"?"high":""}" style="${c.priority!=="high"?"color:var(--text-3);background:none;padding:0":""}">${c.priority}</span></td>
                    <td style="max-width:260px;color:var(--text-3);font-size:12px">${c.notes || "—"}</td>
                    <td>${c.figmaNode ? `<a href="${DS_DATA.meta.figmaUrl}?node-id=${c.figmaNode.replace(":","-")}" target="_blank" style="font-size:11px">Figma ↗</a>` : ""}</td>
                  </tr>
                `).join("")}
              `;
            }).join("")}
          </tbody>
        </table>
      `}
    </div>
  `;
}

// ---- Workflow ----
function renderWorkflow() {
  const w = DS_DATA.workflow;
  document.getElementById("page-workflow").innerHTML = `
    <div class="page-wrap">
      <div class="page-icon">📋</div>
      <div class="page-title">Figma Workflow Guide</div>
      <div class="page-subtitle">A structured approach to building the Forma design system fast</div>

      <div class="section-heading">Steps</div>
      ${w.steps.map(step => `
        <div class="workflow-step-block" id="step-${step.id}">
          <div class="wf-header" onclick="toggleStep(${step.id})">
            <div class="wf-num">${step.id}</div>
            <div class="wf-title">${step.title}</div>
            <div class="wf-time">${step.time}</div>
            <div class="wf-toggle">⌄</div>
          </div>
          <div class="wf-body">
            <div class="wf-desc">${step.description}</div>
            <div class="wf-tips">
              ${step.tips.map(t => `<div class="wf-tip">${t}</div>`).join("")}
            </div>
            <div class="wf-figma-tip"><strong>Figma tip:</strong> ${step.figmaTip}</div>
          </div>
        </div>
      `).join("")}

      <div class="page-divider"></div>

      <div class="section-heading">Suggested 6-week sprint plan</div>
      <div class="sprint-grid">
        ${w.priorities.map(p => `
          <div class="sprint-card">
            <div class="sprint-week">Week ${p.week}</div>
            <div class="sprint-focus">${p.focus}</div>
            ${p.items.map(i => `<div class="sprint-item">${i}</div>`).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `;
  const first = document.getElementById("step-1");
  if (first) first.classList.add("open");
}

function toggleStep(id) {
  const el = document.getElementById(`step-${id}`);
  if (el) el.classList.toggle("open");
}

// ---- Tokens page ----
function renderTokens() {
  const t = DS_DATA.tokens;

  function hexToRgba(hex) {
    const h = hex.replace("#", "");
    const hasAlpha = h.length === 8;
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    const a = hasAlpha ? (parseInt(h.slice(6,8),16)/255).toFixed(2) : null;
    return hasAlpha ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`;
  }

  function isLight(hex) {
    const h = hex.replace("#","").slice(0,6);
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return (r*299 + g*587 + b*114)/1000 > 140;
  }

  function colorRow(tok) {
    const bg = tok.value;
    const textColor = isLight(bg) ? "#363636" : "#ffffff";
    const isTransparent = bg.toLowerCase().endsWith("00") || bg === "#FFFFFF00";
    return `
      <div class="token-color-row">
        <div class="token-swatch ${isTransparent ? "token-swatch-transparent" : ""}" style="background:${bg};">
          ${isTransparent ? '<span style="font-size:9px;color:#999">none</span>' : ""}
        </div>
        <div class="token-info">
          <div class="token-name">${tok.name}</div>
          <div class="token-meta">
            <span class="token-value">${tok.value}</span>
            ${!isTransparent ? `<span class="token-rgba">${hexToRgba(tok.value)}</span>` : ""}
          </div>
          <div class="token-usage">${tok.usage}</div>
        </div>
      </div>
    `;
  }

  document.getElementById("page-tokens").innerHTML = `
    <div class="page-wrap">
      <div class="page-icon">🎨</div>
      <div class="page-title">Tokens</div>
      <div class="page-subtitle">Real Weave 3.0 token values — scanned directly from the Figma file on ${DS_DATA.meta.lastUpdated}</div>

      <div class="page-divider"></div>

      <!-- COLORS -->
      <div class="tokens-section-title">Color</div>
      <p class="tokens-section-desc">Semantic color tokens built on top of Weave 3.0 primitives. Always use semantic tokens in components — never raw hex or generic primitives.</p>

      ${t.colors.map(group => `
        <div class="token-group">
          <div class="token-group-name">${group.group}</div>
          <div class="token-group-desc">${group.description}</div>
          <div class="token-color-list">
            ${group.tokens.map(tok => colorRow(tok)).join("")}
          </div>
        </div>
      `).join("")}

      <div class="page-divider"></div>

      <!-- TYPOGRAPHY -->
      <div class="tokens-section-title">Typography</div>
      <p class="tokens-section-desc">Weave 3.0 uses <strong>ArtifaktElement</strong> exclusively. Composite font tokens combine size, weight, and line-height into a single token.</p>

      <div class="token-group">
        <div class="token-group-name">Type styles</div>
        <div class="token-group-desc">Composite tokens used in components.</div>
        <div class="token-type-list">
          ${t.typography.styles.map(s => `
            <div class="token-type-row">
              <div class="token-type-preview" style="font-size:${s.size}px;font-weight:${s.weight};line-height:${s.lineHeight}px;">
                The quick brown fox
              </div>
              <div class="token-info">
                <div class="token-name">${s.name}</div>
                <div class="token-meta">
                  <span class="token-value">${s.size}px</span>
                  <span class="token-rgba">lh ${s.lineHeight}</span>
                  <span class="token-rgba">weight ${s.weight}</span>
                </div>
                <div class="token-usage">${s.label}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="token-group">
        <div class="token-group-name">Size & line-height primitives</div>
        <table class="doc-table">
          <thead><tr><th>Token</th><th>Size</th><th>Line height</th></tr></thead>
          <tbody>
            ${t.typography.sizes.map(s => `
              <tr>
                <td>${s.name}</td>
                <td>${s.value}px</td>
                <td>${s.lineHeight}px</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="token-group">
        <div class="token-group-name">Weight primitives</div>
        <table class="doc-table">
          <thead><tr><th>Token</th><th>Value</th><th>Style</th></tr></thead>
          <tbody>
            ${t.typography.weights.map(w => `
              <tr>
                <td>${w.name}</td>
                <td>${w.value}</td>
                <td style="font-weight:${w.value}">${w.label}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="page-divider"></div>

      <!-- SPACING -->
      <div class="tokens-section-title">Spacing</div>
      <p class="tokens-section-desc">4px-based scale. Use semantic spacing tokens — not raw pixel values. Fixed tokens don't respond to density settings; variable tokens may scale.</p>

      <div class="token-group">
        <div class="token-spacing-list">
          ${t.spacing.map(s => `
            <div class="token-spacing-row">
              <div class="token-spacing-vis-wrap">
                <div class="token-spacing-vis" style="width:${Math.max(s.px, 1)}px;height:16px;"></div>
              </div>
              <div class="token-info">
                <div class="token-name">${s.name}</div>
                <div class="token-meta"><span class="token-value">${s.value}px</span></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="page-divider"></div>

      <!-- BORDERS -->
      <div class="tokens-section-title">Borders & Radius</div>

      <div class="token-group" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <div class="token-group-name">Border radius</div>
          <table class="doc-table">
            <thead><tr><th>Token</th><th>Value</th><th>Preview</th></tr></thead>
            <tbody>
              ${t.borders.radius.map(r => `
                <tr>
                  <td>${r.name}</td>
                  <td>${r.value}px</td>
                  <td><div style="width:28px;height:18px;border:1.5px solid #006da2;border-radius:${r.value}px;"></div></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div>
          <div class="token-group-name">Border width</div>
          <table class="doc-table">
            <thead><tr><th>Token</th><th>Value</th><th>Preview</th></tr></thead>
            <tbody>
              ${t.borders.width.map(w => `
                <tr>
                  <td>${w.name}</td>
                  <td>${w.value}px</td>
                  <td><div style="width:32px;height:${w.value}px;background:#363636;"></div></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="page-divider"></div>

      <!-- ELEVATION -->
      <div class="tokens-section-title">Elevation</div>
      <p class="tokens-section-desc">Drop shadows applied at component level. Do not stack multiple elevation tokens on one element.</p>

      <div class="token-group">
        ${t.elevation.map(e => `
          <div class="token-elevation-row">
            <div class="token-elevation-preview" style="${e.css}"></div>
            <div class="token-info">
              <div class="token-name">${e.name}</div>
              <div class="token-usage">${e.usage}</div>
              <div class="token-meta" style="margin-top:4px;"><span class="token-value" style="font-family:var(--font-mono);font-size:11px;">${e.css}</span></div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="page-divider"></div>
      <p style="font-size:11px;color:var(--text-3);">Tokens prefixed with ❌ in Figma are deprecated and being migrated. Do not use them in new components.</p>
    </div>
  `;
}

// ---- Doc page ----
function renderDoc(docId) {
  const doc = DS_DATA.docs[docId];
  const comp = DS_DATA.components.find(c => c.id === docId);
  if (!doc) {
    document.getElementById("page-doc").innerHTML = `<div class="page-wrap"><p style="color:var(--text-3)">Documentation not found for "${docId}".</p></div>`;
    return;
  }

  const sourceLabel = { weave: "Weave 3.0", custom: "Forma Extended", token: "Token" };
  const mapped = state.componentMap[docId] || {};
  const figmaUrl = mapped.figmaUrl || doc.figmaUrl;
  const compScreenshot = mapped.file || null;

  document.getElementById("page-doc").innerHTML = `
    <div class="page-wrap">
      <div class="doc-breadcrumb" onclick="navigate('components')">← All Components</div>

      <div class="page-title">${doc.title}</div>
      <div class="doc-meta-row">
        <span class="chip done">Done</span>
        <span class="chip ${doc.source}">${sourceLabel[doc.source] || doc.source}</span>
        ${figmaUrl ? `<a href="${figmaUrl}" target="_blank" style="font-size:12px">Open in Figma ↗</a>` : ""}
      </div>

      ${compScreenshot ? `
        <div class="comp-screenshot-wrap">
          <img src="${compScreenshot}" alt="${doc.title} component screenshot" loading="lazy" />
        </div>
      ` : `
        <div class="comp-screenshot-placeholder">
          ${figmaUrl
            ? `<a href="${figmaUrl}" target="_blank" class="placeholder-figma-link">View component in Figma ↗</a>`
            : `<span style="color:var(--text-3);font-size:12px">Run <code>node fetch-screenshots.js TOKEN</code> to load component preview</span>`
          }
        </div>
      `}

      <div class="doc-section">
        <div class="doc-p">${doc.overview}</div>
      </div>

      <div class="page-divider"></div>

      <div class="doc-section">
        <div class="doc-h2">Variants</div>
        <table class="doc-table">
          <thead><tr><th>Variant</th><th>Description</th></tr></thead>
          <tbody>
            ${doc.variants.map(v => `<tr><td>${v.name}</td><td>${v.description}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <div class="doc-h2">When to use</div>
        <ul class="doc-bullets">
          ${doc.usage.map(u => `<li>${u}</li>`).join("")}
        </ul>
      </div>

      <div class="doc-section">
        <div class="doc-h2">Do / Don't</div>
        <div class="do-dont-row">
          <div class="do-block">
            <h4>✓ Do</h4>
            <ul>${doc.usage.slice(0, 3).map(u => `<li>${u}</li>`).join("")}</ul>
          </div>
          <div class="dont-block">
            <h4>✕ Don't</h4>
            <ul>${doc.doNot.map(u => `<li>${u}</li>`).join("")}</ul>
          </div>
        </div>
      </div>

      ${doc.weaveComponents && doc.weaveComponents.length ? `
        <div class="doc-section">
          <div class="doc-h2">Weave 3.0 dependencies</div>
          <div>${doc.weaveComponents.map(w => `<span class="dep-chip">${w}</span>`).join("")}</div>
        </div>
      ` : ""}

      ${doc.usageExamples && doc.usageExamples.length ? `
        <div class="doc-section">
          <div class="doc-h2">Used in Forma</div>
          <div class="examples-grid">
            ${doc.usageExamples.map(ex => {
              const imgSrc = `assets/screenshots/${ex.nodeId.replace(":", "-")}.png`;
              const figmaUrl = `https://www.figma.com/design/${DS_DATA.meta.examplesFileKey}/?node-id=${ex.nodeId.replace(":", "-")}`;
              return `
                <div class="example-card">
                  <div class="example-img-wrap">
                    <img
                      src="${imgSrc}"
                      alt="${ex.label}"
                      onerror="this.parentElement.classList.add('img-missing')"
                      loading="lazy"
                    />
                    <div class="img-fallback">
                      <div style="font-size:24px;margin-bottom:6px">🖼</div>
                      <div style="font-size:11px;color:var(--text-3);margin-bottom:8px">Screenshot not downloaded yet</div>
                      <a href="${figmaUrl}" target="_blank" style="font-size:11px">View in Figma ↗</a>
                    </div>
                  </div>
                  <div class="example-label">${ex.label}</div>
                  <div class="example-note">${ex.note}</div>
                </div>
              `;
            }).join("")}
          </div>
          <div class="examples-hint">
            To load screenshots: <code>node fetch-screenshots.js YOUR_TOKEN</code>
            — get a token at <a href="https://www.figma.com/settings" target="_blank">figma.com/settings</a>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", init);

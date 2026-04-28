const DS_DATA = {
  meta: {
    name: "Forma Design System",
    subtitle: "Weave 3.0 Extended",
    figmaUrl: "https://www.figma.com/design/HSbzKTshEump0RAkbDWntE/Forma-Weave-3.0-Extended",
    examplesFileKey: "94M2gPsLpg4LS0xCkJeOu6",
    lastUpdated: "2026-04-28",
  },

  categories: [
    { id: "foundation", label: "Foundation", icon: "◈" },
    { id: "actions", label: "Actions", icon: "⬡" },
    { id: "inputs", label: "Forms & Inputs", icon: "▣" },
    { id: "navigation", label: "Navigation", icon: "⌗" },
    { id: "feedback", label: "Feedback", icon: "◉" },
    { id: "overlay", label: "Overlay", icon: "◫" },
    { id: "data", label: "Data Display", icon: "▦" },
    { id: "extended", label: "Forma Extended", icon: "✦" },
    { id: "patterns", label: "Patterns", icon: "⬟" },
  ],

  // status: done | in-progress | missing | review
  // source: weave | custom | token
  components: [
    // Foundation
    { id: "color-tokens", name: "Color Tokens", category: "foundation", status: "in-progress", source: "weave", figmaNode: null, priority: "high", notes: "Base semantic tokens from Weave 3.0. Dark/light aliases need mapping." },
    { id: "typography", name: "Typography", category: "foundation", status: "in-progress", source: "weave", figmaNode: null, priority: "high", notes: "Scale defined. Responsive behavior needs docs." },
    { id: "spacing", name: "Spacing", category: "foundation", status: "in-progress", source: "weave", figmaNode: null, priority: "high", notes: "4px base grid. Token names need finalization." },
    { id: "icons", name: "Icons", category: "foundation", status: "in-progress", source: "weave", figmaNode: null, priority: "medium", notes: "Using Weave icon set. Custom Forma icons TBD." },
    { id: "elevation", name: "Elevation / Shadows", category: "foundation", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "motion", name: "Motion & Animation", category: "foundation", status: "missing", source: "weave", figmaNode: null, priority: "low", notes: "" },
    { id: "border-radius", name: "Border Radius", category: "foundation", status: "missing", source: "token", figmaNode: null, priority: "medium", notes: "" },

    // Actions
    { id: "button", name: "Button", category: "actions", status: "done", source: "weave", figmaNode: "13:8", priority: "high", notes: "Primary, Secondary, Ghost, Destructive variants from Weave 3.0.", hasDoc: true },
    { id: "icon-button", name: "Icon Button", category: "actions", status: "done", source: "weave", figmaNode: "28:13938", priority: "high", notes: "Used in Color Picker, toolbars.", hasDoc: true },
    { id: "split-button", name: "Split Button", category: "actions", status: "missing", source: "weave", figmaNode: null, priority: "low", notes: "" },
    { id: "menu-button", name: "Menu Button", category: "actions", status: "missing", source: "weave", figmaNode: "28:13281", priority: "low", notes: "Page exists in Figma file." },
    { id: "link", name: "Link", category: "actions", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },

    // Forms & Inputs
    { id: "text-input", name: "Text Input 3.0", category: "inputs", status: "done", source: "weave", figmaNode: "28:13560", priority: "high", notes: "Used in Color Picker (RGB/Hex fields). Sizes: sm/md.", hasDoc: true },
    { id: "dropdown", name: "Dropdown 3.0", category: "inputs", status: "done", source: "weave", figmaNode: "18:7148", priority: "high", notes: "Used in Color Picker (RGB/Hex mode selector).", hasDoc: true },
    { id: "checkbox", name: "Checkbox", category: "inputs", status: "in-progress", source: "weave", figmaNode: "28:10548", priority: "high", notes: "Base done, indeterminate state pending." },
    { id: "radio", name: "Radio Button", category: "inputs", status: "in-progress", source: "weave", figmaNode: "18:7151", priority: "high", notes: "" },
    { id: "toggle", name: "Toggle / Switch", category: "inputs", status: "in-progress", source: "weave", figmaNode: "21:8709", priority: "high", notes: "Page exists in Figma file." },
    { id: "slider", name: "Slider", category: "inputs", status: "in-progress", source: "weave", figmaNode: "18:7152", priority: "medium", notes: "Page exists in Figma file." },
    { id: "color-picker", name: "Color Picker", category: "inputs", status: "done", source: "custom", figmaNode: "16:1089", priority: "high", notes: "Confirmed in Figma. Light & dark, RGB & Hex modes. Façade and Function variants.", hasDoc: true },
    { id: "textarea", name: "Textarea", category: "inputs", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "select", name: "Select", category: "inputs", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "date-picker", name: "Date Picker", category: "inputs", status: "missing", source: "weave", figmaNode: null, priority: "low", notes: "" },
    { id: "file-upload", name: "File Upload", category: "inputs", status: "missing", source: "weave", figmaNode: null, priority: "low", notes: "" },

    // Navigation
    { id: "tabs", name: "Tabs", category: "navigation", status: "in-progress", source: "weave", figmaNode: "21:6971", priority: "high", notes: "Page exists in Figma file." },
    { id: "breadcrumb", name: "Breadcrumb", category: "navigation", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "pagination", name: "Pagination", category: "navigation", status: "missing", source: "weave", figmaNode: null, priority: "low", notes: "" },
    { id: "stepper", name: "Stepper", category: "navigation", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "sidebar-nav", name: "Sidebar Navigation", category: "navigation", status: "in-progress", source: "custom", figmaNode: null, priority: "high", notes: "Forma-specific navigation panel." },

    // Feedback
    { id: "alert", name: "Alert / Banner", category: "feedback", status: "missing", source: "weave", figmaNode: null, priority: "high", notes: "" },
    { id: "badge", name: "Badge", category: "feedback", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "toast", name: "Toast / Notification", category: "feedback", status: "missing", source: "weave", figmaNode: null, priority: "high", notes: "" },
    { id: "progress", name: "Progress Bar", category: "feedback", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "spinner", name: "Spinner / Loading", category: "feedback", status: "in-progress", source: "weave", figmaNode: null, priority: "high", notes: "" },
    { id: "skeleton", name: "Skeleton", category: "feedback", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "empty-state", name: "Empty State", category: "feedback", status: "missing", source: "custom", figmaNode: null, priority: "medium", notes: "" },

    // Overlay
    { id: "modal", name: "Modal / Dialog", category: "overlay", status: "in-progress", source: "weave", figmaNode: "28:13563", priority: "high", notes: "Page exists in Figma file." },
    { id: "drawer", name: "Drawer / Panel", category: "overlay", status: "in-progress", source: "weave", figmaNode: "28:13562", priority: "high", notes: "Right panel pattern used throughout Forma." },
    { id: "tooltip", name: "Tooltip", category: "overlay", status: "in-progress", source: "weave", figmaNode: "28:13564", priority: "high", notes: "Page exists in Figma file." },
    { id: "popover", name: "Popover", category: "overlay", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "context-menu", name: "Context Menu", category: "overlay", status: "missing", source: "custom", figmaNode: null, priority: "high", notes: "Right-click context menu for 3D canvas." },

    // Data Display
    { id: "table", name: "Table", category: "data", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "card", name: "Card", category: "data", status: "in-progress", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "list", name: "List / List Item", category: "data", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },
    { id: "avatar", name: "Avatar", category: "data", status: "missing", source: "weave", figmaNode: null, priority: "low", notes: "" },
    { id: "tag", name: "Tag / Chip", category: "data", status: "in-progress", source: "weave", figmaNode: "21:7249", priority: "medium", notes: "Page exists in Figma file." },
    { id: "divider", name: "Divider", category: "data", status: "done", source: "weave", figmaNode: null, priority: "low", notes: "", hasDoc: true },
    { id: "accordion", name: "Accordion", category: "data", status: "missing", source: "weave", figmaNode: null, priority: "medium", notes: "" },

    // Forma Extended
    { id: "property-panel", name: "Property Panel", category: "extended", status: "missing", source: "custom", figmaNode: null, priority: "high", notes: "Main right-panel for object properties." },
    { id: "toolbar", name: "Toolbar", category: "extended", status: "in-progress", source: "custom", figmaNode: null, priority: "high", notes: "Top/left tool selection bar." },
    { id: "viewport-controls", name: "Viewport Controls", category: "extended", status: "in-progress", source: "custom", figmaNode: null, priority: "high", notes: "3D canvas navigation controls." },
    { id: "layer-panel", name: "Layer Panel", category: "extended", status: "missing", source: "custom", figmaNode: null, priority: "high", notes: "Hierarchy/layer tree." },
    { id: "minimap", name: "Minimap", category: "extended", status: "missing", source: "custom", figmaNode: null, priority: "low", notes: "" },
    { id: "section-header", name: "Section Header", category: "extended", status: "done", source: "custom", figmaNode: null, priority: "medium", notes: "forma-extended-header — used in Color Picker and other panels.", hasDoc: true },

    // Patterns
    { id: "form-layout", name: "Form Layout", category: "patterns", status: "missing", source: "custom", figmaNode: null, priority: "high", notes: "Standard form composition with labels, inputs, validation." },
    { id: "panel-header", name: "Panel Header Pattern", category: "patterns", status: "in-progress", source: "custom", figmaNode: null, priority: "high", notes: "" },
    { id: "dark-light-modes", name: "Dark / Light Mode", category: "patterns", status: "in-progress", source: "custom", figmaNode: null, priority: "high", notes: "Color Picker has both modes documented. Pattern needs generalizing." },
    { id: "responsive-grid", name: "Responsive Grid", category: "patterns", status: "missing", source: "custom", figmaNode: null, priority: "medium", notes: "" },
    { id: "error-handling", name: "Error Handling Pattern", category: "patterns", status: "missing", source: "custom", figmaNode: null, priority: "high", notes: "How to display validation errors, API errors." },
    { id: "keyboard-nav", name: "Keyboard Navigation", category: "patterns", status: "missing", source: "custom", figmaNode: null, priority: "medium", notes: "" },
  ],

  docs: {
    "button": {
      title: "Button",
      source: "weave",
      status: "done",
      figmaUrl: null,
      overview: "The primary way to trigger an action. Comes from Weave 3.0 with four intent variants and two sizes.",
      variants: [
        { name: "Primary", description: "Default. The main action in a view or section." },
        { name: "Secondary", description: "Supporting action shown alongside a Primary." },
        { name: "Ghost", description: "Low-emphasis. Use in toolbars or dense layouts." },
        { name: "Destructive", description: "Irreversible actions such as delete or remove." },
      ],
      usage: [
        "Label with a verb: Save, Export, Delete — not OK or Confirm",
        "Use Primary for the single most important action in a section",
        "Pair Destructive buttons with a confirmation dialog before executing",
        "Prefer Ghost in toolbars where space is limited",
      ],
      doNot: [
        "Don't place more than one Primary button per section",
        "Don't use Button for navigation — use Link instead",
        "Don't truncate button labels — resize the container instead",
      ],
      weaveComponents: [],
      usageExamples: [
        { nodeId: "871:46936", label: "Site limit panel", note: "Front / Back buttons" },
      ],
    },

    "icon-button": {
      title: "Icon Button",
      source: "weave",
      status: "done",
      figmaUrl: null,
      overview: "A square button showing only an icon. Used in toolbars, panels, and anywhere a label would add too much visual noise.",
      variants: [
        { name: "Default", description: "Standard icon button with hover/focus/active states." },
        { name: "Ghost", description: "No background until hovered. For toolbars." },
        { name: "Destructive", description: "Red tint for delete or remove actions." },
      ],
      usage: [
        "Always pair with a Tooltip — the icon alone is not enough for all users",
        "Use Ghost variant in toolbars to keep visual weight low",
        "Match icon size to the button size (16px icon in 24px button, 20px in 32px)",
      ],
      doNot: [
        "Don't use without a tooltip",
        "Don't mix icon button sizes within the same toolbar row",
      ],
      weaveComponents: [],
      usageExamples: [
        { nodeId: "871:45784", label: "Façade panel", note: "Edit and unlink icon buttons" },
        { nodeId: "855:20120", label: "Wall panel", note: "Layout mode icon buttons" },
        { nodeId: "2782:77141", label: "Façade automation", note: "Mode selector icon buttons" },
      ],
    },

    "text-input": {
      title: "Text Input 3.0",
      source: "weave",
      status: "done",
      figmaUrl: null,
      overview: "Standard single-line text field. Supports optional prefix/suffix slots, sizes sm and md, and validation states.",
      variants: [
        { name: "Default", description: "Empty, ready for input." },
        { name: "Filled", description: "Has a value." },
        { name: "Focus", description: "Active, outline shown." },
        { name: "Error", description: "Invalid value — shows red outline and message." },
        { name: "Disabled", description: "Not interactive." },
      ],
      usage: [
        "Always associate a visible label above the input",
        "Use the error state with a short inline message explaining what went wrong",
        "Use size sm (24px) in compact panels like Color Picker; size md (32px) in forms",
        "Prefix slot: short unit labels (R, G, B, #). Suffix slot: clear button or unit",
      ],
      doNot: [
        "Don't use placeholder text as a label substitute",
        "Don't use for multi-line content — use Textarea instead",
      ],
      weaveComponents: [],
      usageExamples: [
        { nodeId: "843:45562", label: "Units panel", note: "Name, Function, Type fields" },
        { nodeId: "834:44429", label: "Building panel", note: "Floors and Floor height (focused state)" },
        { nodeId: "868:32850", label: "Façade automation", note: "Window height, width, gap, sill height" },
      ],
    },

    "dropdown": {
      title: "Dropdown 3.0",
      source: "weave",
      status: "done",
      figmaUrl: null,
      overview: "Select one option from a predefined list. Used in forms and compact panels.",
      variants: [
        { name: "Default", description: "Closed, showing selected value." },
        { name: "Open", description: "List expanded." },
        { name: "Disabled", description: "Not interactive." },
        { name: "Error", description: "Validation failed." },
      ],
      usage: [
        "Use when the list of options is fixed and known at design time",
        "Show the most commonly chosen option as the default",
        "In the Color Picker, the Dropdown selects input mode (RGB / Hex)",
        "Size sm for compact contexts (Color Picker), md for standalone forms",
      ],
      doNot: [
        "Don't use for more than ~12 options — consider a searchable Select instead",
        "Don't use as a navigation element",
      ],
      weaveComponents: [],
      usageExamples: [
        { nodeId: "834:44429", label: "Building panel", note: "Function dropdown — Residential" },
        { nodeId: "843:45562", label: "Units panel", note: "Function and Type dropdowns" },
      ],
    },

    "color-picker": {
      title: "Color Picker",
      source: "custom",
      status: "done",
      figmaUrl: "https://www.figma.com/design/HSbzKTshEump0RAkbDWntE/Forma-Weave-3.0-Extended?node-id=21-39118",
      overview: "Forma Extended component for selecting colors in the 3D workspace — used for façade materials and functional surfaces. Built on Weave 3.0 primitives, supports light and dark mode.",
      variants: [
        { name: "Façade Color — Light", description: "RGB input mode, light panel context." },
        { name: "Function Color — Light", description: "Hex input mode, light panel context." },
        { name: "Façade Color — Dark", description: "RGB input mode, dark canvas context." },
        { name: "Function Color — Dark", description: "Hex input mode, dark canvas context." },
      ],
      usage: [
        "Use the dark variant when the picker floats over the 3D canvas",
        "Show 'Used in this proposal' swatches so users can match existing colors",
        "Default to RGB for users who set colors numerically; Hex for copy-paste workflows",
        "Pipette tool is optional — include when viewport color sampling is supported",
      ],
      doNot: [
        "Don't remove the opacity slider, even if alpha isn't supported — disable it instead",
        "Don't open more than one picker at a time without a clear UX reason",
        "Don't resize the color gradient canvas below 238px wide",
      ],
      weaveComponents: ["TextInput 3.0", "Dropdown 3.0", "IconButton 3.0"],
      usageExamples: [
        { nodeId: "871:46936", label: "Site limit panel", note: "Color swatch + hex value input" },
      ],
    },

    "divider": {
      title: "Divider",
      source: "weave",
      status: "done",
      figmaUrl: null,
      overview: "A visual separator between sections or list items. Can be horizontal or vertical.",
      variants: [
        { name: "Horizontal", description: "Full-width line between vertical sections." },
        { name: "Vertical", description: "Used between inline elements, e.g. toolbar groups." },
      ],
      usage: [
        "Use to separate logically distinct content groups",
        "Prefer spacing alone when sections are already clearly distinct",
      ],
      doNot: [
        "Don't use as a decorative element — only use to imply a content relationship boundary",
        "Don't stack multiple dividers without content between them",
      ],
      weaveComponents: [],
      usageExamples: [
        { nodeId: "843:45562", label: "Units panel", note: "Room / Elements section break" },
        { nodeId: "871:45784", label: "Façade panel", note: "Single modules section header" },
      ],
    },

    "section-header": {
      title: "Section Header",
      source: "custom",
      status: "done",
      figmaUrl: null,
      overview: "Forma Extended panel header (forma-extended-header). Provides a consistent title bar for floating panels and property sections.",
      variants: [
        { name: "Default", description: "Title + optional close button." },
        { name: "With actions", description: "Title + action buttons on the right." },
      ],
      usage: [
        "Always use at the top of floating panels and drawers",
        "Keep the title short — one to three words",
        "Use the close button variant for panels the user explicitly opens",
      ],
      doNot: [
        "Don't skip the Section Header in floating panels — it grounds the panel visually",
        "Don't use for page-level titles — use a standard heading instead",
      ],
      weaveComponents: [],
      usageExamples: [
        { nodeId: "871:45784", label: "Façade panel (light)", note: "Standard panel header with close" },
        { nodeId: "871:46532", label: "Façade panel (dark)", note: "Dark variant — on 3D canvas" },
        { nodeId: "834:44429", label: "Building panel", note: "Header with detail label" },
      ],
    },
  },

  workflow: {
    steps: [
      {
        id: 1,
        title: "Set up your Figma file structure",
        time: "1–2 hours",
        description: "A well-structured Figma file is your single source of truth. Get this right before building components.",
        tips: [
          "Create a dedicated page per component category (e.g. 'Actions', 'Inputs', 'Forma Extended')",
          "Use a cover page with the component status table — keep it updated weekly",
          "Add a '🔧 WIP' prefix to any page under active construction",
          "Use Figma Sections to group related frames on each page",
        ],
        figmaTip: "Use the page list as a navigation menu — keep page names short and consistent.",
      },
      {
        id: 2,
        title: "Pull in Weave 3.0 as a library",
        time: "30 min",
        description: "Before building custom components, ensure the Weave 3.0 library is connected so you can use and extend its primitives.",
        tips: [
          "Go to Assets panel → Team Libraries → Enable Weave 3.0",
          "Document which Weave components you are extending vs using directly",
          "Never detach Weave instances unless you are creating a Forma Extended variant",
          "Use the 🚧 prefix (as seen in the Figma file) to mark components that are in-progress",
        ],
        figmaTip: "Swap instances rather than recreating — preserves connection to the library.",
      },
      {
        id: 3,
        title: "Establish your token system",
        time: "2–4 hours",
        description: "Tokens are the foundation. Build semantic tokens on top of Weave primitives before touching components.",
        tips: [
          "Create a 'Tokens' page with color, typography, spacing, and elevation swatches",
          "Use Figma Variables for color tokens (light/dark mode via variable modes)",
          "Name tokens semantically: surface/default, text/primary — not blue-500",
          "Document the token → Weave primitive mapping",
        ],
        figmaTip: "Figma Variables with modes are the fastest way to handle dark/light theming system-wide.",
      },
      {
        id: 4,
        title: "Build components systematically",
        time: "Ongoing",
        description: "Work through components in priority order. Focus on high-impact, frequently-used components first.",
        tips: [
          "Build in this order: Foundation tokens → Atoms (Button, Input) → Molecules (Form, Card) → Organisms (Panel, Modal)",
          "Each component frame should include: all variants, documentation notes, usage do/don't",
          "Use Auto Layout everywhere — makes spacing/resizing correct by default",
          "Test every component in both light and dark mode before marking as done",
        ],
        figmaTip: "Use Component Properties to expose variants — avoids deeply nested layer structures.",
      },
      {
        id: 5,
        title: "Document as you build",
        time: "Parallel",
        description: "Documentation written at build time is 10x better than documentation written after. Keep a doc frame next to each component.",
        tips: [
          "Use the forma-extended-header pattern for consistent doc frames",
          "Document: What it is, When to use it, Anatomy, States, Do/Don't, Accessibility",
          "Add a 'Used in' row showing which other components reference this one",
          "Screenshot each variant with proper captions",
        ],
        figmaTip: "Create a reusable 'Doc Frame' template component — drop it next to any component to start documenting.",
      },
      {
        id: 6,
        title: "Review, test, publish",
        time: "Weekly",
        description: "Set a weekly ritual to review in-progress items, test in real product contexts, and publish to the team library.",
        tips: [
          "Test components in actual product mocks — not just on white backgrounds",
          "Run a weekly 10-minute component review with the team",
          "Publish library updates with a changelog note",
          "Update this tracker after each publish",
        ],
        figmaTip: "Figma's 'Publish to library' adds a changelog — use it to communicate what changed.",
      },
    ],
    priorities: [
      { week: 1, focus: "Foundations", items: ["Color Tokens", "Typography", "Spacing", "Elevation"] },
      { week: 2, focus: "Core Atoms", items: ["Button", "Text Input", "Checkbox", "Toggle", "Radio"] },
      { week: 3, focus: "Feedback & Overlay", items: ["Toast", "Alert", "Tooltip", "Modal", "Spinner"] },
      { week: 4, focus: "Navigation", items: ["Tabs", "Sidebar Nav", "Breadcrumb"] },
      { week: 5, focus: "Forma Extended", items: ["Property Panel", "Context Menu", "Layer Panel"] },
      { week: 6, focus: "Patterns & Polish", items: ["Form Layout", "Error Handling", "Dark/Light Mode Guide"] },
    ],
  },
};

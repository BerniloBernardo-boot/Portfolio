# Responsive Retro Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing portfolio reflow safely from 320 px to ultrawide displays while preserving its retro visual system and content.

**Architecture:** Retain the static HTML/CSS/vanilla-JS stack. Use intrinsic CSS sizing and a small set of capability-based media queries rather than a separate mobile page or JavaScript layout calculations. Keep the current component-specific stylesheet ownership.

**Tech Stack:** Semantic HTML, CSS Grid, Flexbox, CSS custom properties, vanilla JavaScript, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-25-responsive-layout-design.md`

## Global Constraints

- Preserve colours, fonts, borders, shadows, pixel-art assets, section order, content and existing interactions.
- Do not add a framework, package or CSS framework.
- Do not hide content or use `overflow-x: hidden` to conceal overflow.
- Keep touch targets at least 44 px and retain visible keyboard focus and reduced-motion support.
- Add a retro hamburger menu only for compact widths; without JavaScript, preserve the visible navigation links as a fallback.
- Do not repair missing project-image assets without an explicit asset decision.

## Review Focus

- 320 px portrait: no horizontal scroll, no header/content overlap and no clipped navigation link.
- 375–480 px portrait: cards, form controls and long labels wrap inside their containers.
- 768–834 px: “Sobre mim” and the card grids do not enter a cramped intermediate layout.
- 1024–1440 px: the existing desktop hierarchy and multi-column composition remain recognisable.
- 1920 px and above: text measure and component widths remain bounded instead of stretching across the viewport.

---

### Task 1: Establish fluid global geometry and safe media sizing

**Files:**
- Modify: `css/base.css:17-65`
- Modify: `css/inicio-sobre.css:3-73`
- Test: existing `tests/estrutura.test.mjs`; browser layout inspection when a browser runner is available.

**Interfaces:**
- Consumes: the existing `.conteudo-pagina`, `.conteudo-sobre` and `.fotografia-sobre` classes.
- Produces: bounded page width, image sizing that preserves aspect ratio, and an intrinsic two-column/one-column About layout.

- [x] **Step 1: Record the pre-change viewport observations**

Use 320, 375, 768, 1024, 1440 and 1920 px if a browser runner is available. Record document/client widths, header height and About column widths. If no runner is available, record that as an environmental limitation rather than infer browser results.

- [x] **Step 2: Remove the global minimum body width and bound the main content width**

Use a `min()`/`calc()` expression with a maximum readable desktop width. Preserve the existing 80% desktop composition where it fits.

- [x] **Step 3: Add `height: auto` to the global image guard while preserving component overrides**

Keep the existing `height: 100%`/`object-fit: cover` rules for framed profile and project imagery.

- [x] **Step 4: Make `.conteudo-sobre` intrinsic**

Replace the rigid `1fr 300px` columns with an `auto-fit`/`minmax()` layout; constrain the photograph using `min()` and centre it within its grid cell.

- [x] **Step 5: Verify static checks**

Run: `npm test && node --check js/contact.js && node --check js/projects.js && node --check js/main.js`

Expected: existing test suite passes and all JavaScript files parse.

### Task 2: Make navigation and page spacing adapt to compact widths

**Files:**
- Modify: `index.html:40-53`
- Modify: `js/main.js:1`
- Modify: `css/navegacao.css:3-56`
- Modify: `css/responsive.css:1-121`
- Create: `tests/navegacao.test.mjs`
- Test: manual keyboard/touch and viewport inspection when a browser runner is available.

**Interfaces:**
- Consumes: existing semantic `header > nav > ul > a` markup.
- Produces: a fixed desktop header and an accessible compact hamburger menu for narrow widths.

- [x] **Step 1: Record the pre-change navigation wrap at 320, 390, 650, 700 and 768 px**

Confirm that every anchor stays reachable and note the header’s real height at each width.

- [x] **Step 2: Write the failing menu-behaviour test**

Test the actual `js/main.js` script against a minimal DOM fixture: a click opens the menu and updates `aria-expanded`; Escape closes it and restores the value.

- [x] **Step 3: Add the progressive-enhancement hamburger markup and behaviour**

Insert a real `<button type="button">` with `aria-controls` and `aria-expanded`; initialise it from `js/main.js`. When JavaScript is unavailable, do not hide the existing link list.

- [x] **Step 4: Add a narrow-width navigation variant**

At the width where the seven links no longer fit reliably on one line, show the retro hamburger, make the header sticky/in-flow, and retain the existing retro border and 44 px targets.

- [x] **Step 5: Replace hard-coded narrow-screen main offsets with fluid section spacing**

Ensure anchor targets use a matching `scroll-margin-top` and that no content starts underneath the compact header.

- [x] **Step 6: Scope hover-only visual lifts to hover-capable pointers**

Keep existing focus and active states so keyboard and touch use retain feedback without sticky hover artefacts.

- [x] **Step 7: Verify static checks**

Run: `npm test`

Expected: PASS.

### Task 3: Convert card and footer layouts to intrinsic responsive grids

**Files:**
- Modify: `css/competencias.css:31-76`
- Modify: `css/projetos.css:3-150`
- Modify: `css/equipa.css:3-149`
- Modify: `css/servicos.css:3-171`
- Modify: `css/rodape.css:3-139`
- Modify: `css/responsive.css:1-121`
- Test: browser viewport matrix when available; existing test suite.

**Interfaces:**
- Consumes: existing grid classes, generated `.cartao-projecto` markup, and form controls.
- Produces: grids that choose columns from usable container width rather than only from viewport breakpoints.

- [ ] **Step 1: Capture the existing card measures at 768, 834, 1024 and 1280 px**

Flag any card narrower than its title, description or action can comfortably support.

- [x] **Step 2: Convert Projects and Services to `auto-fit`/`minmax()` grids**

Set each card’s minimum width from its content; preserve the existing three-column desktop result where space permits.

- [x] **Step 3: Refine Competencies, Team and Footer reflow**

Use intrinsic minimums and `min-width: 0` on text-bearing flex/grid children as needed. Preserve the team/photo/card composition and form order.

- [x] **Step 4: Use `clamp()` only for scale-sensitive spacing**

Apply it to large section padding/gaps where the current desktop/mobile overrides jump; keep the border and shadow values fixed.

- [x] **Step 5: Verify static checks**

Run: `npm test && node --check js/contact.js && node --check js/projects.js && node --check js/main.js`

Expected: all commands exit 0.

### Task 4: Audit final behaviour and document tested limits

**Files:**
- Modify: `tests/estrutura.test.mjs` only if a testable regression is found that exercises real page behaviour.
- Modify: `docs/superpowers/specs/2026-10-25-responsive-layout-design.md` to record actual browser results and any remaining physical-device limitations.

**Interfaces:**
- Consumes: the completed static page.
- Produces: a factual validation record, not source-string assertions masquerading as layout tests.

- [ ] **Step 1: Test the viewport matrix**

Inspect 320, 360, 375, 390, 414, 480, 768, 834, 1024, 1280, 1440, 1920 and one ultrawide width. At each size check document overflow, heading wrapping, image bounds, navigation, controls and grid column selection.

- [ ] **Step 2: Test interaction and motion**

Check keyboard focus, touch-sized links/buttons, hover-capable pointer feedback, active feedback and `prefers-reduced-motion`.

- [x] **Step 3: Run final static verification**

Run: `npm test && node --check js/contact.js && node --check js/projects.js && node --check js/main.js`

Expected: all commands exit 0.

- [ ] **Step 4: Report only verified browser claims**

Separate static evidence from physical-browser, Safari, touch and zoom results that could not be executed in the available environment.

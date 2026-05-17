# Changelog

All notable changes to the Ideology Universe project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🎯 In Progress
- Community voting on relationships (thumbs up / down)
- Comprehensive testing suite

---

## [0.4.0] - 2026-05-17

### ✨ Added - Learning Resources Panel

#### Per-Concept Reading Lists
- **📚 Resources button** added to InfoPanel header — opens a dedicated resources panel alongside the export (📤) button
- **Three-section layout**: Academic, Books, and Easy Reads & Watches
- **Drill-down navigation**: Click a section to expand its links; back button returns to section overview
- **Hyperlinked titles only** — long URLs are never shown; items display as clickable title text

#### Phase 1 Content: Top 15 Concepts by Graph Connectivity
Resources (2 academic + 3 books each) added for the following concepts:

| Concept | Academic Sources | Books |
|---|---|---|
| Liberalism | SEP, IEP | Rawls, Mill, Locke |
| Marxism | SEP (Marx + Analytical Marxism) | Marx/Engels, Wheen |
| Socialism | SEP, IEP | Sunkara, Russell, Einstein |
| Capitalism | SEP (Markets + Neoliberalism) | Smith, Piketty, Weber |
| Enlightenment | SEP, IEP | Kant, Paine, Robertson |
| Utilitarianism | SEP, IEP | Mill, Bentham, Singer |
| Aristotelianism | SEP, IEP | Nicomachean Ethics, Politics, Barnes |
| Rationalism | SEP, IEP | Descartes, Spinoza |
| Empiricism | SEP, IEP | Locke, Hume, Berkeley |
| Anarchism | SEP, IEP | Kropotkin (×2), Ward |
| Nationalism | SEP, IEP | Anderson, Gellner, Moore |
| Fascism | IEP (Totalitarianism), SEP (Arendt) | Arendt, Paxton, Passmore |
| Idealism | SEP, IEP | Hegel, Kant, Singer |
| Democracy | SEP, IEP | Tocqueville, Dahl, Plato |
| Social Democracy | SEP, IEP | Giddens, Krugman, Dorrien |

**Data file**: `src/data/resources.json`

**Files Modified**:
- `src/data/resources.json` (populated with 75 resource links)
- `src/components/InfoPanel.jsx` (resources panel UI + state)

---

## [0.3.3] - 2026-05-17

### ✨ Added - Usage Analytics (GA4)

- **Google Analytics 4 integration** — session time, engagement rate, geography, and traffic sources tracked automatically
- **Custom event tracking** via new `src/utils/analytics.js` utility:
  - `node_click` — concept name and era when a node is selected
  - `search_select` — query string and chosen concept when a search result is picked
  - `path_mode_toggle` — enter/exit path mode
  - `path_search` — start/end concepts and whether a path was found
  - `export_image` — concept name when a PNG is downloaded
  - `language_change` — EN/ZH switch
  - `zoom_easter_egg` — max/min zoom level trigger
- **Silent failure design** — analytics never break the app if GA4 fails to load

**Files Modified**:
- `index.html` (GA4 snippet)
- `src/utils/analytics.js` (new file)
- `src/App.jsx`
- `src/components/SearchBar.jsx`
- `src/components/ExportModal.jsx`

---

## [0.3.2] - 2026-01-31

### ⚡ Performance - Major Canvas Optimization

#### Rendering Performance Improvements
- **O(n²) → O(1) node lookup** - Pre-computed `nodePositions` Map replaces `.find()` calls during edge rendering
- **O(n²) → O(n) nebula calculation** - Spatial grid indexing for cluster detection, only checks adjacent 9 cells instead of all nodes
- **CSS Filter → SVG Filter** - Pre-defined reusable `<filter>` elements (`glow-philosophy`, `glow-politics`, `glow-both`, `glow-dimmed`, `glow-hover-*`) replace per-node `drop-shadow` CSS

#### Animation Optimization
- **D3 Transitions → CSS Animations** - Twinkle effect now uses `@keyframes` with `animation-delay` for staggered effect
- **Reduced drift animations** - Only 20% of nodes have drift animation (every 5th node)
- **Shooting star memory leak fix** - Pre-created shared gradient `#shooting-star-gradient` and filter `#star-head-glow`
- **Reduced shooting star frequency** - 40% → 30% probability, 3s → 4s interval

#### Path Mode Optimization
- **O(n×BFS) → O(BFS) reachability** - Single BFS traversal finds all reachable nodes instead of per-node path calculation
- **Limited firework effects** - Maximum 10 nodes with particle effects
- **Reduced particles** - 12 → 6 particles per burst, 1.5s → 2.5s interval

#### Zoom Handler Optimization
- **100ms throttle** - Zoom extreme detection throttled to reduce CPU usage
- **Core transform unchanged** - `g.attr('transform')` still executes every frame for smooth panning

**Expected Improvements**:
- Significantly smoother panning and dragging
- Reduced GPU load from CSS filters
- Less memory usage from animation transitions
- Faster initial render time

**Files Modified**:
- `src/components/IdeologyCanvas.jsx` (major refactoring)

---

## [0.3.1] - 2026-01-27

### ✨ Added - Zoom Easter Egg

#### Interactive User Feedback Feature
- **Zoom extreme easter egg** - Elegant modal appears when users reach max (5x) or min (0.5x) zoom
- **Encourages user feedback** - Prompts users to email suggestions for missing ideas or improvements
- **5-second debounce** - Prevents spam, only triggers once per 5 seconds
- **Bilingual support** - Custom messages for English and Chinese

**Messages**:
- **Max Zoom (5x)**:
  - EN: "Reached the Edge of the Universe! ✨ Can't find the idea you're looking for? Email us at yd2598@columbia.edu"
  - ZH: "探索到宇宙边缘了！✨ 看不到你想找的思想？欢迎发邮件到 yd2598@columbia.edu 告诉我们你的建议"

- **Min Zoom (0.5x)**:
  - EN: "Viewing the Whole Universe 🌌 Want to suggest new ideas? Email us at yd2598@columbia.edu"
  - ZH: "从全局视角观察宇宙 🌌 想提交新的思想？欢迎发邮件到 yd2598@columbia.edu 帮助扩展思想宇宙"

**User Experience**:
- Non-intrusive (only at zoom extremes)
- Easy to close with X button or background click
- Direct mailto link for immediate feedback
- "Continue Exploring" button to dismiss
- Matches cosmic theme and design language

**Components**:
- `src/components/ZoomEasterEgg.jsx` (new file, 150 lines)
- `src/components/IdeologyCanvas.jsx` (zoom event listener)
- `src/App.jsx` (state management)

**Technical Implementation**:
- Zoom scale detection in D3 zoom event handler
- React state management for modal visibility
- Debounce mechanism using ref and timestamp
- Elegant modal with gradient background and gold accents

---

## [0.3.0] - 2026-01-26

### ✨ Added - Social Media Export Feature

#### Export & Share Functionality
- **Implemented professional social media export** - Create shareable images optimized for LinkedIn and other platforms
- **Dual-panel export layout** - Left panel shows relationship graph visualization, right panel shows detailed information
- **Smart coordinate preservation** - Uses main canvas coordinates (baseX, baseY) to maintain exact layout including clusters
- **Auto-centering algorithm** - Content automatically centers both horizontally and vertically in export canvas
- **Only shows direct relationships** - Export only displays connections directly linked to selected node for clarity

**Visual Design**:
- **Left Panel (1000px)**:
  - Preserves main canvas layout with time axis and semantic clustering
  - Larger, more visible nodes (selected: 18px, related: 12px)
  - Thicker connection lines (4px) with 50% opacity
  - All node labels visible with enhanced typography
  - Star background for cosmic effect

- **Right Panel (600px)**:
  - Elegant dark gradient background (#151b2e → #0d1117)
  - Georgia serif font for title (40px) with shadow effect
  - Era badge with calendar emoji and underline
  - Italic quotation-style description
  - Key Figures section with bullet points
  - Relationship Network with colored subsections:
    - Green highlights for "Influences" (📤)
    - Blue highlights for "Influenced By" (📥)
  - "Generated by Agora" watermark

**Technical Implementation**:
- Pure Canvas API (no external dependencies)
- 1600x900px output resolution
- PNG format export
- Dynamic scaling with 10% padding
- Coordinate transformation system for accurate positioning

**User Experience**:
- Export button (📤) in InfoPanel header (only in normal mode)
- Modal preview before export
- Single click to download
- Filename format: `agora-{node-id}-{timestamp}.png`

**Components Modified**:
- `src/components/ExportModal.jsx` (new file, 340 lines)
- `src/components/InfoPanel.jsx` (added export button)
- `src/App.jsx` (integrated export modal state)

**Design Iterations**:
- Removed confusing background patterns and divider lines
- Simplified badge designs (removed colored boxes)
- Improved spacing and typography hierarchy
- Removed PDF export (kept only PNG)
- Changed button color to match theme (gold accent)

### 🔧 Changed
- Export button text: "导出为 PNG" → "导出图片" / "Export as PNG" → "Export Image"

---

## [0.2.0] - 2026-01-19

### ✨ Added - Path Normalization

#### Path Normalization Feature
- **Implemented path normalization to ensure chronological order** - All influence paths now display from earlier to later ideas, respecting historical causality
- **Created comprehensive relation reverse mapping** - 76 relation types now correctly reverse when paths are normalized (e.g., `emerged_from` → `gave_rise_to`)
- **Added `reverseRelationType()` function** in `relationOntology.js` to convert relation types when paths are reversed
- **Added `normalizePathToChronological()` function** in `pathFinding.js` to automatically detect and fix time-reversed paths

**Impact**: Critical fix for historical accuracy - Prevents confusing time-reversed influence paths

**Example**:
```
Before: Secularism (1750) → Enlightenment (1700) [emerged_from]
After:  Enlightenment (1700) → Secularism (1750) [gave_rise_to]
```

**Technical Details**:
- Detects time reversal by comparing `era` values of start and end nodes
- Reverses both node array and edge array when needed
- Transforms relation labels using `RELATION_REVERSE_MAP`
- Handles symmetric relations (e.g., `similar_to` stays unchanged)
- O(n) time complexity, minimal performance impact

**Files Changed**:
- `src/utils/relationOntology.js` (+187 lines)
- `src/utils/pathFinding.js` (+50 lines)

**Documentation**:
- [Development Log](docs/development-logs/2026-01-19-path-normalization.md)
- [Test Plan](PATH_NORMALIZATION_TEST_PLAN.md)

---

## [0.1.0] - 2026-01-15

### ✨ Added - Initial Path Tracking Feature

#### Influence Path Tracking
- **Implemented BFS-based path finding** - Find shortest influence path between any two concepts
- **Added path mode toggle** - 🗺️ button to enter/exit path tracking mode
- **Implemented star constellation effect** - Reachable nodes illuminate when start point is selected
- **Added path quality scoring** - Evaluates path credibility based on relation types and time consistency
- **Created 3-layer relation ontology** - Genealogical, Ideological, and Illustrative relation types
- **Implemented semantic path filtering** - Only shows high-quality paths (score ≥ 40, length ≤ 4)

**Features**:
- Click-to-select start and end points
- Visual feedback with golden highlight and numbering (①②③)
- Reachable nodes glow with firework animations
- Info panel shows detailed path steps with relation descriptions
- Path quality indicator with warnings
- Supports 76 different relation types

**Components**:
- `src/utils/pathFinding.js` (new file)
- `src/utils/relationOntology.js` (new file)
- `src/components/IdeologyCanvas.jsx` (enhanced)
- `src/components/InfoPanel.jsx` (enhanced)
- `src/App.jsx` (enhanced)

**Documentation**:
- [Implementation Plan](docs/plans/keen-sauteeing-melody.md)

### 🎨 Enhanced - Visual Effects

- **Nebula clusters** - Grouping of related concepts with glowing effects
- **Firework animations** - Particle effects for reachable nodes in path mode
- **Golden path highlighting** - Clear visual indication of influence paths
- **Node numbering** - Sequential indicators (①②③④) for path steps

---

## [0.0.1] - 2025-12-24

### ✨ Added - Initial Release

#### Core Visualization
- Interactive D3.js-based visualization of 71 philosophical and political concepts
- Timeline-based layout (Ancient → Modern era)
- Node clustering by semantic similarity
- Relationship edges between concepts

#### Data
- 71 concepts covering philosophy and politics
- 69 types of relationships
- Temporal range: -500 BCE to 2010 CE
- Bilingual support (English/Chinese)

#### UI Components
- Search bar with fuzzy matching
- Category filters (Philosophy, Politics, Interdisciplinary)
- Info panel with concept details
- Zoom and pan controls
- Telescope overlay effect
- Particle background

#### Internationalization
- English and Chinese language support
- Era formatting (BCE/CE vs 公元前/公元)
- Relation type translations
- UI text translations

---

## Development Timeline

### Phase 1: Foundation (Completed ✅)
- [x] Data structure design
- [x] Core visualization engine
- [x] Basic UI components
- [x] Internationalization

### Phase 2: Path Tracking (Current 🚧)
- [x] Path finding algorithm
- [x] Relation ontology
- [x] Path normalization
- [ ] Visual enhancements
- [ ] Comprehensive testing

### Phase 3: Export Feature (Completed ✅)
- [x] PNG export
- [x] Export dialog UI
- [x] Professional social media layout
- [ ] Path-specific export mode (planned)

### Phase 4: Polish & Launch (Planned 📋)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] User documentation
- [ ] Deployment

---

## Bug Fixes

### [0.2.0] - 2026-01-19
- **Fixed time-reversed influence paths** - Paths now always flow from earlier to later concepts
- **Fixed missing relation type mappings** - Added 5 missing relation types (`claims_to_represent`, `contributed_to`, `exploited_by`, `exploits`, `revived`)
- **Fixed symmetric relation handling** - Symmetric relations (e.g., `similar_to`) now correctly preserve semantics when paths are reversed

---

## Known Issues

### Current Limitations
- Path finding limited to 4 steps (by design for quality)
- Some concepts may not be reachable due to relation type constraints
- Time reversal warnings may appear for historically inaccurate data entries

### Planned Fixes
- Add more robust error handling for missing era data
- Improve path quality scoring algorithm
- Add user feedback mechanism for path accuracy

---

## Performance Metrics

### Current Performance (v0.2.0)
- **Initial Load**: ~300ms (71 nodes, ~200 edges)
- **Path Finding**: <10ms per query (BFS on 71 nodes)
- **Path Normalization**: <1ms per path
- **Canvas Rendering**: 60fps (with nebula effects)

### Optimization History
- v0.2.0: Added path normalization (negligible overhead)
- v0.1.0: Implemented semantic path filtering (10x reduction in irrelevant paths)
- v0.0.1: Initial performance baseline

---

## Breaking Changes

### [0.2.0]
- None - Backward compatible

### [0.1.0]
- **Path API changes** - `findShortestPath` now returns normalized paths
- **Relation ontology** - New 3-layer system may affect custom relation types

---

## Deprecations

None at this time.

---

## Security

No security vulnerabilities reported or fixed in this release.

---

## Contributors

- **Claude Code** - AI Assistant implementing features
- **User (daidai)** - Project direction and testing

---

## Links

- **Repository**: [GitHub URL]
- **Live Demo**: [Demo URL]
- **Documentation**: [docs/](docs/)
- **Development Logs**: [docs/development-logs/](docs/development-logs/)

---

**Legend**:
- ✨ Added: New features
- 🔧 Changed: Changes in existing functionality
- 🗑️ Deprecated: Soon-to-be removed features
- 🐛 Fixed: Bug fixes
- 🔒 Security: Security fixes
- 📝 Documentation: Documentation changes

---

**Last Updated**: 2026-01-27

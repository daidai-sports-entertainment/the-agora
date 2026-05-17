# Ideology Universe - Interactive Visualization of Philosophical and Political Thought

**🌐 Languages**: English | **[中文](./README.zh.md)**

Explore 2,500 years of intellectual evolution: an interactive visualization spanning from Ancient Greek philosophy to contemporary political theory.

![Ideology Universe](../comprehensive_visualization.png)

---

## ✨ Features

### 🎯 Path Tracking (v0.2 - Latest)

**NEW**: Trace the historical evolution of ideas through influence chains!

- **Influence Path Finding** - Discover how ideas connect across centuries
- **Historical Causality** - Paths always flow from earlier to later concepts (chronologically accurate)
- **Path Quality Scoring** - Get confidence ratings based on relation types and time consistency
- **Interactive Selection** - Click start and end points to find the shortest path
- **Constellation Response** - Reachable concepts illuminate when you select a starting point
- **3-Layer Relation Ontology** - Genealogical, Ideological, and Illustrative relation types

### 📊 Core Visualization (v0.1)

1. **2D Time-Semantic Space**
   - X-axis = Historical timeline (500 BCE - 2010 CE)
   - Y-axis = Semantic similarity (neural embeddings via UMAP)
   - 71 concepts spanning ancient to contemporary thought

2. **Intelligent Color Coding**
   - 🔵 Blue = Pure philosophy
   - 🔴 Red = Pure politics
   - 🟢 Cyan-Green = Philosophy + Politics intersection

3. **Core Interaction: Relationship Highlighting**
   - **Click any node** → Auto-highlight all connected nodes and edges
   - Other nodes fade to semi-transparency
   - Instantly visualize intellectual connections

4. **Detailed Information Panel**
   - Concept descriptions
   - Key figures
   - Domains
   - All relationships (with types and descriptions)

5. **Zoom & Pan**
   - Mouse wheel to zoom
   - Drag to pan the canvas
   - Click empty space to deselect

6. **Timeline Annotations**
   - Historical period markers on X-axis
   - Ancient, Medieval, Enlightenment, Modern, Contemporary

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to project directory
cd ideology-universe

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` (or the port shown in terminal)

---

## 📁 Project Structure

```
ideology-universe/
├── src/
│   ├── components/
│   │   ├── IdeologyCanvas.jsx      # Main visualization canvas (D3.js)
│   │   ├── InfoPanel.jsx           # Information panel
│   │   ├── SearchBar.jsx           # Search with autocomplete
│   │   └── LoadingAnimation.jsx    # Loading screen
│   ├── hooks/
│   │   └── useGraphData.js         # Data loading hook
│   ├── utils/
│   │   ├── colorScheme.js          # Color coding logic
│   │   ├── pathFinding.js          # BFS path search algorithm
│   │   ├── relationOntology.js     # 76 relation type definitions
│   │   └── i18n.js                 # Internationalization (EN/ZH)
│   ├── data/
│   │   ├── concept_positions_final.json          # Position data
│   │   └── ideology_dataset_comprehensive.json   # Full concept data
│   ├── App.jsx                     # Main application
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── docs/
│   └── development-logs/           # Development history
├── package.json
├── vite.config.js
└── index.html
```

---

## 🎨 Design Highlights

### Color System

We use color to distinguish the nature of concepts:

- **Philosophy** (e.g., Platonism, Stoicism) → Blue
- **Politics** (e.g., Liberalism, Fascism) → Red
- **Interdisciplinary** (e.g., Marxism, Confucianism) → Cyan-Green

This highlights a key insight: **many ideas span both philosophy and politics**, which is the charm of intellectual history.

### Relationship Types

The visualization supports **76 different relationship types**, organized into 3 layers:

**Genealogical Layer** (Direct Influence):
- `influenced_by` / `influenced` - Direct influence
- `evolved_from` / `evolved_into` - Evolution
- `emerged_from` / `gave_rise_to` - Emergence
- `founded_on` / `foundation_for` - Foundation
- `built_on` / `provided_foundation_for` - Building upon
- And 40+ more...

**Ideological Layer** (Opposition/Critique):
- `opposes` / `opposed_by` - Opposition (red dashed lines)
- `critiques` / `critiqued_by` - Critique
- `challenges` / `challenged_by` - Challenge
- `reacts_against` - Reaction
- And 20+ more...

**Illustrative Layer** (Association):
- `similar_to` - Similarity
- `related_to` - Relation
- `synthesized_with` - Synthesis
- `exemplifies` - Exemplification
- And 15+ more...

---

## 🧠 Tech Stack

- **React 18** - UI framework
- **D3.js v7** - Data visualization
- **Vite** - Build tool
- **sentence-transformers** - Semantic embeddings (Python backend)

---

## 📊 Data Explanation

### Data Sources

- `concept_positions_final.json` - Contains X/Y coordinates for each concept
  - X coordinate = Historical era
  - Y coordinate = Semantic similarity (UMAP reduced from 768-dim embeddings)

- `ideology_dataset_comprehensive.json` - Complete data
  - 71 concepts (includes Medieval, Enlightenment, and modern key ideas)
  - Each concept includes: description, key_figures, domains, relationships

### Embedding Generation

Used `all-mpnet-base-v2` model to generate 768-dimensional semantic embeddings, then reduced to 2D using UMAP.

See `../generate_embeddings.py` for details.

---

## 🎯 Usage Examples

### Example 1: Trace the Evolution of Marxism

1. Click the **🗺️ Path Mode** button (top-right controls)
2. Click **Marxism** (purple, 1850) as start point → Glows blue
3. Watch the constellation response: reachable concepts light up in yellow
4. Click **Kant** (blue, 1780) as end point → Glows green
5. See the influence path automatically calculated:
   ```
   ① Kant (1780)
     ↓ influenced
   ② Hegelianism (1830)
     ↓ influenced
   ③ Marxism (1850)
   ```
6. Info panel shows detailed path with relation descriptions
7. Click **✕** or **🗺️** again to exit path mode

### Example 2: Explore Marxism's Intellectual Network (Regular Mode)

1. Click **Marxism** node (purple, 1850)
2. Observe highlighted relationships:
   - ← Influenced by **Hegelianism** (blue)
   - → Gave rise to **Socialism** (red)
   - ⚔️ Opposes **Capitalism** (red dashed line)
3. Right panel shows full description and key figures (Karl Marx)
4. Click empty space to deselect and continue exploring

### Example 3: Compare Eastern and Western Ancient Philosophy

1. Zoom to ancient region (X-axis around -500)
2. Observe:
   - **Confucianism** (cyan-green) - Eastern, emphasizes political ethics
   - **Platonism** (blue) - Western, pure philosophy
3. Click both to compare differences and similarities

---

## 📝 Changelog

### v0.2.0 - 2026-01-19

**Major Feature: Path Normalization**
- ✨ Implemented path normalization to ensure chronological order
- ✨ All influence paths now flow from earlier to later ideas
- ✨ Created comprehensive relation reverse mapping (76 relation types)
- 🐛 Fixed 3 asymmetric relation mappings (`derived_from`, `led_to`, `opposes`)
- 🐛 Fixed array mutation bug in path normalization
- 📚 Established development log system with bilingual documentation

**Impact**: Critical fix for historical accuracy - prevents confusing time-reversed paths

**Documentation**:
- [Development Log](docs/development-logs/2026-01-19-path-normalization.md)
- [Bug Fixes](docs/development-logs/2026-01-19-bugfixes.md)
- [Test Plan](PATH_NORMALIZATION_TEST_PLAN.md)

### v0.1.0 - 2026-01-15

**Path Tracking Feature**
- ✨ Implemented BFS-based path finding
- ✨ Added path mode toggle (🗺️ button)
- ✨ Star constellation effect for reachable nodes
- ✨ Path quality scoring system
- ✨ 3-layer relation ontology (Genealogical, Ideological, Illustrative)
- ✨ Semantic path filtering (score ≥ 40, length ≤ 4)

### v0.0.1 - 2025-01-05

**Initial Release**
- ✨ English/Chinese language toggle (right panel switch)
- ✨ Visual style upgrade: elegant cosmic theme, Lora font
- ✨ Interaction enhancements: telescope focus, zoom/reset controls
- ✨ Legend supports multi-select filtering (Philosophy / Politics / Both)
- ✨ Nodes slowly blink and float, enhancing the starry feel
- ✨ Semantic prompt text on main canvas (italic overlay)
- ✨ Cross-concept color adjusted to Cyan-Green for better distinction

---

## 🔮 Roadmap

### ✅ Completed
- PNG export with social media layout and preview
- Search bar with fuzzy autocomplete
- Performance optimization (O(n²) → O(1) node lookup, CSS → SVG filters)
- Zoom easter egg with user feedback prompts
- Usage analytics (GA4) — session time, node clicks, path searches, exports

### 🚧 Up Next

**Community & Interaction**
- [ ] Thumbs up / down voting on relationships
- [ ] Comparison mode (select multiple concepts simultaneously)
- [ ] URL sharing (encode current view state)
- [ ] Preset views ("Ancient Greek Philosophy", "Enlightenment Era", etc.)

**Polish**
- [ ] Responsive design (mobile)
- [ ] Light/dark mode toggle
- [ ] Path-specific export mode

**V1.0 - Complete Version**
- [ ] Recommendation system ("You might be interested in...")
- [ ] Timeline animation (playback historical evolution)
- [ ] User notes (local storage)

---

## 🤝 Contributing

This is an open-source project - contributions are welcome!

Ways to help:
- Add more concepts (currently 71)
- Improve relationship descriptions
- Translations (English/Chinese)
- UI/UX improvements
- Performance optimizations

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- **Data Source**: Hand-curated + AI-assisted
- **Embedding Model**: sentence-transformers (all-mpnet-base-v2)
- **Visualization Inspiration**: D3.js Gallery, Observable
- **Design Philosophy**: Making intellectual history accessible and beautiful

---

## 📞 Contact

Questions or suggestions? Feel free to open an issue!

**Email**: yd2598@columbia.edu
**Project**: [GitHub Repository](#)

---

## 📚 Documentation

- [Development Logs](docs/development-logs/) - Complete development history
- [Test Plan](PATH_NORMALIZATION_TEST_PLAN.md) - Testing guidelines
- [Bilingual Docs Guide](docs/development-logs/BILINGUAL_DOCS_GUIDE.md) - Documentation standards

---

**Enjoy exploring the universe of ideas! 🌌**

---

<p align="center">
  Made with ❤️ by researchers who believe ideas matter
</p>

# Agora Analytics Reference

**Property**: Ideology Universe (G-PXC7EH625W)
**Last updated**: 2026-05-17

---

## Where to find things in GA4

| What you want to see | Where to go |
|---|---|
| Sessions, users, engagement time | Reports → Engagement → Overview |
| Where users come from | Reports → Acquisition → Traffic acquisition |
| Which countries | Reports → User → Demographics |
| New vs. returning users | Reports → Retention |
| Your custom events (node clicks, etc.) | Reports → Engagement → Events |
| Live activity right now | Reports → Realtime |

> **Note**: Most reports have a 24–48 hour processing delay. Use Realtime to verify tracking immediately after changes.

---

## What's being tracked

### Auto-tracked by GA4 (no code required)

These fire automatically because Enhanced Measurement is turned on.

| Event | What it means | Key question it answers |
|---|---|---|
| `page_view` | Someone loaded the site | How many total visits? |
| `session_start` | A new session began (30min inactivity = new session) | How many sessions per day/week? |
| `first_visit` | A brand new user arrived | How many new users are we getting? |
| `user_engagement` | Tab was active for 1+ second | Feeds the "average engagement time" metric |
| `scroll` | User scrolled 90% of the page | Are people reading the whole UI? |
| `click` | User clicked an outbound link | e.g. the mailto: link in the zoom easter egg |

**Key derived metrics GA4 calculates from these:**
- **Average engagement time per session** — how long the tab is actively in focus (not just open). More meaningful than old "session duration."
- **Engagement rate** — % of sessions with 10+ seconds of engagement, 2+ page views, or a conversion. Replaces bounce rate.
- **DAU / WAU / MAU** — daily, weekly, monthly active users over time.

---

### Custom events (added in v0.3.3)

These tell you how people actually use the app, not just that they visited.

#### `node_click`
**Parameters**: `concept_name`, `concept_era`

**What it tells you**: Which concepts are being explored most. This is your most important engagement signal.

**Key questions it answers**:
- What are the top 10 most-clicked concepts?
- Are users gravitating toward modern ideas (high era) or ancient ones?
- Is there a concept that nobody clicks — maybe it needs a better name or more prominent placement?

**Where to see it**: Events → node_click → click to see parameter breakdown by concept_name

---

#### `search_select`
**Parameters**: `search_query`, `concept_name`

**What it tells you**: What users are actively looking for.

**Key questions it answers**:
- What are users searching for that exists in the dataset?
- Are there recurring searches that return *no* results? (You'd need to add a `search_no_results` event to catch this — worth adding later.)
- Is there a gap between what people search and what concepts exist?

---

#### `path_mode_toggle`
**Parameters**: `action` (`enter` or `exit`)

**What it tells you**: How many users discover and use the path feature.

**Key questions it answers**:
- What % of sessions include path mode usage? (path_mode_toggle count ÷ session_start count)
- Do users enter and immediately exit (confused) or stay in path mode?

---

#### `path_search`
**Parameters**: `start_concept`, `end_concept`, `path_found` (true/false)

**What it tells you**: Which concept pairs people are trying to connect, and whether the graph is dense enough to satisfy them.

**Key questions it answers**:
- What are the most common start/end concept pairs?
- What % of path searches return no result? High failure rate = missing relationships in the data.
- Which concepts are used as starting points most often?

---

#### `export_image`
**Parameters**: `concept_name`

**What it tells you**: Which concepts are compelling enough to share.

**Key questions it answers**:
- Which concepts do users want to share on social media?
- Export is a strong signal of high engagement — track this closely.

---

#### `language_change`
**Parameters**: `language` (`en` or `zh`)

**What it tells you**: How significant is the Chinese-speaking audience?

**Key questions it answers**:
- What % of users switch to Chinese?
- Combined with the country report (China, Taiwan, etc.), confirms whether Chinese localization is worth investing in further.

---

#### `zoom_easter_egg`
**Parameters**: `zoom_level` (`max` or `min`)

**What it tells you**: Users who zoom to extremes are deeply engaged — these are your power users.

**Key questions it answers**:
- How many sessions include extreme zoom behavior?
- Do max-zoom users (looking for a specific concept) differ from min-zoom users (getting the big picture)?

---

## Metrics to watch as you grow

Once you have a few weeks of data, these are the numbers worth checking regularly:

| Metric | Why it matters | Where |
|---|---|---|
| Avg. engagement time | Is the app actually holding attention? Target: 2+ minutes | Engagement → Overview |
| node_click count per session | Are users exploring or bouncing after one click? | Events → node_click |
| path_found rate | Data quality signal — high failure = missing edges | Events → path_search |
| % sessions with path_mode_toggle | Feature discovery rate for your best feature | Events |
| New user % | Are you growing or just retaining? | Retention |
| Top countries | Where to focus if you add more languages | User → Demographics |

---

## What's NOT tracked yet (worth adding later)

- **Search with no results** — you'd learn what concepts are missing from the dataset
- **Time spent on a node** — currently you know what's clicked but not what's read closely
- **Community votes** — once you build the thumbs up/down feature, each vote should fire an event with concept and vote direction


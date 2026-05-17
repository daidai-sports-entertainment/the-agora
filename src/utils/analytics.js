/**
 * Analytics utility — thin wrapper around GA4's gtag()
 * All custom events flow through here so event names stay consistent.
 */

const track = (eventName, params = {}) => {
  try {
    window.gtag?.('event', eventName, params);
  } catch {
    // Silently fail — never break the app over analytics
  }
};

// User clicks a concept node on the canvas
export const trackNodeClick = (node) => {
  track('node_click', {
    concept_name: node.id,
    concept_era: node.era,
  });
};

// User selects a result from the search bar
export const trackSearchSelect = (query, node) => {
  track('search_select', {
    search_query: query,
    concept_name: node.id,
  });
};

// Path mode is toggled on or off
export const trackPathModeToggle = (entering) => {
  track('path_mode_toggle', {
    action: entering ? 'enter' : 'exit',
  });
};

// Path search completes (whether or not a path was found)
export const trackPathSearch = (startNode, endNode, found) => {
  track('path_search', {
    start_concept: startNode?.id,
    end_concept: endNode?.id,
    path_found: found,
  });
};

// User downloads an export PNG
export const trackExportImage = (node) => {
  track('export_image', {
    concept_name: node?.id,
  });
};

// Language is switched
export const trackLanguageChange = (language) => {
  track('language_change', { language });
};

// Zoom easter egg is triggered
export const trackZoomEasterEgg = (level) => {
  track('zoom_easter_egg', { zoom_level: level });
};

import { getNodeColor } from '../utils/colorScheme';

/**
 * Right side information panel - displays selected concept details
 */
export function InfoPanel({ selectedNode }) {
  if (!selectedNode) {
    return (
      <div style={styles.panel}>
        <div style={styles.welcome}>
          <h2 style={styles.title}>The Agora</h2>
          <p style={styles.subtitle}>A Visual Atlas of Ideology</p>

          <div style={styles.legend}>
            <h3 style={styles.sectionTitle}>Legend</h3>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: '#3498db'}} />
              <span>Philosophy</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: '#e74c3c'}} />
              <span>Politics</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: '#9b59b6'}} />
              <span>Philosophy + Politics</span>
            </div>
          </div>

          <div style={styles.instructions}>
            <h3 style={styles.sectionTitle}>How to Use</h3>
            <ul style={styles.list}>
              <li>Click nodes to view details</li>
              <li>Scroll to zoom</li>
              <li>Drag to pan view</li>
              <li>Click background to deselect</li>
            </ul>
          </div>

          <div style={styles.stats}>
            <p>📚 71 concepts</p>
            <p>🔗 Explore ideas across history</p>
            <p>⏱️ Ancient to Contemporary</p>
          </div>
        </div>
      </div>
    );
  }

  const color = getNodeColor(selectedNode);
  const category = selectedNode.domains.includes('politics') && selectedNode.domains.includes('philosophy')
    ? 'Philosophy + Politics'
    : selectedNode.domains.includes('politics')
      ? 'Politics'
      : 'Philosophy';

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={{...styles.conceptName, color}}>{selectedNode.name}</h2>
        <div style={styles.meta}>
          <span style={styles.era}>
            {selectedNode.era < 0 ? `${Math.abs(selectedNode.era)} BCE` : `${selectedNode.era} CE`}
          </span>
          <span style={{...styles.category, backgroundColor: color}}>
            {category}
          </span>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Description</h3>
        <p style={styles.description}>{selectedNode.description}</p>
      </div>

      {selectedNode.key_figures && selectedNode.key_figures.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👤 Key Figures</h3>
          <ul style={styles.list}>
            {selectedNode.key_figures.map((figure, i) => (
              <li key={i} style={styles.listItem}>{figure}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedNode.domains && selectedNode.domains.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏷️ Domains</h3>
          <div style={styles.tags}>
            {selectedNode.domains.map((domain, i) => (
              <span key={i} style={styles.tag}>{domain}</span>
            ))}
          </div>
        </div>
      )}

      {selectedNode.relationships && selectedNode.relationships.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔗 Relationships ({selectedNode.relationships.length})</h3>
          <div style={styles.relationships}>
            {selectedNode.relationships.slice(0, 8).map((rel, i) => (
              <div key={i} style={styles.relationship} className="relationship-card">
                <div style={styles.relType}>{formatRelationType(rel.type)}</div>
                <div style={styles.relTarget}>{formatNodeName(rel.target)}</div>
                {rel.description && (
                  <div style={styles.relDesc}>{rel.description}</div>
                )}
              </div>
            ))}
            {selectedNode.relationships.length > 8 && (
              <div style={styles.moreRelations}>
                ... and {selectedNode.relationships.length - 8} more relationships
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Format node names - remove underscores and capitalize
function formatNodeName(name) {
  // Replace underscores with spaces and capitalize each word
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format relationship types - remove underscores and capitalize
function formatRelationType(type) {
  const typeMap = {
    'influenced_by': 'Influenced By',
    'influenced': 'Influenced',
    'opposes': 'Opposes',
    'similar_to': 'Similar To',
    'evolved_from': 'Evolved From',
    'evolved_into': 'Evolved Into',
    'synthesized_with': 'Synthesized With',
    'foundation_for': 'Foundation For',
    'critiques': 'Critiques',
    'built_on': 'Built On',
    'moderate_form': 'Moderate Form',
    'diverged_from': 'Diverged From',
    'radicalized_into': 'Radicalized Into',
    'preceded': 'Preceded',
    'succeeded': 'Succeeded',
    'challenged_by': 'Challenged By',
    'challenged': 'Challenged',
    'incorporated_into': 'Incorporated Into',
    'reacted_against': 'Reacted Against',
    'inspired': 'Inspired',
    'inspired_by': 'Inspired By',
    'based_on': 'Based On'
  };

  // If we have a mapping, use it; otherwise capitalize words and remove underscores
  if (typeMap[type]) {
    return typeMap[type];
  }

  // Fallback: capitalize each word and remove underscores
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const styles = {
  panel: {
    width: '400px',
    height: '100%',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    padding: '24px',
    overflowY: 'auto',
    boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.3)'
  },
  welcome: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#5dade2',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#d5dbdd',
    margin: 0
  },
  header: {
    marginBottom: '24px',
    borderBottom: '2px solid #34495e',
    paddingBottom: '16px'
  },
  conceptName: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 12px 0'
  },
  meta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  era: {
    fontSize: '14px',
    color: '#bdc3c7'
  },
  category: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#5dade2',
    marginBottom: '12px'
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#ecf0f1'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px'
  },
  listItem: {
    marginBottom: '8px',
    color: '#ecf0f1'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    fontSize: '12px',
    padding: '4px 10px',
    backgroundColor: '#34495e',
    borderRadius: '4px',
    color: '#ecf0f1'
  },
  relationships: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  relationship: {
    padding: '12px',
    backgroundColor: '#0f3460',
    borderRadius: '8px',
    fontSize: '13px'
  },
  relType: {
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '4px'
  },
  relTarget: {
    color: '#ecf0f1',
    marginBottom: '4px'
  },
  relDesc: {
    fontSize: '12px',
    color: '#95a5a6',
    fontStyle: 'italic'
  },
  moreRelations: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  legend: {
    marginTop: '8px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  colorDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #fff'
  },
  instructions: {},
  stats: {
    fontSize: '14px',
    color: '#95a5a6',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }
};

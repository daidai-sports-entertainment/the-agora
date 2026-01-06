import { getNodeColor } from '../utils/colorScheme';
import {
  formatCategory,
  formatDomain,
  formatEra,
  formatRelationType,
  getText
} from '../utils/i18n';

/**
 * Right side information panel - displays selected concept details
 */
export function InfoPanel({ selectedNode, language, onLanguageChange, totalNodes }) {
  const t = getText(language);
  const handleLanguageToggle = (nextLanguage) => {
    if (nextLanguage !== language) {
      onLanguageChange?.(nextLanguage);
    }
  };

  if (!selectedNode) {
    return (
      <div style={styles.panel}>
        <div style={styles.languageRow}>
          <span style={styles.languageLabel}>{t.languageLabel}</span>
          <div style={styles.languageToggle}>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              style={{
                ...styles.languageOption,
                ...(language === 'en' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'en'}
            >
              {t.languageEN}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('zh')}
              style={{
                ...styles.languageOption,
                ...(language === 'zh' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'zh'}
            >
              {t.languageZH}
            </button>
          </div>
        </div>

        <div style={styles.welcome}>
          <h2 style={styles.title}>{t.appTitle}</h2>
          <p style={styles.subtitle}>{t.tagline}</p>

          <div style={styles.legend}>
            <h3 style={styles.sectionTitle}>{t.legendTitle}</h3>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: 'var(--color-philosophy)'}} />
              <span>{t.legendPhilosophy}</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: 'var(--color-politics)'}} />
              <span>{t.legendPolitics}</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: 'var(--color-both)'}} />
              <span>{t.legendInterdisciplinary}</span>
            </div>
          </div>

          <div style={styles.instructions}>
            <h3 style={styles.sectionTitle}>{t.instructionsTitle}</h3>
            <ul style={styles.list}>
              {t.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          <div style={styles.stats}>
            {t.stats(totalNodes || 71).map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const color = getNodeColor(selectedNode);
  const category = formatCategory(selectedNode.domains, language);

  return (
    <div style={styles.panel}>
      <div style={styles.languageRow}>
        <span style={styles.languageLabel}>{t.languageLabel}</span>
        <div style={styles.languageToggle}>
          <button
            type="button"
            onClick={() => handleLanguageToggle('en')}
            style={{
              ...styles.languageOption,
              ...(language === 'en' ? styles.languageOptionActive : {})
            }}
            aria-pressed={language === 'en'}
          >
            {t.languageEN}
          </button>
          <button
            type="button"
            onClick={() => handleLanguageToggle('zh')}
            style={{
              ...styles.languageOption,
              ...(language === 'zh' ? styles.languageOptionActive : {})
            }}
            aria-pressed={language === 'zh'}
          >
            {t.languageZH}
          </button>
        </div>
      </div>

      <div style={styles.header}>
        <h2 style={{...styles.conceptName, color}}>{selectedNode.name}</h2>
        <div style={styles.meta}>
          <span style={styles.era}>
            {formatEra(selectedNode.era, language)}
          </span>
          <span style={{...styles.category, backgroundColor: color}}>
            {category}
          </span>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t.description}</h3>
        <p style={styles.description}>{selectedNode.description}</p>
      </div>

      {selectedNode.key_figures && selectedNode.key_figures.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👤 {t.keyFigures}</h3>
          <ul style={styles.list}>
            {selectedNode.key_figures.map((figure, i) => (
              <li key={i} style={styles.listItem}>{figure}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedNode.domains && selectedNode.domains.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏷️ {t.domains}</h3>
          <div style={styles.tags}>
            {selectedNode.domains.map((domain, i) => (
              <span key={i} style={styles.tag}>{formatDomain(domain, language)}</span>
            ))}
          </div>
        </div>
      )}

      {selectedNode.relationships && selectedNode.relationships.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            🔗 {t.relationships} ({selectedNode.relationships.length})
          </h3>
          <div style={styles.relationships}>
            {selectedNode.relationships.slice(0, 8).map((rel, i) => (
              <div key={i} style={styles.relationship} className="relationship-card">
                <div style={styles.relType}>{formatRelationType(rel.type, language)}</div>
                <div style={styles.relTarget}>{formatNodeName(rel.target)}</div>
                {rel.description && (
                  <div style={styles.relDesc}>{rel.description}</div>
                )}
              </div>
            ))}
            {selectedNode.relationships.length > 8 && (
              <div style={styles.moreRelations}>
                {t.moreRelationships(selectedNode.relationships.length - 8)}
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
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const styles = {
  panel: {
    width: '400px',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(14, 20, 34, 0.96), rgba(10, 14, 26, 0.98))',
    color: 'var(--color-ink)',
    padding: '24px',
    overflowY: 'auto',
    boxShadow: '-10px 0 30px rgba(3, 5, 10, 0.55)',
    borderLeft: '1px solid var(--color-border)'
  },
  languageRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  languageLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-muted)'
  },
  languageToggle: {
    display: 'flex',
    padding: '4px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  languageOption: {
    border: 'none',
    background: 'transparent',
    color: 'var(--color-muted)',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '999px',
    cursor: 'pointer',
    letterSpacing: '0.5px'
  },
  languageOptionActive: {
    backgroundColor: 'rgba(227, 201, 154, 0.2)',
    color: 'var(--color-accent)',
    boxShadow: '0 6px 16px rgba(3, 5, 10, 0.35)'
  },
  welcome: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    margin: 0,
    fontFamily: 'var(--font-title)'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-muted)',
    margin: 0
  },
  header: {
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px'
  },
  conceptName: {
    fontSize: '24px',
    fontWeight: 600,
    margin: '0 0 12px 0',
    fontFamily: 'var(--font-title)',
    letterSpacing: '0.3px'
  },
  meta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  era: {
    fontSize: '14px',
    color: 'var(--color-muted)'
  },
  category: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: 600,
    letterSpacing: '0.4px'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    marginBottom: '12px'
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--color-ink)'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px'
  },
  listItem: {
    marginBottom: '8px',
    color: 'var(--color-ink)'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    fontSize: '12px',
    padding: '4px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    color: 'var(--color-ink)'
  },
  relationships: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  relationship: {
    padding: '12px',
    backgroundColor: 'rgba(13, 23, 41, 0.75)',
    borderRadius: '12px',
    fontSize: '13px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 10px 24px rgba(3, 6, 12, 0.35)'
  },
  relType: {
    fontWeight: 600,
    color: 'var(--color-accent)',
    marginBottom: '4px'
  },
  relTarget: {
    color: 'var(--color-ink)',
    marginBottom: '4px'
  },
  relDesc: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    fontStyle: 'italic'
  },
  moreRelations: {
    fontSize: '12px',
    color: 'var(--color-muted)',
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
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.12)'
  },
  instructions: {},
  stats: {
    fontSize: '14px',
    color: 'var(--color-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }
};

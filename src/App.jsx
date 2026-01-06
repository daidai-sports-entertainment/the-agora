import { useEffect, useState } from 'react';
import { IdeologyCanvas } from './components/IdeologyCanvas';
import { InfoPanel } from './components/InfoPanel';
import { WelcomeModal } from './components/WelcomeModal';
import { SearchBar } from './components/SearchBar';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ParticleBackground } from './components/ParticleBackground';
import { useGraphData } from './hooks/useGraphData';
import { getText } from './utils/i18n';

function App() {
  const { data, loading, error } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('ideology_universe_language') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ideology_universe_language', language);
    } catch {
      // Ignore storage failures (private mode, etc.)
    }
  }, [language]);

  const t = getText(language);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewControls, setViewControls] = useState(null);

  const matchesFilter = (node, filters) => {
    if (!node || !filters || filters.length === 0) return true;
    const hasPhilosophy = node.domains?.includes('philosophy');
    const hasPolitics = node.domains?.includes('politics');
    const category = hasPhilosophy && hasPolitics
      ? 'both'
      : hasPolitics
        ? 'politics'
        : 'philosophy';

    return filters.includes(category);
  };

  useEffect(() => {
    if (selectedNode && !matchesFilter(selectedNode, activeFilters)) {
      setSelectedNode(null);
    }
  }, [activeFilters, selectedNode]);

  if (loading) {
    return <LoadingAnimation language={language} />;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h2>Error loading data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <ParticleBackground />
      <WelcomeModal language={language} />
      <header style={styles.header}>
        <div style={styles.headerStars} aria-hidden="true" />
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>{t.appTitle}</h1>
          <p style={styles.tagline}>{t.tagline}</p>
        </div>
        <div style={styles.headerCenter}>
          <SearchBar data={data} onSelectNode={setSelectedNode} language={language} />
        </div>
        <div style={styles.headerRight}>
          <div style={styles.legend}>
            <button
              type="button"
              onClick={() => {
                setActiveFilters(prev => (
                  prev.includes('philosophy')
                    ? prev.filter(item => item !== 'philosophy')
                    : [...prev, 'philosophy']
                ));
              }}
              style={{
                ...styles.legendButton,
                ...(activeFilters.includes('philosophy') ? styles.legendButtonActive : {})
              }}
            >
              <span style={{...styles.dot, backgroundColor: 'var(--color-philosophy)'}}></span>
              {t.legendPhilosophy}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilters(prev => (
                  prev.includes('politics')
                    ? prev.filter(item => item !== 'politics')
                    : [...prev, 'politics']
                ));
              }}
              style={{
                ...styles.legendButton,
                ...(activeFilters.includes('politics') ? styles.legendButtonActive : {})
              }}
            >
              <span style={{...styles.dot, backgroundColor: 'var(--color-politics)'}}></span>
              {t.legendPolitics}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilters(prev => (
                  prev.includes('both')
                    ? prev.filter(item => item !== 'both')
                    : [...prev, 'both']
                ));
              }}
              style={{
                ...styles.legendButton,
                ...(activeFilters.includes('both') ? styles.legendButtonActive : {})
              }}
            >
              <span style={{...styles.dot, backgroundColor: 'var(--color-both)'}}></span>
              {t.legendInterdisciplinary}
            </button>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        <div style={styles.canvasContainer}>
          {selectedNode && <div style={styles.telescopeOverlay} aria-hidden="true" />}
          <div style={styles.canvasNote}>{t.proximityNote}</div>
          <div style={styles.viewControls}>
            <button
              type="button"
              style={styles.controlButton}
              onClick={() => viewControls?.zoomIn?.()}
              aria-label="Zoom in"
              title="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              style={styles.controlButton}
              onClick={() => viewControls?.zoomOut?.()}
              aria-label="Zoom out"
              title="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              style={{ ...styles.controlButton, ...styles.resetButton }}
              onClick={() => viewControls?.reset?.()}
              aria-label="Reset view"
              title="Reset view"
            >
              🔭
            </button>
          </div>
          <IdeologyCanvas
            data={data}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
            language={language}
            onRegisterControls={setViewControls}
            filterDomain={activeFilters}
          />
        </div>
        <InfoPanel
          selectedNode={selectedNode}
          language={language}
          totalNodes={data.nodes.length}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  );
}

const styles = {
  app: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-ink)',
    fontFamily: 'var(--font-body)',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1
  },
  loading: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    color: '#eaeaea'
  },
  loadingText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  loadingSubtext: {
    fontSize: '14px',
    color: '#95a5a6'
  },
  error: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-politics)'
  },
  header: {
    height: '80px',
    background: 'linear-gradient(135deg, rgba(15, 24, 40, 0.95), rgba(18, 33, 60, 0.9))',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    boxShadow: '0 12px 30px rgba(3, 6, 12, 0.45)',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    zIndex: 5
  },
  headerStars: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(circle at 12% 20%, rgba(230, 215, 180, 0.4) 0 1px, transparent 2px),
      radial-gradient(circle at 75% 25%, rgba(140, 180, 255, 0.45) 0 1.4px, transparent 3px),
      radial-gradient(circle at 40% 55%, rgba(255, 255, 255, 0.28) 0 1px, transparent 2px),
      radial-gradient(circle at 85% 70%, rgba(180, 146, 224, 0.32) 0 1.2px, transparent 2.6px),
      radial-gradient(circle at 25% 75%, rgba(230, 201, 138, 0.3) 0 1px, transparent 2px),
      radial-gradient(circle at 55% 18%, rgba(255, 255, 255, 0.26) 0 0.9px, transparent 2px),
      radial-gradient(circle at 18% 60%, rgba(140, 180, 255, 0.32) 0 1px, transparent 2.4px),
      radial-gradient(circle at 62% 48%, rgba(230, 215, 180, 0.28) 0 0.9px, transparent 2px)
    `,
    opacity: 0.85,
    mixBlendMode: 'screen',
    animation: 'headerTwinkle 7s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: '0 0 auto',
    position: 'relative',
    zIndex: 1
  },
  logo: {
    fontSize: '28px',
    fontWeight: 600,
    margin: 0,
    fontFamily: 'var(--font-title)',
    letterSpacing: '0.4px',
    background: 'linear-gradient(135deg, var(--color-accent), var(--color-glow))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  tagline: {
    fontSize: '13px',
    color: 'var(--color-muted)',
    margin: 0
  },
  headerCenter: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1
  },
  headerRight: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flex: '0 0 auto',
    position: 'relative',
    zIndex: 1
  },
  legend: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  legendButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--color-ink)',
    background: 'transparent',
    border: '1px solid transparent',
    padding: '6px 10px',
    borderRadius: '999px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  legendButtonActive: {
    borderColor: 'rgba(230, 201, 138, 0.35)',
    color: 'var(--color-accent)'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.12)'
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1
  },
  canvasNote: {
    position: 'absolute',
    top: '18px',
    left: '24px',
    right: '24px',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: '13px',
    color: 'rgba(168, 177, 194, 0.65)',
    letterSpacing: '0.2px',
    textShadow: '0 6px 18px rgba(4, 6, 12, 0.8)',
    zIndex: 1,
    pointerEvents: 'none'
  },
  viewControls: {
    position: 'absolute',
    right: '24px',
    bottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 2
  },
  controlButton: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(12, 18, 32, 0.9)',
    color: 'var(--color-ink)',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 12px 30px rgba(3, 6, 12, 0.5)',
    backdropFilter: 'blur(8px)'
  },
  resetButton: {
    fontSize: '18px'
  },
  telescopeOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at center, rgba(234, 209, 164, 0.12) 0%, rgba(11, 16, 30, 0.65) 58%, rgba(6, 8, 15, 0.92) 100%)',
    boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.7)',
    animation: 'lensPulse 3.2s ease-in-out infinite',
    zIndex: 1
  }
};

export default App;

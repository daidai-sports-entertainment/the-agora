import { useState } from 'react';
import { IdeologyCanvas } from './components/IdeologyCanvas';
import { InfoPanel } from './components/InfoPanel';
import { WelcomeModal } from './components/WelcomeModal';
import { SearchBar } from './components/SearchBar';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ParticleBackground } from './components/ParticleBackground';
import { useGraphData } from './hooks/useGraphData';

function App() {
  const { data, loading, error } = useGraphData();
  const [selectedNode, setSelectedNode] = useState(null);

  if (loading) {
    return <LoadingAnimation />;
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
      <WelcomeModal />
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>The Agora</h1>
          <p style={styles.tagline}>A Visual Atlas of Ideology</p>
        </div>
        <div style={styles.headerCenter}>
          <SearchBar data={data} onSelectNode={setSelectedNode} />
        </div>
        <div style={styles.headerRight}>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span style={{...styles.dot, backgroundColor: '#3498db'}}></span>
              Philosophy
            </span>
            <span style={styles.legendItem}>
              <span style={{...styles.dot, backgroundColor: '#e74c3c'}}></span>
              Politics
            </span>
            <span style={styles.legendItem}>
              <span style={{...styles.dot, backgroundColor: '#9b59b6'}}></span>
              Interdisciplinary
            </span>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        <div style={styles.canvasContainer}>
          <IdeologyCanvas
            data={data}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
        </div>
        <InfoPanel selectedNode={selectedNode} />
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
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden'
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
    backgroundColor: '#1a1a2e',
    color: '#e74c3c'
  },
  header: {
    height: '80px',
    backgroundColor: '#16213e',
    borderBottom: '2px solid #0f3460',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: '0 0 auto'
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(135deg, #5dade2, #bb8fce)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  tagline: {
    fontSize: '13px',
    color: '#bdc3c7',
    margin: 0
  },
  headerCenter: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 24px'
  },
  headerRight: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flex: '0 0 auto'
  },
  legend: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #fff'
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  },
  canvasContainer: {
    flex: 1,
    position: 'relative'
  }
};

export default App;

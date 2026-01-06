import { useState, useEffect } from 'react';

/**
 * Welcome modal that appears on first visit
 * Shows instructions and can be dismissed
 */
export function WelcomeModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen modal before
    const hasSeenWelcome = localStorage.getItem('ideology_universe_welcome_seen');
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('ideology_universe_welcome_seen', 'true');
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={handleClose}>×</button>

        <h2 style={styles.title}>Welcome to The Agora</h2>
        <p style={styles.message}>
          Explore the evolution of philosophical and political thought from ancient to contemporary times. Click any node to begin your journey.
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.icon}>🖱️</span>
            <span>Click nodes to reveal connections</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>🔍</span>
            <span>Scroll to zoom and drag to pan</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>📖</span>
            <span>View details in the side panel</span>
          </div>
        </div>

        <button style={styles.startButton} onClick={handleClose}>
          Start Exploring
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    backgroundColor: '#16213e',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '2px solid #3498db',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#95a5a6',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0',
    width: '32px',
    height: '32px',
    transition: 'color 0.2s'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#3498db',
    margin: '0 0 20px 0',
    textAlign: 'center'
  },
  message: {
    fontSize: '18px',
    color: '#ecf0f1',
    lineHeight: '1.6',
    textAlign: 'center',
    marginBottom: '32px'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    color: '#bdc3c7'
  },
  icon: {
    fontSize: '24px',
    width: '32px',
    textAlign: 'center'
  },
  startButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

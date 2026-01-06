import { useState, useEffect } from 'react';
import { getText } from '../utils/i18n';

/**
 * Welcome modal that appears on first visit
 * Shows instructions and can be dismissed
 */
export function WelcomeModal({ onClose, language }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = getText(language);

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

        <h2 style={styles.title}>{t.welcomeTitle}</h2>
        <p style={styles.message}>{t.welcomeMessage}</p>

        <div style={styles.features}>
          {t.welcomeFeatures.map((feature, index) => (
            <div key={feature} style={styles.feature}>
              <span style={styles.icon}>
                {index === 0 ? '🖱️' : index === 1 ? '🔭' : '📖'}
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button style={styles.startButton} onClick={handleClose}>
          {t.startExploring}
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
    backgroundColor: 'rgba(15, 21, 36, 0.96)',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: 'var(--color-muted)',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0',
    width: '32px',
    height: '32px',
    transition: 'color 0.2s'
  },
  title: {
    fontSize: '32px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    margin: '0 0 20px 0',
    textAlign: 'center',
    fontFamily: 'var(--font-title)'
  },
  message: {
    fontSize: '18px',
    color: 'var(--color-ink)',
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
    color: 'var(--color-muted)'
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
    fontWeight: 600,
    color: '#fff',
    backgroundColor: 'var(--color-accent-strong)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

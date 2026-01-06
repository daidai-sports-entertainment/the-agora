import { getText } from '../utils/i18n';

/**
 * Beautiful cosmic loading animation
 */
export function LoadingAnimation({ language }) {
  const t = getText(language);
  return (
    <div style={styles.container}>
      <div style={styles.cosmicLoader}>
        {/* Center star */}
        <div style={styles.centerStar}></div>

        {/* Orbiting planets */}
        <div style={styles.orbit1}>
          <div style={styles.planet1}></div>
        </div>
        <div style={styles.orbit2}>
          <div style={styles.planet2}></div>
        </div>
        <div style={styles.orbit3}>
          <div style={styles.planet3}></div>
        </div>
      </div>

      <div style={styles.textContainer}>
        <h2 style={styles.title}>{t.loadingTitle}</h2>
        <p style={styles.subtitle}>{t.loadingSubtitle}</p>
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes rotate1 {
    from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
  }

  @keyframes rotate2 {
    from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
    to { transform: rotate(-360deg) translateX(90px) rotate(360deg); }
  }

  @keyframes rotate3 {
    from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070a12',
    background: 'radial-gradient(ellipse at center, #121a2b 0%, #070a12 100%)',
    overflow: 'hidden',
    position: 'relative'
  },
  cosmicLoader: {
    position: 'relative',
    width: '300px',
    height: '300px',
    marginBottom: '60px'
  },
  centerStar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '30px',
    height: '30px',
    backgroundColor: '#e6c98a',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: `
      0 0 20px #e6c98a,
      0 0 40px rgba(230, 201, 138, 0.8),
      0 0 60px rgba(230, 201, 138, 0.5)
    `,
    animation: 'pulse 2s ease-in-out infinite'
  },
  orbit1: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120px',
    height: '120px',
    border: '1px solid rgba(230, 201, 138, 0.2)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'rotate1 3s linear infinite'
  },
  orbit2: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '180px',
    height: '180px',
    border: '1px solid rgba(140, 164, 214, 0.2)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'rotate2 5s linear infinite'
  },
  orbit3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '240px',
    height: '240px',
    border: '1px solid rgba(210, 120, 120, 0.2)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'rotate3 7s linear infinite'
  },
  planet1: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: '#8fb4ff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 10px rgba(143, 180, 255, 0.8)'
  },
  planet2: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '16px',
    height: '16px',
    backgroundColor: '#b492e0',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 12px rgba(180, 146, 224, 0.8)'
  },
  planet3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '14px',
    height: '14px',
    backgroundColor: '#d48b8b',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 11px rgba(212, 139, 139, 0.8)'
  },
  textContainer: {
    textAlign: 'center',
    animation: 'fadeInOut 2s ease-in-out infinite'
  },
  title: {
    fontSize: '32px',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #e6c98a, #8fb4ff, #d48b8b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 16px 0',
    letterSpacing: '1px',
    fontFamily: 'var(--font-title)'
  },
  subtitle: {
    fontSize: '16px',
    color: '#b0b7c4',
    margin: 0,
    fontStyle: 'italic'
  }
};

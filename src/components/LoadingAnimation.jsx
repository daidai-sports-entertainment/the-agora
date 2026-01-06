/**
 * Beautiful cosmic loading animation
 */
export function LoadingAnimation() {
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
        <h2 style={styles.title}>Loading The Agora...</h2>
        <p style={styles.subtitle}>Mapping the landscape of ideas from ancient to contemporary thought</p>
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
    backgroundColor: '#0a0a1a',
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a1a 100%)',
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
    backgroundColor: '#3498db',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: `
      0 0 20px #3498db,
      0 0 40px #3498db,
      0 0 60px #3498db
    `,
    animation: 'pulse 2s ease-in-out infinite'
  },
  orbit1: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120px',
    height: '120px',
    border: '1px solid rgba(52, 152, 219, 0.2)',
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
    border: '1px solid rgba(155, 89, 182, 0.2)',
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
    border: '1px solid rgba(231, 76, 60, 0.2)',
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
    backgroundColor: '#3498db',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 10px #3498db'
  },
  planet2: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '16px',
    height: '16px',
    backgroundColor: '#9b59b6',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 12px #9b59b6'
  },
  planet3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '14px',
    height: '14px',
    backgroundColor: '#e74c3c',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 11px #e74c3c'
  },
  textContainer: {
    textAlign: 'center',
    animation: 'fadeInOut 2s ease-in-out infinite'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3498db, #9b59b6, #e74c3c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 16px 0',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#95a5a6',
    margin: 0,
    fontStyle: 'italic'
  }
};

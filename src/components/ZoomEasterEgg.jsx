/**
 * Easter egg dialog that appears when user zooms to maximum or minimum scale
 */
export function ZoomEasterEgg({ isOpen, onClose, zoomLevel, language }) {
  if (!isOpen) return null;

  const isMaxZoom = zoomLevel === 'max';

  const messages = {
    max: {
      zh: {
        title: '探索到宇宙边缘了！✨',
        body: '看不到你想找的思想？欢迎发邮件到',
        action: '告诉我们你的建议'
      },
      en: {
        title: 'Reached the Edge of the Universe! ✨',
        body: "Can't find the idea you're looking for? Email us at",
        action: 'Share your suggestions'
      }
    },
    min: {
      zh: {
        title: '从全局视角观察宇宙 🌌',
        body: '想提交新的思想？欢迎发邮件到',
        action: '帮助扩展思想宇宙'
      },
      en: {
        title: 'Viewing the Whole Universe 🌌',
        body: 'Want to suggest new ideas? Email us at',
        action: 'Help expand the universe'
      }
    }
  };

  const msg = messages[isMaxZoom ? 'max' : 'min'][language];
  const email = 'yd2598@columbia.edu';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{msg.title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          <p style={styles.message}>{msg.body}</p>
          <a
            href={`mailto:${email}`}
            style={styles.emailLink}
            onClick={onClose}
          >
            {email}
          </a>
          <p style={styles.action}>{msg.action}</p>
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            style={styles.button}
          >
            {language === 'zh' ? '继续探索' : 'Continue Exploring'}
          </button>
        </div>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    backgroundColor: 'rgba(14, 20, 34, 0.98)',
    borderRadius: '16px',
    border: '2px solid rgba(230, 201, 138, 0.3)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    maxWidth: '500px',
    width: '90%',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    borderBottom: '1px solid rgba(230, 201, 138, 0.2)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    margin: 0,
    fontFamily: 'var(--font-title)'
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid rgba(230, 201, 138, 0.3)',
    backgroundColor: 'transparent',
    color: 'var(--color-accent)',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  content: {
    padding: '32px 24px',
    textAlign: 'center'
  },
  message: {
    color: 'var(--color-text)',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  emailLink: {
    color: 'var(--color-accent)',
    fontSize: '18px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'block',
    marginBottom: '16px',
    transition: 'opacity 0.2s ease'
  },
  action: {
    color: 'var(--color-muted)',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(230, 201, 138, 0.2)',
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    padding: '12px 32px',
    borderRadius: '8px',
    border: '1px solid rgba(230, 201, 138, 0.4)',
    backgroundColor: 'rgba(230, 201, 138, 0.2)',
    color: 'var(--color-accent)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

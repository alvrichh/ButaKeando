import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../common/Icon';

const ToastContext = createContext(null);
const MAX_VISIBLE_TOASTS = 4;

const toneIcons = {
  success: 'check',
  error: 'alert',
  warning: 'alert',
  info: 'info',
};

function createToastId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, tone = 'info', duration = tone === 'error' ? 7000 : 4200 }) => {
      const id = createToastId();
      const toast = { id, title, message, tone, duration };

      setToasts((current) => [...current, toast].slice(-MAX_VISIBLE_TOASTS));

      const timer = window.setTimeout(() => dismissToast(id), duration);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [toasts, showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div aria-label="Notificaciones" className="toast-viewport" role="region">
              {toasts.map((toast) => (
                <article
                  key={toast.id}
                  className={['toast', `toast--${toast.tone}`].join(' ')}
                  role={toast.tone === 'error' ? 'alert' : 'status'}
                >
                  <span className="toast__icon">
                    <Icon name={toneIcons[toast.tone] ?? 'info'} size={18} />
                  </span>
                  <div className="toast__content">
                    <strong>{toast.title}</strong>
                    {toast.message && <p>{toast.message}</p>}
                  </div>
                  <button
                    aria-label={`Cerrar aviso: ${toast.title}`}
                    className="toast__dismiss"
                    onClick={() => dismissToast(toast.id)}
                    type="button"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </article>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
}

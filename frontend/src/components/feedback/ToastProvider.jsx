import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

function createToastId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = (id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ title, message, tone = 'info', duration = 4200 }) => {
    const id = createToastId();
    const toast = { id, title, message, tone, duration };

    setToasts((current) => [...current, toast]);

    const timer = window.setTimeout(() => dismissToast(id), duration);
    timersRef.current.set(id, timer);
    return id;
  };

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div aria-live="polite" className="toast-viewport">
              {toasts.map((toast) => (
                <article key={toast.id} className={['toast', `toast--${toast.tone}`].join(' ')}>
                  <div>
                    <strong>{toast.title}</strong>
                    {toast.message && <p>{toast.message}</p>}
                  </div>
                  <button
                    aria-label={`Dismiss ${toast.title}`}
                    className="toast__dismiss"
                    onClick={() => dismissToast(toast.id)}
                    type="button"
                  >
                    +
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

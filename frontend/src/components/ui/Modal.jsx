import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

const ModalContext = createContext(null);

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ModalRoot({ modal, onClose }) {
  const titleId = useId();
  const descriptionId = useId();
  const shellRef = useRef(null);

  useEffect(() => {
    if (!modal || !shellRef.current) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const shell = shellRef.current;
    shell.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && modal.dismissOnEscape !== false) {
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const items = Array.from(shell.querySelectorAll(FOCUSABLE_SELECTOR));
      if (!items.length) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && (document.activeElement === first || document.activeElement === shell)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [modal, onClose]);

  if (!modal || typeof document === 'undefined') {
    return null;
  }

  const handleOverlayClick = () => {
    if (modal.closeOnOverlay !== false) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal-root" role="presentation">
      <div aria-hidden="true" className="modal-overlay" onClick={handleOverlayClick} />
      <div
        ref={shellRef}
        aria-describedby={modal.description ? descriptionId : undefined}
        aria-label={modal.title ? undefined : modal.ariaLabel}
        aria-labelledby={modal.title ? titleId : undefined}
        aria-modal="true"
        className={['modal-shell', `modal-shell--${modal.size ?? 'medium'}`].join(' ')}
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="Cerrar ventana" className="modal-close" onClick={onClose} type="button">
          <Icon name="close" size={18} />
        </button>

        {modal.icon && <div className="modal-icon">{modal.icon}</div>}
        {modal.eyebrow && <span className="modal-eyebrow">{modal.eyebrow}</span>}
        {modal.title && <h2 id={titleId}>{modal.title}</h2>}
        {modal.description && (
          <p className="modal-description" id={descriptionId}>
            {modal.description}
          </p>
        )}
        {modal.content && <div className="modal-body">{modal.content}</div>}

        {modal.actions?.length ? (
          <div className="modal-actions">
            {modal.actions.map((action) => (
              <Button
                key={action.label}
                href={action.href}
                onClick={() => {
                  action.onClick?.();
                  if (action.closeOnClick !== false) {
                    onClose();
                  }
                }}
                to={action.to}
                tone={action.tone ?? 'secondary'}
                type={action.type ?? 'button'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((nextModal) => {
    setModal({
      closeOnOverlay: true,
      dismissOnEscape: true,
      ...nextModal,
    });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(modal));
    return () => document.body.classList.remove('modal-open');
  }, [modal]);

  const value = useMemo(() => ({ modal, openModal, closeModal }), [modal, openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRoot modal={modal} onClose={closeModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within ModalProvider.');
  }

  return context;
}

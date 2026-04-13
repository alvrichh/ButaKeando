import { createContext, useContext, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../common/Button';

const ModalContext = createContext(null);

function ModalRoot({ modal, onClose }) {
  const titleId = useId();

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
      <button aria-label="Close modal overlay" className="modal-overlay" onClick={handleOverlayClick} type="button" />
      <div
        aria-labelledby={modal.title ? titleId : undefined}
        aria-modal="true"
        className={['modal-shell', `modal-shell--${modal.size ?? 'medium'}`].join(' ')}
        role="dialog"
      >
        <button aria-label="Close modal" className="modal-close" onClick={onClose} type="button">
          +
        </button>

        {modal.eyebrow && <span className="modal-eyebrow">{modal.eyebrow}</span>}
        {modal.title && <h2 id={titleId}>{modal.title}</h2>}
        {modal.description && <p className="modal-description">{modal.description}</p>}
        {modal.icon && <div className="modal-icon">{modal.icon}</div>}
        {modal.content && <div className="modal-body">{modal.content}</div>}

        {modal.actions?.length ? (
          <div className="modal-actions">
            {modal.actions.map((action) => (
              <Button
                key={action.label}
                onClick={() => {
                  action.onClick?.();
                  if (action.closeOnClick !== false) {
                    onClose();
                  }
                }}
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

  const openModal = (nextModal) => {
    setModal({
      closeOnOverlay: true,
      dismissOnEscape: true,
      ...nextModal,
    });
  };

  const closeModal = () => setModal(null);

  useEffect(() => {
    if (!modal) {
      document.body.classList.remove('modal-open');
      return undefined;
    }

    document.body.classList.add('modal-open');

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && modal.dismissOnEscape !== false) {
        closeModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [modal]);

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
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

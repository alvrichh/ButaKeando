import { ModalProvider } from '../components/ui/Modal';
import { ToastProvider } from '../components/feedback/ToastProvider';

export function Providers({ children }) {
  return (
    <ToastProvider>
      <ModalProvider>{children}</ModalProvider>
    </ToastProvider>
  );
}

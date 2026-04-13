import { ModalProvider } from '../components/ui/Modal';
import { ToastProvider } from '../components/feedback/ToastProvider';
import { CartProvider } from '../features/cart/CartProvider';

export function Providers({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        <ModalProvider>{children}</ModalProvider>
      </CartProvider>
    </ToastProvider>
  );
}

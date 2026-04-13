import { createBrowserRouter } from 'react-router-dom';
import { SiteShell } from '../components/layout/SiteShell';
import { CatalogPage } from '../features/catalog/pages/CatalogPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { ContactPage } from '../features/contact/pages/ContactPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { HomePage } from '../features/home/pages/HomePage';
import { NotFoundPage } from '../features/home/pages/NotFoundPage';
import { OrderSuccessPage } from '../features/order/pages/OrderSuccessPage';
import { ProductPage } from '../features/product/pages/ProductPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'producto/:slug', element: <ProductPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'contacto', element: <ContactPage /> },
      { path: 'pedido/confirmado', element: <OrderSuccessPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

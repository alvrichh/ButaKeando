import { createBrowserRouter } from 'react-router-dom';
import { SiteShell } from '../components/layout/SiteShell';
import { HomePage } from '../features/home/pages/HomePage';
import { CatalogPage } from '../features/catalog/pages/CatalogPage';
import { ProductPage } from '../features/product/pages/ProductPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { OrderSuccessPage } from '../features/order/pages/OrderSuccessPage';
import { NotFoundPage } from '../features/home/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/success', element: <OrderSuccessPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

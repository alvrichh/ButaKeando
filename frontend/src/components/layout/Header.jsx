import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageContainer } from './PageContainer';
import { Icon } from '../common/Icon';
import logoTransparent from '../../assets/images/logos/butakeando-logo-transparent.png';
import { primaryNavigationItems } from '../../constants/navigation';
import { useCart } from '../../features/cart/CartProvider';

function buildLinkClassName({ isActive }) {
  return ['site-header__link', isActive && 'site-header__link--active'].filter(Boolean).join(' ');
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItemsCount } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const closeMenu = () => setIsMenuOpen(false);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('resize', closeMenu);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const cartLabel = cartItemsCount > 0 ? `Carrito, ${cartItemsCount} productos` : 'Carrito vacío';

  return (
    <header className="site-header">
      <PageContainer className="site-header__inner">
        <NavLink aria-label="ButaKeando, ir al inicio" className="site-header__brand" to="/">
          <img
            alt=""
            className="site-header__brand-logo"
            decoding="async"
            height="48"
            src={logoTransparent}
            width="168"
          />
        </NavLink>

        <nav
          aria-label="Principal"
          className={['site-header__nav', isMenuOpen && 'site-header__nav--open'].filter(Boolean).join(' ')}
          id="site-navigation"
        >
          {primaryNavigationItems.map((item) => (
            <NavLink key={item.to} className={buildLinkClassName} end={item.to === '/'} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <NavLink
            aria-label={cartLabel}
            className={({ isActive }) =>
              ['site-header__cart', isActive && 'site-header__cart--active'].filter(Boolean).join(' ')
            }
            to="/carrito"
          >
            <Icon name="cart" size={22} />
            {cartItemsCount > 0 ? (
              <span aria-hidden="true" className="site-header__cart-badge">
                {cartItemsCount}
              </span>
            ) : null}
          </NavLink>

          <button
            aria-controls="site-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
            className={['site-header__toggle', isMenuOpen && 'site-header__toggle--open'].filter(Boolean).join(' ')}
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </PageContainer>
    </header>
  );
}

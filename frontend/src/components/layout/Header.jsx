import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageContainer } from './PageContainer';
import logoTransparent from '../../assets/images/logos/butakeando-logo-transparent.png';
import { primaryNavigationItems } from '../../constants/navigation';
import { useCart } from '../../features/cart/CartProvider';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItemsCount } = useCart();

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

  return (
    <header className="site-header">
      <PageContainer className="site-header__inner">
        <NavLink className="site-header__brand" onClick={() => setIsMenuOpen(false)} to="/">
          <img alt="Logotipo ButaKeando" className="site-header__brand-logo" src={logoTransparent} />
          <span className="site-header__brand-copy">
            <strong>ButaKeando</strong>
            <small>Butacas y sillones con estilo</small>
          </span>
        </NavLink>

        <button
          aria-expanded={isMenuOpen}
          aria-label="Abrir menu principal"
          className={['site-header__toggle', isMenuOpen && 'site-header__toggle--open'].filter(Boolean).join(' ')}
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          aria-label="Principal"
          className={['site-header__nav', isMenuOpen && 'site-header__nav--open'].filter(Boolean).join(' ')}
        >
          {primaryNavigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                ['site-header__link', isActive && 'site-header__link--active'].filter(Boolean).join(' ')
              }
              end={item.to === '/'}
              onClick={() => setIsMenuOpen(false)}
              to={item.to}
            >
              <span>{item.label}</span>
              {item.to === '/carrito' && cartItemsCount > 0 ? <span className="site-header__cart-badge">{cartItemsCount}</span> : null}
            </NavLink>
          ))}
        </nav>
      </PageContainer>
    </header>
  );
}

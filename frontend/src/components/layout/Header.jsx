import { NavLink } from 'react-router-dom';
import { PageContainer } from './PageContainer';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/checkout', label: 'Checkout' },
];

export function Header() {
  return (
    <header className="site-header">
      <PageContainer className="site-header__inner">
        <NavLink className="site-header__brand" to="/">
          <span className="site-header__brand-mark" aria-hidden="true">
            BK
          </span>
          <span>
            <strong>ButaKeando</strong>
            <small>Upholstered furniture atelier</small>
          </span>
        </NavLink>

        <nav aria-label="Primary" className="site-header__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                ['site-header__link', isActive && 'site-header__link--active'].filter(Boolean).join(' ')
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </PageContainer>
    </header>
  );
}

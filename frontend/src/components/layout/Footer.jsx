import { NavLink } from 'react-router-dom';
import { PageContainer } from './PageContainer';
import { primaryNavigationItems } from '../../constants/navigation';

export function Footer() {
  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>ButaKeando</strong>
          <p>Butacas y sillones con una estetica premium, calida y pensada para hogares con personalidad.</p>
        </div>

        <nav aria-label="Footer" className="site-footer__nav">
          {primaryNavigationItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-footer__contact">
          <strong>Contacto</strong>
          <a href="mailto:hola@butakeando.es">hola@butakeando.es</a>
          <span>Sevilla, Espana</span>
        </div>
      </PageContainer>
    </footer>
  );
}

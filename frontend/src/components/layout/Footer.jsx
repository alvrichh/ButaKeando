import { NavLink } from 'react-router-dom';
import { PageContainer } from './PageContainer';
import { footerNavigationItems } from '../../constants/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <PageContainer>
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <strong>ButaKeando</strong>
            <p>Butacas y sillones con una estética premium, cálida y pensada para hogares con personalidad.</p>
          </div>

          <nav aria-label="Pie de página" className="site-footer__nav">
            <span className="site-footer__heading">Tienda</span>
            {footerNavigationItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-footer__contact">
            <span className="site-footer__heading">Contacto</span>
            <a href="mailto:hola@butakeando.es">hola@butakeando.es</a>
            <span>Sevilla, España</span>
            <span>Pago seguro con Stripe</span>
          </div>
        </div>

        <div className="site-footer__legal">
          <span>© {year} ButaKeando. Todos los derechos reservados.</span>
        </div>
      </PageContainer>
    </footer>
  );
}

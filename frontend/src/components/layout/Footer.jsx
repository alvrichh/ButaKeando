import { NavLink } from 'react-router-dom';
import { PageContainer } from './PageContainer';
import { footerNavigationItems } from '../../constants/navigation';
import { appConfig } from '../../lib/config';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <PageContainer>
        <div className="site-footer__inner">
          <p className="site-footer__claim">
            Butacas y sillones con carácter,
            <br />
            elegidos uno a uno desde Sevilla.
          </p>

          <nav aria-label="Pie de página" className="site-footer__col">
            <span className="site-footer__heading mono">Tienda</span>
            {footerNavigationItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-footer__col">
            <span className="site-footer__heading mono">Escríbenos</span>
            <a href={`mailto:${appConfig.supportEmail}`}>{appConfig.supportEmail}</a>
            <span>Sevilla, España</span>
            <span>Pago seguro con Stripe</span>
          </div>
        </div>

        <p aria-hidden="true" className="site-footer__wordmark">
          ButaKeando
        </p>

        <div className="site-footer__legal mono">
          <span>© {year} ButaKeando</span>
          <span>Todos los derechos reservados</span>
        </div>
      </PageContainer>
    </footer>
  );
}

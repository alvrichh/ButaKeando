import { Link } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Icon } from '../../../components/common/Icon';
import { ProductMedia } from '../../../components/ui/ProductMedia';
import { getProductBySlug } from '../../../constants/products';
import { formatCurrency } from '../../../utils/currency';
import { heroContent, trustHighlights } from '../homeData';

export function LandingHero() {
  const featuredProduct = getProductBySlug(heroContent.featuredSlug);

  return (
    <section aria-labelledby="hero-title" className="landing-hero">
      <div className="landing-hero__copy">
        <Badge tone="gold">{heroContent.eyebrow}</Badge>
        <h1 id="hero-title">{heroContent.title}</h1>
        <p>{heroContent.subtitle}</p>

        <div className="landing-hero__actions">
          <Button size="lg" to={heroContent.primaryCta.to}>
            {heroContent.primaryCta.label}
            <Icon name="arrowRight" size={18} />
          </Button>
          <Button size="lg" to={heroContent.secondaryCta.to} tone="ghost">
            {heroContent.secondaryCta.label}
          </Button>
        </div>

        <ul className="landing-trust">
          {trustHighlights.map((item) => (
            <li key={item.title} className="landing-trust__item">
              <span className="landing-trust__icon">
                <Icon name={item.icon} size={20} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.body}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {featuredProduct ? (
        <div className="landing-hero__visual">
          <ProductMedia className="landing-hero__media" priority product={featuredProduct} />
          <Link className="landing-hero__feature" to={`/producto/${featuredProduct.slug}`}>
            <span className="landing-hero__feature-label">Pieza destacada</span>
            <strong>{featuredProduct.name}</strong>
            <span className="landing-hero__feature-price">{formatCurrency(featuredProduct.price)}</span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}

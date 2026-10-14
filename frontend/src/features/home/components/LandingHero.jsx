import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { ProductMedia } from '../../../components/ui/ProductMedia';
import { getProductBySlug } from '../../../constants/products';
import { formatCurrency } from '../../../utils/currency';
import { heroContent } from '../homeData';
import { Stamp } from './Stamp';

export function LandingHero() {
  const featuredProduct = getProductBySlug(heroContent.featuredSlug);

  return (
    <section aria-labelledby="hero-title" className="hero">
      <div className="hero__entry">
        <p className="hero__phonetic mono">
          {heroContent.syllables} <span aria-hidden="true">·</span> <em>{heroContent.grammar}</em>
        </p>
        <h1 className="hero__word" id="hero-title">
          {heroContent.word}
          <span className="hero__dot">.</span>
        </h1>

        <ol className="hero__definitions">
          {heroContent.definitions.map((definition) => (
            <li key={definition}>{definition}</li>
          ))}
        </ol>
        <p className="hero__example">{heroContent.example}</p>

        <div className="hero__actions">
          <Button size="lg" to="/catalogo">
            Ver las butacas
          </Button>
          <Button to="/contacto" tone="ghost">
            Pedir consejo
          </Button>
        </div>
      </div>

      {featuredProduct ? (
        <figure className="hero__figure">
          <Link aria-label={`Ver ${featuredProduct.name}`} className="hero__figure-link" to={`/producto/${featuredProduct.slug}`}>
            <ProductMedia className="hero__media" priority product={featuredProduct} />
          </Link>
          <figcaption className="hero__caption mono">
            <span>Nº {featuredProduct.number}</span>
            <span className="hero__caption-name">{featuredProduct.name}</span>
            <span>{formatCurrency(featuredProduct.price)}</span>
          </figcaption>
          <Stamp className="hero__stamp" />
        </figure>
      ) : null}
    </section>
  );
}

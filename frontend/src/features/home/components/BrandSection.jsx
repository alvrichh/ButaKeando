import { Badge } from '../../../components/common/Badge';
import { Icon } from '../../../components/common/Icon';
import { Card } from '../../../components/ui/Card';
import { brandHighlights } from '../homeData';

export function BrandSection() {
  return (
    <section aria-labelledby="brand-title" className="landing-section landing-section--brand" id="nosotros">
      <div className="landing-section__heading">
        <Badge tone="gold">Nuestra propuesta</Badge>
        <h2 id="brand-title">Comodidad y diseño, elegidos con el mismo cuidado.</h2>
        <p>
          Cada pieza se elige para ser acogedora al vivirla y bonita al mostrarla: una butaca que invita a quedarse y
          que eleva la estancia en la que la colocas.
        </p>
      </div>

      <div className="landing-value-grid">
        {brandHighlights.map((item) => (
          <Card key={item.title} className="landing-value-card">
            <span className="landing-value-card__icon">
              <Icon name={item.icon} size={22} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

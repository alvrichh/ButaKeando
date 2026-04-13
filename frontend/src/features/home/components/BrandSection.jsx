import { Badge } from '../../../components/common/Badge';
import { Card } from '../../../components/ui/Card';
import { brandHighlights } from '../homeData';

export function BrandSection() {
  return (
    <section className="landing-section landing-section--brand" id="nosotros">
      <div className="landing-section__heading">
        <Badge tone="gold">Nuestra propuesta</Badge>
        <h2>ButaKeando une butacas, sillones, comodidad y diseno en una presentacion limpia y elegante.</h2>
        <p>
          Queremos que cada pieza se perciba como una eleccion cuidada: acogedora para vivirla, estetica para mostrarla y
          versatil para crecer con la marca en futuras colecciones o escaparates digitales.
        </p>
      </div>

      <div className="landing-value-grid">
        {brandHighlights.map((item) => (
          <Card key={item.title} className="landing-value-card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

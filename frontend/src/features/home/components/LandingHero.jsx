import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/ui/Card';
import { brandMetrics, heroContent } from '../homeData';

export function LandingHero() {
  return (
    <section className="landing-hero" id="inicio">
      <div className="landing-hero__copy">
        <Badge tone="gold">{heroContent.badge}</Badge>
        <img alt="Logotipo ButaKeando" className="landing-hero__logo landing-hero__logo--inline" src={heroContent.logoTransparent} />
        <h1>{heroContent.title}</h1>
        <p>{heroContent.subtitle}</p>

        <div className="landing-hero__actions">
          <Button to={heroContent.primaryCta.to}>{heroContent.primaryCta.label}</Button>
          <Button to={heroContent.secondaryCta.to} tone="secondary">
            {heroContent.secondaryCta.label}
          </Button>
        </div>
      </div>

      <Card className="landing-hero__panel">
        <div className="landing-hero__panel-logo-wrap">
          <img alt="Logotipo ButaKeando version oscura" className="landing-hero__panel-logo" src={heroContent.logoDark} />
        </div>

        <p className="landing-hero__panel-text">
          Una marca pensada para transmitir confort, calidez y confianza desde la primera visita.
        </p>

        <div className="landing-hero__metrics">
          {brandMetrics.map((metric) => (
            <div key={metric.label} className="landing-hero__metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

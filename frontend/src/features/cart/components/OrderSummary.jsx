import { Icon } from '../../../components/common/Icon';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currency';

export function OrderSummary({ items, total, eyebrow = 'Resumen del pedido', children }) {
  return (
    <Card as="aside" className="shop-summary-card">
      <span className="shop-summary-card__eyebrow">{eyebrow}</span>

      <ul className="summary-list">
        {items.map((item) => (
          <li key={item.id} className="summary-list__row">
            <span>
              {item.name} <span className="summary-list__qty">x{item.quantity}</span>
            </span>
            <strong>{formatCurrency(item.price * item.quantity)}</strong>
          </li>
        ))}
        <li className="summary-list__row summary-list__row--muted">
          <span>Envío</span>
          <span>Se coordina contigo</span>
        </li>
      </ul>

      <div className="shop-summary-card__total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {children ? <div className="shop-summary-card__actions">{children}</div> : null}

      <p className="shop-summary-card__trust">
        <Icon name="shield" size={16} />
        Pago seguro procesado por Stripe
      </p>
    </Card>
  );
}

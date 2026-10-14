import { formatCurrency } from '../../../utils/currency';

// Styled like a shop receipt: ruled rows in mono, total in display type.
export function OrderSummary({ items, total, title = 'Resumen', children }) {
  return (
    <aside aria-label={title} className="order-summary">
      <span className="order-summary__title mono">{title}</span>

      <ul className="order-summary__list">
        {items.map((item) => (
          <li key={item.id} className="order-summary__row">
            <span>
              {item.name} <span className="order-summary__qty mono">x{item.quantity}</span>
            </span>
            <span className="mono">{formatCurrency(item.price * item.quantity)}</span>
          </li>
        ))}
        <li className="order-summary__row order-summary__row--muted">
          <span>Envío</span>
          <span className="mono">A coordinar</span>
        </li>
      </ul>

      <div className="order-summary__total">
        <span className="mono">Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {children ? <div className="order-summary__actions">{children}</div> : null}

      <p className="order-summary__note mono">Pago seguro con Stripe</p>
    </aside>
  );
}

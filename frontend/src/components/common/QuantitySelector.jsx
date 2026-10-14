import { Icon } from './Icon';

export function QuantitySelector({ value, onChange, min = 1, max = 10, label = 'Cantidad' }) {
  const safeValue = Math.min(max, Math.max(min, value));

  return (
    <div aria-label={label} className="quantity-selector" role="group">
      <button
        aria-label="Reducir cantidad"
        disabled={safeValue <= min}
        onClick={() => onChange(safeValue - 1)}
        type="button"
      >
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{safeValue}</output>
      <button
        aria-label="Aumentar cantidad"
        disabled={safeValue >= max}
        onClick={() => onChange(safeValue + 1)}
        type="button"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

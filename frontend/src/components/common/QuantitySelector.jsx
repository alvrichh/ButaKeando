export function QuantitySelector({ value, onChange, min = 1 }) {
  const safeValue = Math.max(min, value);

  return (
    <div className="quantity-selector">
      <button aria-label="Reducir cantidad" onClick={() => onChange(Math.max(min, safeValue - 1))} type="button">
        -
      </button>
      <span>{safeValue}</span>
      <button aria-label="Aumentar cantidad" onClick={() => onChange(safeValue + 1)} type="button">
        +
      </button>
    </div>
  );
}

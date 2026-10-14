export function ProductMedia({ product, className = '', priority = false, showName = false }) {
  const classes = ['product-media', className].filter(Boolean).join(' ');

  if (product.image) {
    return (
      <div className={classes}>
        <img
          alt={product.imageAlt}
          decoding="async"
          fetchpriority={priority ? 'high' : undefined}
          height="1700"
          loading={priority ? 'eager' : 'lazy'}
          src={product.image}
          width="1200"
        />
      </div>
    );
  }

  return (
    <div className={[classes, 'product-media--placeholder', `product-media--${product.tone}`].join(' ')} role="img" aria-label={product.imageAlt}>
      <span className="product-media__tag">{product.availability}</span>
      {showName ? <strong className="product-media__name">{product.name}</strong> : null}
    </div>
  );
}

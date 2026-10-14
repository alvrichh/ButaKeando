function ChairSketch() {
  return (
    <svg aria-hidden="true" className="product-media__sketch" fill="none" viewBox="0 0 200 220">
      <path d="M52 112V54c0-18 14-30 48-30s48 12 48 30v58" />
      <path d="M38 118c0-12 7-20 18-20s16 8 16 20v38M162 118c0-12-7-20-18-20s-16 8-16 20v38" />
      <path d="M72 128h56c8 0 14 6 14 14v14H58v-14c0-8 6-14 14-14z" />
      <path d="M38 118v40h124v-40" />
      <path d="M52 158l-8 40M148 158l8 40M70 158l-3 22M130 158l3 22" />
    </svg>
  );
}

export function ProductMedia({ product, className = '', priority = false }) {
  const classes = ['product-media', className].filter(Boolean).join(' ');

  if (product.image) {
    return (
      <div className={classes}>
        <img
          alt={product.imageAlt}
          decoding="async"
          fetchpriority={priority ? 'high' : undefined}
          height="1250"
          loading={priority ? 'eager' : 'lazy'}
          src={product.image}
          width="1000"
        />
      </div>
    );
  }

  return (
    <div aria-label={product.imageAlt} className={[classes, 'product-media--placeholder'].join(' ')} role="img">
      <ChairSketch />
      <span className="product-media__note mono">Foto en camino</span>
    </div>
  );
}

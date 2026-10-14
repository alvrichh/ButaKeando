// Round rubber-stamp mark, drawn as SVG so the text follows the circle.
export function Stamp({ className = '' }) {
  return (
    <svg aria-hidden="true" className={['stamp', className].filter(Boolean).join(' ')} viewBox="0 0 160 160">
      <defs>
        <path d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1 -116 0" id="stamp-circle" />
      </defs>
      <circle className="stamp__ring" cx="80" cy="80" r="74" />
      <circle className="stamp__ring" cx="80" cy="80" r="44" />
      <text className="stamp__text">
        <textPath href="#stamp-circle" textLength="364">
          BUTAKEANDO · SEVILLA · BUTACAS CON CARÁCTER ·
        </textPath>
      </text>
      <g className="stamp__chair">
        <path d="M68 78V64c0-5 4-8 12-8s12 3 12 8v14" />
        <path d="M62 80c0-3 2-5 5-5s4 2 4 5v8M98 80c0-3-2-5-5-5s-4 2-4 5v8M62 80v10h36V80M65 90l-2 9M95 90l2 9" />
      </g>
    </svg>
  );
}

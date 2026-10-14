import { marqueeWords } from '../homeData';

export function Marquee() {
  // Rendered twice so the CSS loop can translate by exactly half its width.
  const sequence = [...marqueeWords, ...marqueeWords];

  return (
    <div aria-hidden="true" className="marquee">
      <div className="marquee__track">
        {sequence.map((word, index) => (
          <span key={`${word}-${index}`} className="marquee__item">
            {word}
            <span className="marquee__sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

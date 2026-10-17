import { useEffect, useState } from 'react';
import './ScreenshotStack.css';

const AUTOPLAY_MS = 4500;

/**
 * Pilha de capturas de tela com carrossel próprio: a tela ativa fica à frente
 * e as demais atrás, menores e apagadas. Troca sozinha enquanto o card está
 * ativo, pausando com mouse ou foco, e não troca com movimento reduzido.
 */
function ScreenshotStack({ screens, active }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = screens.length;

  const goTo = (target) => setIndex((target + total) % total);

  useEffect(() => {
    if (!active || paused || total < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = setInterval(() => setIndex((current) => (current + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [active, paused, total]);

  const tabIndex = active ? 0 : -1;

  return (
    <div
      className="screens"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="screens__stack">
        {screens.map((screen, i) => (
          <img
            key={screen.src}
            className={i === index ? 'is-front' : undefined}
            src={screen.src}
            alt={screen.alt}
            width="1000"
            height="491"
            loading="lazy"
          />
        ))}
      </div>

      <div className="screens__controls">
        <button
          type="button"
          className="screens__btn"
          aria-label="Imagem anterior"
          tabIndex={tabIndex}
          onClick={() => goTo(index - 1)}
        >
          ←
        </button>
        <div className="screens__dots">
          {screens.map((screen, i) => (
            <button
              type="button"
              key={screen.src}
              className="screens__dot"
              aria-label={`Ir para a imagem ${i + 1}`}
              aria-current={i === index}
              tabIndex={tabIndex}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="screens__btn"
          aria-label="Próxima imagem"
          tabIndex={tabIndex}
          onClick={() => goTo(index + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default ScreenshotStack;

import { useState } from 'react';
import Icon from '../Icon/Icon';
import './ScreenshotStack.css';

/**
 * Capturas numa roda vertical em 3D (referência: "carousel 1"): a tela
 * ativa fica plana ao centro e as vizinhas inclinadas acima e abaixo.
 * Só gira quando a pessoa pede (sem autoplay fora do hero).
 */
function ScreenshotStack({ screens, active }) {
  // dir: de onde a próxima tela vem (-1 = a anterior subiu, 1 = desceu)
  const [{ index, dir }, setState] = useState({ index: 0, dir: -1 });
  const total = screens.length;

  const goTo = (target, nextDir) =>
    setState({ index: (target + total) % total, dir: nextDir });

  // posição de cada tela na roda: 0 ao centro, -1 acima, 1 abaixo
  const offsetOf = (i) => {
    if (i === index) return 0;
    if (total === 2) return dir > 0 ? -1 : 1;
    let o = (i - index + total) % total;
    if (o > total / 2) o -= total;
    return o;
  };

  const tabIndex = active ? 0 : -1;

  return (
    <div className="screens">
      <div className="screens__wheel">
        {screens.map((screen, i) => (
          <img
            key={screen.src}
            className={`project__wheel-item${i === index ? ' is-front' : ''}`}
            data-offset={Math.max(-2, Math.min(2, offsetOf(i)))}
            src={screen.src}
            alt={screen.alt}
            aria-hidden={i !== index}
            width="1000"
            height="491"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      {total > 1 && (
        <div className="screens__controls">
          <button
            type="button"
            className="screens__btn"
            aria-label="Imagem anterior"
            tabIndex={tabIndex}
            onClick={() => goTo(index - 1, -1)}
          >
            <Icon name="arrow-up" size={16} />
          </button>
          <p className="screens__count data" aria-live="polite">
            {index + 1}/{total}
          </p>
          <button
            type="button"
            className="screens__btn"
            aria-label="Próxima imagem"
            tabIndex={tabIndex}
            onClick={() => goTo(index + 1, 1)}
          >
            <Icon name="arrow-down" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ScreenshotStack;

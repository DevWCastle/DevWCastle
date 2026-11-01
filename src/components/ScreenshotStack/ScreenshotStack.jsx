import { useState } from 'react';
import Icon from '../Icon/Icon';
import './ScreenshotStack.css';

/**
 * Pilha de capturas de tela com carrossel próprio: a tela ativa fica à frente
 * e as demais atrás, menores e apagadas. Só troca quando a pessoa pede
 * (sem autoplay: nada se move sozinho fora do hero).
 */
function ScreenshotStack({ screens, active }) {
  const [index, setIndex] = useState(0);
  const total = screens.length;

  const goTo = (target) => setIndex((target + total) % total);

  const tabIndex = active ? 0 : -1;

  return (
    <div className="screens">
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
          <Icon name="arrow-left" size={16} />
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
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
}

export default ScreenshotStack;

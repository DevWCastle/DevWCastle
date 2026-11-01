import { useEffect, useRef, useState } from 'react';
import { stackLayers } from '../../data/site';
import './TechStack.css';

const ROW = 140; // altura de cada camada no SVG empilhado (viewBox 360 x 840)
const pad = (n) => String(n).padStart(2, '0');

/* Formas em traço fino, uma por camada, numa caixa de 360 x 120 */
function LayerShape({ kind }) {
  switch (kind) {
    case 'signal':
      return (
        <>
          <path pathLength="1" d="M60 85H100V40H140V85H180V40H220V85H260V40H300" />
          <circle pathLength="1" cx="60" cy="85" r="3.5" />
        </>
      );
    case 'chip':
      return (
        <>
          <path pathLength="1" d="M135 25H225V100H135Z" />
          <path pathLength="1" d="M160 47H200V78H160Z" />
          <path pathLength="1" d="M113 38H135M113 54H135M113 70H135M113 86H135M225 38H247M225 54H247M225 70H247M225 86H247" />
        </>
      );
    case 'cube':
      return (
        <>
          <path pathLength="1" d="M140 45H205V105H140Z" />
          <path pathLength="1" d="M168 22H233V82H168Z" />
          <path pathLength="1" d="M140 45L168 22M205 45L233 22M205 105L233 82M140 105L168 82" />
        </>
      );
    case 'cylinder':
      return (
        <>
          <ellipse pathLength="1" cx="180" cy="32" rx="52" ry="13" />
          <path pathLength="1" d="M128 32V92A52 13 0 0 0 232 92V32" />
          <path pathLength="1" d="M128 62A52 13 0 0 0 232 62" />
        </>
      );
    case 'window':
      return (
        <>
          <path pathLength="1" d="M118 22H242V106H118Z" />
          <path pathLength="1" d="M118 40H242" />
          <path pathLength="1" d="M134 60H206M134 74H190M134 88H214" />
        </>
      );
    case 'container':
    default:
      return (
        <>
          <path pathLength="1" d="M122 16H238V112H122Z" />
          <path pathLength="1" d="M154 42H206V86H154Z" />
          <path pathLength="1" d="M122 16L154 42M238 16L206 42M238 112L206 86M122 112L154 86" />
        </>
      );
  }
}

/**
 * Stack como diagrama em camadas "do chão de fábrica ao deploy".
 * Cada etapa do texto, ao cruzar o meio da tela, desenha a sua camada.
 */
export default function TechStack() {
  const [active, setActive] = useState(-1);
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: '-42% 0px -42% 0px' }
    );

    stepsRef.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const layerClass = (i) =>
    `stack__layer${i <= active ? ' is-drawn' : ''}${i === active ? ' is-current' : ''}`;

  return (
    <section className="section section--deep stack" id="stack" aria-labelledby="stack-title">
      <div className="w">
        <header className="stack__head">
          <h2 className="section__title rv" id="stack-title">
            Do chão de fábrica <em>ao deploy</em>
          </h2>
          <p className="stack__intro rv" style={{ '--d': '120ms' }}>
            As ferramentas que uso no dia a dia, na ordem em que um dado atravessa o sistema.
          </p>
        </header>

        <div className="stack__body">
          <div className="stack__diagram" aria-hidden="true">
            <svg viewBox={`0 0 360 ${ROW * stackLayers.length}`}>
              {stackLayers.map((layer, i) => (
                <g key={layer.id} className={layerClass(i)} transform={`translate(0 ${i * ROW})`}>
                  <g className="stack__ghost">
                    <LayerShape kind={layer.shape} />
                  </g>
                  <g className="stack__live">
                    <LayerShape kind={layer.shape} />
                    {i < stackLayers.length - 1 && <path pathLength="1" d={`M180 116V${ROW + 14}`} />}
                  </g>
                  <text x="14" y="66" className="stack__label">{pad(i + 1)}</text>
                </g>
              ))}
            </svg>
          </div>

          <ol className="stack__steps">
            {stackLayers.map((layer, i) => (
              <li
                key={layer.id}
                ref={(node) => { stepsRef.current[i] = node; }}
                data-index={i}
                className={`stack__step${i === active ? ' is-current' : ''}`}
              >
                <svg className={`stack__mini ${layerClass(i)}`} viewBox="0 0 360 124" aria-hidden="true">
                  <g className="stack__ghost">
                    <LayerShape kind={layer.shape} />
                  </g>
                  <g className="stack__live">
                    <LayerShape kind={layer.shape} />
                  </g>
                </svg>

                <p className="stack__num data rv">{pad(i + 1)} / {pad(stackLayers.length)}</p>
                <h3 className="stack__title rv" style={{ '--d': '80ms' }}>{layer.title}</h3>
                <p className="stack__line rv" style={{ '--d': '160ms' }}>{layer.line}</p>
                <ul className="stack__tech rv" style={{ '--d': '240ms' }} aria-label={`Tecnologias: ${layer.title}`}>
                  {layer.tech.map((tech) => (
                    <li key={tech} className="data">{tech}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

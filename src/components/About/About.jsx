import { useEffect, useRef } from 'react';
import portrait from '../../assets/images/pessoa.webp';
import './About.css';

/*
 * Números conferidos: 31 repositórios públicos (API do GitHub, nov/2026;
 * o site antigo dizia 3) e 17 tecnologias (as listadas na Stack).
 */
const FACTS = [
  { value: 31, label: 'repositórios públicos no GitHub' },
  { value: 17, label: 'tecnologias na stack' },
  { value: 2, label: 'áreas: indústria e software' },
];

const PATH = [
  { title: 'Chão de fábrica', text: 'Manutenção industrial.' },
  { title: 'Eletroeletrônica', text: 'Laboratório e circuitos.' },
  { title: 'Software', text: 'APIs, SQL e React.' },
];

/** Conta de 0 até o valor real uma única vez, quando a lista entra na tela. */
function useCountUp(listRef) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const numbers = [...list.querySelectorAll('[data-count]')];
    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 900, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        numbers.forEach((el) => {
          el.textContent = String(Math.round(Number(el.dataset.count) * eased));
        });
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });

    observer.observe(list);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [listRef]);
}

export default function About() {
  const factsRef = useRef(null);
  useCountUp(factsRef);

  return (
    <section className="section section--white about" id="sobre" aria-labelledby="sobre-title">
      <div className="w about__grid">
        <figure className="about__photo cut rv">
          <img src={portrait} alt="Retrato de DevWCastle" width="1086" height="1439" loading="lazy" decoding="async" />
        </figure>

        <div className="about__text">
          <h2 className="section__title rv" id="sobre-title" style={{ '--d': '80ms' }}>
            Falhas <em>custam caro</em>
          </h2>

          <p className="about__body rv" style={{ '--d': '160ms' }}>
            Minha trajetória começou no chão de fábrica e nos laboratórios de eletroeletrônica.
            Lá, aprendi que falhas custam caro. Trouxe essa mentalidade para APIs REST com
            Node.js/NestJS, modelagem SQL e interfaces em React.
          </p>

          <ol className="about__path rv" style={{ '--d': '240ms' }} aria-label="Trajetória">
            {PATH.map((stop) => (
              <li key={stop.title}>
                <strong>{stop.title}</strong>
                <span>{stop.text}</span>
              </li>
            ))}
          </ol>

          <dl className="about__facts rv" style={{ '--d': '320ms' }} ref={factsRef}>
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd data-count={fact.value}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

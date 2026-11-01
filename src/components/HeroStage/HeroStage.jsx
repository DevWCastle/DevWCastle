import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import wordmark from '../../assets/dwc-wordmark-520.webp';
import Icon from '../Icon/Icon';
import { useHeroMotion } from '../../hooks/useHeroMotion';
import { sections } from '../../data/site';
import './HeroStage.css';

// Efeitos de canvas do hero, todos carregados sob demanda.
const HeroPortrait = lazy(() => import('../HeroPortrait/HeroPortrait'));
const TubesCursor = lazy(() => import('../TubesCursor/TubesCursor'));
const ShatterTitle = lazy(() => import('../ShatterTitle/ShatterTitle'));

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SHATTER_TIMEOUT_MS = 2500; // se os cacos não ficarem prontos, o título volta ao CSS

const RENDER_MODES = [
  { id: 'dots', label: 'Pontos' },
  { id: 'pixels', label: 'Pixels' },
  { id: 'lines', label: 'Linhas' },
];

/* ---------- Hora de Brasília ---------- */
const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

function LocalTime() {
  const [time, setTime] = useState(() => timeFormatter.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(timeFormatter.format(new Date())), 30000);
    return () => clearInterval(id);
  }, []);

  return <time className="hero__time">{time}</time>;
}

/* ---------- Título: "código" nasce em mono; o resto se monta em cacos ---------- */
const CODE_WORD = 'código';

function HeroTitle({ ready, trackRef }) {
  const titleRef = useRef(null);
  const [built, setBuilt] = useState(false);
  // Com movimento reduzido, o título fica só no CSS (sem canvas de cacos)
  const [shatter, setShatter] = useState(() => !prefersReducedMotion());
  const [shatterReady, setShatterReady] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    const id = setTimeout(() => setBuilt(true), prefersReducedMotion() ? 0 : 520);
    return () => clearTimeout(id);
  }, [ready]);

  // Rede de segurança: o texto nunca fica invisível se o canvas falhar
  useEffect(() => {
    if (!built || !shatter || shatterReady) return undefined;
    const id = setTimeout(() => setShatter(false), SHATTER_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [built, shatter, shatterReady]);

  return (
    <h1
      ref={titleRef}
      className={`hero__title${built ? ' is-built' : ''}${shatter ? ' has-shatter' : ''}`}
      id="hero-title"
      aria-label="Do código ao impacto real"
    >
      <span className="hero__line" aria-hidden="true">
        Do{' '}
        <span className="hero__code">
          {Array.from(CODE_WORD).map((char, i) => (
            <span className="hero__glyph" style={{ '--i': i }} key={char + i}>
              <span className="hero__glyph-code">{char}</span>
              <span className="hero__glyph-built">{char}</span>
            </span>
          ))}
          <span className="hero__caret" />
        </span>
      </span>
      <span className="hero__line hero__line--impact" aria-hidden="true">
        <span className="hero__reveal">
          ao <em>impacto real</em>
        </span>
      </span>
      {shatter && (
        <Suspense fallback={null}>
          <ShatterTitle
            titleRef={titleRef}
            trackRef={trackRef}
            play={built}
            onReady={() => setShatterReady(true)}
          />
        </Suspense>
      )}
    </h1>
  );
}

/* ---------- Hero ---------- */
export default function HeroStage({ ready = true }) {
  const heroRef = useRef(null);
  const [mode, setMode] = useState('dots');
  const [motionOk] = useState(() => !prefersReducedMotion());
  useHeroMotion(heroRef);

  return (
    <section className="hero" id="inicio" ref={heroRef} aria-labelledby="hero-title">
      {motionOk && ready && (
        <Suspense fallback={null}>
          <TubesCursor trackRef={heroRef} />
        </Suspense>
      )}

      <header className="hero__top">
        <a className="hero__logo" href="#inicio" aria-label="DevWCastle — início">
          <img src={wordmark} alt="" width="520" height="115" fetchPriority="high" />
        </a>

        <dl className="hero__meta">
          <div>
            <dt>Atualmente</dt>
            <dd>Desenvolvedor Full Stack · Backend</dd>
          </div>
          <div>
            {/* <dt>Base</dt>
            <dd>
              Brasil · <LocalTime /> <abbr title="Horário de Brasília">BRT</abbr>
            </dd> */}
          </div>
          <div className="hero__meta-nav">
            <dt>Navegação</dt>
            <dd>
              <nav aria-label="Seções">
                {sections.map((section, i) => (
                  <span key={section.id}>
                    <a href={`#${section.id}`}>{section.label}</a>
                    {i < sections.length - 1 && ', '}
                  </span>
                ))}
              </nav>
            </dd>
          </div>
        </dl>

        <a className="btn btn--outline hero__cta" href="#contato">
          Fale comigo
          <Icon name="arrow-up-right" size={16} />
        </a>
      </header>

      <div className="hero__portrait" role="img" aria-label="Retrato de DevWCastle desenhado em pontos azuis">
        <Suspense fallback={null}>
          <HeroPortrait mode={mode} play={ready} trackRef={heroRef} />
        </Suspense>
      </div>

      <div className="hero__intro">
        <p className="hero__lead">
          Da manutenção industrial ao backend: sistemas que precisam funcionar sob pressão,
          com máxima previsibilidade.
        </p>
        <a className="btn btn--primary" href="#projetos">
          Ver projetos
          <Icon name="arrow-down" size={16} />
        </a>
      </div>

      <div className="hero__modes" role="group" aria-label="Desenho do retrato">
        {RENDER_MODES.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={mode === item.id}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <HeroTitle ready={ready} trackRef={heroRef} />
    </section>
  );
}

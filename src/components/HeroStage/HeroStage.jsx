import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import wordmark from '../../assets/dwc-wordmark-520.webp';
import Icon from '../Icon/Icon';
import { useHeroMotion } from '../../hooks/useHeroMotion';
import { sections } from '../../data/site';
import './HeroStage.css';

// Efeitos de canvas do hero, todos carregados sob demanda.
const HeroPortrait = lazy(() => import('../HeroPortrait/HeroPortrait'));
const TubesCursor = lazy(() => import('../TubesCursor/TubesCursor'));
const SelectTitle = lazy(() => import('../SelectTitle/SelectTitle'));
const TesseractEmblem = lazy(() => import('../TesseractEmblem/TesseractEmblem'));
const CircuitField = lazy(() => import('../CircuitField/CircuitField'));

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CANVAS_TIMEOUT_MS = 2500; // se o canvas não ficar pronto, o título volta ao CSS

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

/* ---------- Título: letras selecionáveis, como num editor de design ---------- */
// cada linha sobe por trás de um corte; o destaque azul vai em "impacto real"
const TITLE_LINES = [
  <>Do código</>,
  <>ao <em>impacto real</em></>,
];

function HeroTitle({ ready, trackRef }) {
  const titleRef = useRef(null);
  const [built, setBuilt] = useState(false);
  // Com movimento reduzido, o título fica só no CSS (sem canvas)
  const [canvasTitle, setCanvasTitle] = useState(() => !prefersReducedMotion());
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    const id = setTimeout(() => setBuilt(true), prefersReducedMotion() ? 0 : 520);
    return () => clearTimeout(id);
  }, [ready]);

  // Rede de segurança: o texto nunca fica invisível se o canvas falhar
  useEffect(() => {
    if (!built || !canvasTitle || canvasReady) return undefined;
    const id = setTimeout(() => setCanvasTitle(false), CANVAS_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [built, canvasTitle, canvasReady]);

  return (
    <h1
      ref={titleRef}
      className={`hero__title${built ? ' is-built' : ''}${canvasTitle ? ' has-canvas' : ''}`}
      id="hero-title"
      aria-label="Do código ao impacto real"
    >
      {TITLE_LINES.map((line, i) => (
        <span className="hero__line" aria-hidden="true" key={i}>
          <span className="hero__reveal" style={{ '--i': i }}>{line}</span>
        </span>
      ))}
      {canvasTitle && (
        <Suspense fallback={null}>
          <SelectTitle
            titleRef={titleRef}
            trackRef={trackRef}
            play={built}
            onReady={() => setCanvasReady(true)}
          />
        </Suspense>
      )}
    </h1>
  );
}

/* ---------- Hero ---------- */
export default function HeroStage({ ready = true }) {
  const heroRef = useRef(null);
  const emblemRef = useRef(null);
  const [mode, setMode] = useState('dots');
  const [motionOk] = useState(() => !prefersReducedMotion());
  useHeroMotion(heroRef);

  return (
    <section className="hero" id="inicio" ref={heroRef} aria-labelledby="hero-title">
      {motionOk && ready && (
        <Suspense fallback={null}>
           <a className="btn btn--primary hero__projects" href="#projetos">
            Ver projetos
          <Icon name="arrow-down" size={16} />
        </a>
          {/* <TubesCursor trackRef={heroRef} /> */}
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

      {/* placa de circuitos com profundidade atrás do tesseract */}
      <Suspense fallback={null}>
        <CircuitField play={ready} trackRef={heroRef} anchorRef={emblemRef} />
      </Suspense>

      <div className="hero__portrait" role="img" aria-label="Retrato de DevWCastle desenhado em pontos azuis">
        <Suspense fallback={null}>
          <HeroPortrait mode={mode} play={ready} trackRef={heroRef} />
        </Suspense>
      </div>

      {/* assinatura: ícone em tesseract, nome e o CTA logo abaixo */}
      <div className={`hero__brand${ready ? ' is-on' : ''}`}>
        <div className="hero__emblem" ref={emblemRef} role="img" aria-label="Logo DevWCastle: um cubo de circuitos que se desdobra em tesseract">
           {/* <span className="hero__brand-name" aria-hidden="true">DevWCastle</span> */}
          <Suspense fallback={null}>
            <TesseractEmblem play={ready} trackRef={heroRef} />
          </Suspense>
         
        </div>
       
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

      {/* nome da marca logo acima do título, no mesmo eixo esquerdo */}
      <div className={`hero__heading${ready ? ' is-on' : ''}`}>
        <p className="hero__kicker">DevWCastle</p>
        <HeroTitle ready={ready} trackRef={heroRef} />
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/dwc-logo-360.webp';
import { INTRO_SESSION_KEY } from './intro';
import './Preloader.css';

const COUNT_MS = 950;       // contador 000 → 100
const HOLD_MAX_MS = 450;    // espera extra máxima pelas fontes
const EXIT_MS = 480;        // cortina subindo para o hero

/* Fitas de luz: saem dispersas e se organizam num feixe (viewBox 1000 x 600) */
const STRANDS = [
  'M70 560C260 520 380 420 470 330S690 120 940 70',
  'M90 585C280 530 400 440 485 345S700 150 950 105',
  'M60 530C250 505 365 400 455 315S680 95 925 40',
  'M110 600C300 545 420 455 500 360S715 175 960 140',
  'M50 500C240 488 350 385 440 300S668 72 905 14',
];

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function Preloader({ onDone }) {
  const [phase, setPhase] = useState('count'); // count → reveal → exit
  const countRef = useRef(null);
  const barRef = useRef(null);
  const finishRef = useRef(() => {});
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      /* sessionStorage indisponível: a intro só toca uma vez neste carregamento */
    }

    const root = document.documentElement;
    root.classList.add('is-intro');

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      root.classList.remove('is-intro');
      setPhase('exit');
      onDoneRef.current?.();
    };
    finishRef.current = finish;

    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    let frame = 0;
    let revealTimer = 0;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      // O contador só passa de 92 quando as fontes chegaram (ou o tempo de espera acabou).
      const gate = fontsReady || elapsed > COUNT_MS + HOLD_MAX_MS ? 100 : 92;
      const value = Math.min(gate, Math.round(easeOut(Math.min(elapsed / COUNT_MS, 1)) * 100));

      if (countRef.current) countRef.current.textContent = String(value).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;

      if (value >= 100) {
        setPhase('reveal');
        revealTimer = window.setTimeout(() => finish(), 420);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const onKey = (event) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(revealTimer);
      window.removeEventListener('keydown', onKey);
      root.classList.remove('is-intro');
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      className={`intro intro--${phase}`}
      onAnimationEnd={(event) => {
        if (event.animationName === 'introExit') setPhase('gone');
      }}
      style={{ '--exit-ms': `${EXIT_MS}ms` }}
    >
      <svg className="intro__ribbon" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="introRibbon" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0031f9" stopOpacity="0" />
            <stop offset="0.35" stopColor="#0031f9" />
            <stop offset="0.75" stopColor="#4a74ff" />
            <stop offset="1" stopColor="#00c6fc" />
          </linearGradient>
          <filter id="introGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g className="intro__glow" filter="url(#introGlow)">
          {STRANDS.map((d) => (
            <path key={d} d={d} pathLength="1" />
          ))}
        </g>
        <g className="intro__strands">
          {STRANDS.map((d, i) => (
            <path key={d} d={d} pathLength="1" style={{ '--i': i }} />
          ))}
        </g>
      </svg>

      <div className="intro__mark">
        <img src={logo} alt="" width="360" height="360" />
        <p className="intro__name">DevWCastle</p>
      </div>

      <div className="intro__counter" aria-hidden="true">
        <span className="intro__count">
          <span ref={countRef}>000</span>
          <sup>%</sup>
        </span>
        <span className="intro__bar">
          <span ref={barRef} />
        </span>
      </div>

      <button type="button" className="intro__skip" onClick={() => finishRef.current()}>
        Pular intro
      </button>
    </div>
  );
}

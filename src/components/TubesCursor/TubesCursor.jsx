import { useEffect, useRef } from 'react';
import './TubesCursor.css';

/*
 * Paletas em tons do azul de marca. O clique no hero alterna entre elas
 * (o original sorteia cores aleatórias; aqui ficamos dentro da identidade).
 */
const PALETTES = [
  ['#0031f9', '#4a74ff', '#00c6fc'],
  ['#0024b8', '#86a2ff', '#4a74ff'],
  ['#00c6fc', '#0031f9', '#d9e2ff'],
];

const TUBES = 3;
const POINTS_FINE = 44;
const POINTS_TOUCH = 30;
const IDLE_MS = 1400; // sem mouse por esse tempo: os tubos passeiam sozinhos
const NIGHT = [2, 7, 22];        // fundo do hero (--night)
const HIGHLIGHT = [235, 241, 255]; // reflexo do tubo

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Tubos de luz que seguem o cursor (inspirado no "tubes cursor" de
 * threejs-components), desenhados em canvas 2D: cada tubo é uma corrente
 * de pontos que persegue o anterior; o traço afina e esmaece até a cauda,
 * com halo e reflexo para parecer um tubo iluminado.
 *  - toque: os tubos passeiam sozinhos, com menos pontos;
 *  - o laço para fora da tela, com a aba oculta ou com o hero coberto.
 * Não é montado com prefers-reduced-motion (HeroStage decide).
 */
export default function TubesCursor({ trackRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef?.current;
    if (!canvas || !track) return undefined;

    const ctx = canvas.getContext('2d');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const count = finePointer ? POINTS_FINE : POINTS_TOUCH;

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      target: { x: 0, y: 0 },
      head: { x: 0, y: 0 },
      lastMove: -Infinity,
      visible: true,
      palette: 0,
      colors: PALETTES[0].map(hexToRgb),
      frame: 0,
    };

    // Cada tubo: corrente de pontos + fase própria para não se sobreporem
    const tubes = Array.from({ length: TUBES }, (_, t) => ({
      phase: (t / TUBES) * Math.PI * 2,
      follow: 0.34 + t * 0.05,
      points: Array.from({ length: count }, () => ({ x: 0, y: 0 })),
    }));

    const resize = () => {
      const rect = track.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.round(rect.width * state.dpr);
      canvas.height = Math.round(rect.height * state.dpr);
    };

    const placeAll = (x, y) => {
      state.head.x = x;
      state.head.y = y;
      tubes.forEach((tube) => tube.points.forEach((p) => { p.x = x; p.y = y; }));
    };

    resize();
    placeAll(state.width * 0.62, state.height * 0.45);

    /* Trajeto ocioso: uma curva de Lissajous lenta sobre a metade direita */
    const idleTarget = (time) => {
      const t = time / 1000;
      return {
        x: state.width * (0.62 + 0.24 * Math.sin(t * 0.55)),
        y: state.height * (0.46 + 0.26 * Math.sin(t * 0.83 + 1.2)),
      };
    };

    const covered = () => track.classList.contains('is-covered');

    // mistura opaca com o azul-noite do fundo: sem alfa, as emendas dos
    // segmentos não se somam (o alfa criava "contas" ao longo do tubo)
    const mix = (from, to, k) =>
      `rgb(${Math.round(from[0] + (to[0] - from[0]) * k)},${Math.round(from[1] + (to[1] - from[1]) * k)},${Math.round(from[2] + (to[2] - from[2]) * k)})`;

    const drawTube = (tube, rgb, width) => {
      const pts = tube.points;
      const [r, g, b] = rgb;
      const n = pts.length;

      // halo (aditivo, bem fraco), corpo e reflexo, da cauda para a cabeça
      for (let pass = 0; pass < 3; pass += 1) {
        ctx.globalCompositeOperation = pass === 0 ? 'lighter' : 'source-over';
        for (let i = n - 1; i > 0; i -= 1) {
          const a = pts[i];
          const c = pts[i - 1];
          const k = 1 - i / n; // 1 na cabeça, 0 na cauda
          const w = width * (0.25 + 0.75 * Math.pow(k, 0.7));

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);

          if (pass === 0) {
            ctx.lineWidth = w * 2.8;
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.06 * k})`;
          } else if (pass === 1) {
            ctx.lineWidth = w;
            ctx.strokeStyle = mix(NIGHT, rgb, 0.9 * Math.pow(k, 0.6));
          } else {
            ctx.lineWidth = w * 0.28;
            ctx.strokeStyle = mix(rgb, HIGHLIGHT, 0.75 * Math.pow(k, 1.2));
          }
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'lighter';

      // luz na ponta
      const head = pts[0];
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, width * 4);
      glow.addColorStop(0, `rgba(${r},${g},${b},0.45)`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(head.x - width * 4, head.y - width * 4, width * 8, width * 8);
    };

    const loop = (time) => {
      state.frame = 0;
      if (!state.visible || document.hidden || covered()) return;

      const idle = !finePointer || time - state.lastMove > IDLE_MS;
      const goal = idle ? idleTarget(time) : state.target;
      const ease = idle ? 0.04 : 0.22;
      state.head.x += (goal.x - state.head.x) * ease;
      state.head.y += (goal.y - state.head.y) * ease;

      // cores da paleta atual, com transição suave entre paletas
      const targetColors = PALETTES[state.palette].map(hexToRgb);
      state.colors = state.colors.map((rgb, i) => rgb.map((v, j) => v + (targetColors[i][j] - v) * 0.08));

      tubes.forEach((tube, t) => {
        const orbit = 10 + t * 6;
        const pts = tube.points;
        pts[0].x = state.head.x + Math.cos(time / 380 + tube.phase) * orbit;
        pts[0].y = state.head.y + Math.sin(time / 420 + tube.phase) * orbit;
        for (let i = 1; i < pts.length; i += 1) {
          pts[i].x += (pts[i - 1].x - pts[i].x) * tube.follow;
          pts[i].y += (pts[i - 1].y - pts[i].y) * tube.follow;
        }
      });

      const width = state.width < 720 ? 8 : 13;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'lighter';
      tubes.forEach((tube, t) => drawTube(tube, state.colors[t].map(Math.round), width));
      ctx.globalCompositeOperation = 'source-over';

      request();
    };

    const request = () => {
      if (!state.frame) state.frame = requestAnimationFrame(loop);
    };

    /* ---------- Eventos ---------- */
    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      state.target.x = event.clientX - rect.left;
      state.target.y = event.clientY - rect.top;
      state.lastMove = performance.now();
    };

    const onClick = (event) => {
      // links, botões e campos mantêm o próprio clique
      if (event.target.closest('a, button, input, textarea, select')) return;
      state.palette = (state.palette + 1) % PALETTES.length;
    };

    const resizeObserver = new ResizeObserver(() => resize());
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      request();
    });
    const onWake = () => request();

    resizeObserver.observe(track);
    visibilityObserver.observe(track);
    if (finePointer) track.addEventListener('pointermove', onPointerMove, { passive: true });
    track.addEventListener('click', onClick);
    window.addEventListener('scroll', onWake, { passive: true });
    document.addEventListener('visibilitychange', onWake);
    request();

    return () => {
      cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onWake);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [trackRef]);

  return <canvas ref={canvasRef} className="tubes" aria-hidden="true" />;
}

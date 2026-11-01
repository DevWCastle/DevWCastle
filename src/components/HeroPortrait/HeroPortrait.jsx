import { useEffect, useRef } from 'react';
import portraitSrc from '../../assets/images/pessoa.webp';
import './HeroPortrait.css';

/* Tons do azul de marca, do mais escuro ao mais claro (um Path2D por tom) */
const PALETTE = ['#0a24a3', '#0031f9', '#3a68ff', '#86a2ff', '#d9e2ff'];

const STEP_FINE = 7;        // px entre pontos com mouse
const STEP_TOUCH = 6;       // telas de toque: grade estática
const REPEL_RADIUS = 120;   // raio de influência do cursor
const REPEL_PUSH = 12;      // deslocamento máximo dos pontos
const REVEAL_RADIUS = 130;  // raio onde a foto real aparece
const INTRO_MS = 1300;      // varredura de entrada, de cima para baixo
const INTRO_END = 1.62;     // maior atraso (~0.7) + duração de cada célula (0.55), com folga

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Retrato feito de pontos azuis (canvas 2D, sem biblioteca).
 *  - `mode`: 'dots' | 'pixels' | 'lines' — muda só o desenho de cada célula;
 *  - perto do cursor os pontos se afastam e a foto nítida aparece;
 *  - o laço de animação só roda enquanto há algo mudando e para fora da tela;
 *  - toque ou movimento reduzido: desenho estático, sem listeners de ponteiro.
 */
export default function HeroPortrait({ mode = 'dots', play = true, trackRef }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const interactive = finePointer && !reduceMotion;

    const img = new Image();
    img.decoding = 'async';
    img.src = portraitSrc;

    const revealCanvas = document.createElement('canvas');
    const revealCtx = revealCanvas.getContext('2d');

    const state = {
      ready: false,
      visible: true,
      mode: 'dots',
      width: 0,
      height: 0,
      dpr: 1,
      fit: { x: 0, y: 0, w: 0, h: 0 },
      step: interactive ? STEP_FINE : STEP_TOUCH,
      xs: new Float32Array(0),
      ys: new Float32Array(0),
      vs: new Float32Array(0),
      delays: new Float32Array(0),
      count: 0,
      introStart: null,
      introDone: !interactive,
      inside: false,
      target: { x: 0, y: 0 },
      cursor: { x: 0, y: 0 },
      reveal: 0,
      frame: 0,
    };

    /* ---------- Grade: amostra a foto (com alfa real) célula a célula ---------- */
    const build = () => {
      const rect = wrap.getBoundingClientRect();
      state.width = Math.max(1, Math.round(rect.width));
      state.height = Math.max(1, Math.round(rect.height));
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);
      revealCanvas.width = canvas.width;
      revealCanvas.height = canvas.height;

      // Foto inteira visível, centrada e apoiada na base
      const scale = Math.min(state.width / img.naturalWidth, state.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      state.fit = { x: (state.width - w) / 2, y: state.height - h, w, h };

      const step = state.step;
      const cols = Math.max(1, Math.floor(w / step));
      const rows = Math.max(1, Math.floor(h / step));

      const sample = document.createElement('canvas');
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext('2d', { willReadFrequently: true });
      sctx.imageSmoothingQuality = 'high';
      sctx.drawImage(img, 0, 0, cols, rows);
      const { data } = sctx.getImageData(0, 0, cols, rows);

      const xs = [];
      const ys = [];
      const vs = [];
      const delays = [];
      const offsetX = state.fit.x + (w - cols * step) / 2 + step / 2;
      const offsetY = state.fit.y + (h - rows * step) / 2 + step / 2;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const i = (row * cols + col) * 4;
          const alpha = data[i + 3] / 255;
          if (alpha < 0.1) continue;
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          xs.push(offsetX + col * step);
          ys.push(offsetY + row * step);
          vs.push(alpha * (0.16 + 0.84 * Math.pow(lum, 0.8)));
          // varredura de cima para baixo com um pouco de ruído
          delays.push((row / rows) * 0.62 + ((col * 7 + row * 13) % 10) * 0.008);
        }
      }

      state.xs = Float32Array.from(xs);
      state.ys = Float32Array.from(ys);
      state.vs = Float32Array.from(vs);
      state.delays = Float32Array.from(delays);
      state.count = xs.length;
    };

    /* ---------- Desenho ---------- */
    const draw = (now) => {
      const { dpr, step, count, xs, ys, vs, delays } = state;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);

      // introT vai de 0 a INTRO_END; cada célula entra quando passa do seu atraso
      const introT = state.introDone
        ? INTRO_END
        : clamp01((now - (state.introStart ?? now)) / INTRO_MS) * INTRO_END;

      const paths = PALETTE.map(() => new Path2D());
      const cx = state.cursor.x;
      const cy = state.cursor.y;
      const influence = state.reveal; // 0 → 1 quando o cursor entra
      const r2 = REPEL_RADIUS * REPEL_RADIUS;
      const half = step / 2;

      for (let i = 0; i < count; i += 1) {
        let v = vs[i];
        if (introT < INTRO_END) {
          const local = clamp01((introT - delays[i]) / 0.55);
          if (local <= 0) continue;
          v *= easeOut(local);
        }

        let x = xs[i];
        let y = ys[i];

        if (influence > 0.001) {
          const dx = x - cx;
          const dy = y - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / REPEL_RADIUS) ** 2 * influence;
            x += (dx / d) * f * REPEL_PUSH;
            y += (dy / d) * f * REPEL_PUSH;
            v = Math.min(1, v + f * 0.35);
          }
        }

        const tone = Math.min(PALETTE.length - 1, Math.floor(v * PALETTE.length));
        const path = paths[tone];

        if (state.mode === 'pixels') {
          const s = step * 0.92 * Math.sqrt(v);
          path.rect(x - s / 2, y - s / 2, s, s);
        } else if (state.mode === 'lines') {
          // linhas de varredura: comprimento e espessura crescem com o brilho
          const len = step * 1.1 * Math.sqrt(v);
          const thick = 0.9 + 2.2 * v;
          path.rect(x - half, y - thick / 2, Math.max(len, 0.8), thick);
        } else {
          const r = half * 0.95 * Math.sqrt(v);
          if (r < 0.35) continue;
          path.moveTo(x + r, y);
          path.arc(x, y, r, 0, Math.PI * 2);
        }
      }

      paths.forEach((path, i) => {
        ctx.fillStyle = PALETTE[i];
        ctx.fill(path);
      });

      // Foto nítida revelada perto do cursor
      if (influence > 0.01) {
        const radius = REVEAL_RADIUS * influence;
        revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        revealCtx.globalCompositeOperation = 'source-over';
        revealCtx.clearRect(0, 0, state.width, state.height);
        const gradient = revealCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(0.55, 'rgba(0,0,0,0.85)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        revealCtx.fillStyle = gradient;
        revealCtx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
        revealCtx.globalCompositeOperation = 'source-in';
        const { x, y, w, h } = state.fit;
        revealCtx.drawImage(img, x, y, w, h);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(revealCanvas, 0, 0);
      }

      return introT >= INTRO_END;
    };

    /* ---------- Laço sob demanda ---------- */
    const loop = (now) => {
      state.frame = 0;
      if (!state.ready) return;

      if (state.introStart === null && !state.introDone) state.introStart = now;

      const ease = 0.2;
      state.cursor.x += (state.target.x - state.cursor.x) * ease;
      state.cursor.y += (state.target.y - state.cursor.y) * ease;
      const goal = state.inside ? 1 : 0;
      state.reveal += (goal - state.reveal) * 0.12;

      const introFinished = draw(now);
      if (introFinished) state.introDone = true;

      const moving =
        Math.abs(state.target.x - state.cursor.x) > 0.3 ||
        Math.abs(state.target.y - state.cursor.y) > 0.3 ||
        Math.abs(goal - state.reveal) > 0.004;

      if ((moving || !state.introDone) && state.visible) request();
    };

    const request = () => {
      if (!state.frame) state.frame = requestAnimationFrame(loop);
    };

    const renderStatic = () => {
      state.introDone = true;
      state.reveal = 0;
      draw(performance.now());
    };

    apiRef.current = {
      setMode(next) {
        state.mode = next;
        if (state.ready) (interactive ? request() : renderStatic());
      },
      start() {
        if (!state.ready || state.introDone || !interactive) return;
        request();
      },
    };

    /* ---------- Eventos ---------- */
    const track = trackRef?.current ?? wrap;

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      state.target.x = event.clientX - rect.left;
      state.target.y = event.clientY - rect.top;
      if (!state.inside) {
        // primeira entrada: começa sem "deslizar" desde o canto
        state.cursor.x = state.target.x;
        state.cursor.y = state.target.y;
      }
      state.inside =
        state.target.x > -REPEL_RADIUS &&
        state.target.x < state.width + REPEL_RADIUS &&
        state.target.y > -REPEL_RADIUS &&
        state.target.y < state.height + REPEL_RADIUS;
      if (state.introDone) request();
    };

    const onPointerLeave = () => {
      state.inside = false;
      if (state.introDone) request();
    };

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!state.ready) return;
        build();
        if (interactive && !state.introDone) request();
        else renderStatic();
      });
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible && state.ready && !state.introDone && interactive) request();
    });

    let cancelled = false;
    img
      .decode()
      .catch(() => new Promise((resolve) => { img.onload = resolve; }))
      .then(() => {
        if (cancelled) return;
        state.ready = true;
        build();
        wrap.classList.add('is-ready');
        if (!interactive) renderStatic();
        else if (play) request();
      });

    resizeObserver.observe(wrap);
    visibilityObserver.observe(wrap);

    if (interactive) {
      track.addEventListener('pointermove', onPointerMove, { passive: true });
      track.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(state.frame);
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerleave', onPointerLeave);
      apiRef.current = null;
    };
    // `play` e `mode` são aplicados pelos efeitos abaixo, sem reconstruir a grade
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackRef]);

  useEffect(() => {
    apiRef.current?.setMode(mode);
  }, [mode]);

  useEffect(() => {
    if (play) apiRef.current?.start();
  }, [play]);

  return (
    <div className="portrait" ref={wrapRef}>
      <canvas ref={canvasRef} className="portrait__canvas" aria-hidden="true" />
    </div>
  );
}

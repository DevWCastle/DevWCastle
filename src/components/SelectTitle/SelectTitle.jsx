import { useEffect, useRef } from 'react';
import './SelectTitle.css';

const PAD = 80;             // margem do canvas além do título (caixa, rótulo e letras arrastadas)
const BUILD_STAGGER = 48;   // ms entre letras na montagem
const BUILD_MS = 560;       // duração da montagem de cada letra
const HEAT_DECAY = 0.03;    // velocidade com que o rastro cinza volta à cor original
const SPRING = 0.14;
const DAMPING = 0.74;
const DRAG_LIMIT = 0.6;     // arraste máximo (elástico), em fração da altura da letra
const ECHO = 0.3;           // quanto os contornos-fantasma reagem ao arraste
const MAX_DEBRIS = 22;

const HOT = [78, 90, 132];      // letra sob o cursor: cinza-azulado
const HOLLOW = [10, 26, 66];    // letra agarrada: quase o fundo (--night-3)
const LINE = '238, 242, 255';   // --snow
const MUTED = '167, 179, 214';  // --mist
const LABEL_FONT = '500 11px "JetBrains Mono", ui-monospace, monospace';

const clamp = (v) => Math.min(1, Math.max(0, v));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
const signed = (n) => (n > 0 ? `+${n}` : `${n}`);
const parseColor = (str) => (str.match(/\d+(\.\d+)?/g) || [238, 242, 255]).slice(0, 3).map(Number);

/**
 * Título "selecionável" (referência: letras num editor de design).
 * Lê a posição real de cada letra no DOM e redesenha o título num canvas:
 * sob o cursor a letra ganha caixa de seleção com alças, medidas e contorno
 * tracejado, deixando um rastro cinza que volta à cor original; agarrada,
 * ela fica oca, segue o mouse com elasticidade (o rótulo vira o
 * deslocamento) e as vizinhas reagem com contornos-fantasma; solta, volta
 * ao lugar com mola. O texto do DOM continua lá para leitores de tela e
 * layout; só fica transparente enquanto o canvas está ativo.
 */
export default function SelectTitle({ titleRef, trackRef, play, onReady }) {
  const canvasRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const playRef = useRef(play);
  const apiRef = useRef(null);

  useEffect(() => {
    onReadyRef.current = onReady;
    playRef.current = play;
  }, [onReady, play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const title = titleRef.current;
    const track = trackRef?.current;
    if (!canvas || !title || !track) return undefined;

    const ctx = canvas.getContext('2d');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // trocar ctx.font zera o fontStretch; a largura precisa bater com a do DOM
    const setFont = (font, stretch = 'semi-expanded') => {
      ctx.font = font;
      if ('fontStretch' in ctx) ctx.fontStretch = stretch;
    };

    const state = {
      ready: false,
      width: 0,
      height: 0,
      dpr: 1,
      glyphs: [],
      mode: 'idle', // idle | build | live
      buildEnd: 0,
      hover: null,
      grab: null, // { glyph, sx, sy }
      tapUntil: 0,
      box: { x: 0, y: 0, w: 0, h: 0, a: 0, glyph: null },
      echo: { x: 0, y: 0, vx: 0, vy: 0, from: null },
      debris: [],
      pointer: { x: -9999, y: -9999 },
      frame: 0,
    };

    /* ---------- Mede cada letra a partir das posições do DOM ---------- */
    const measure = () => {
      const box = title.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = Math.ceil(box.width + PAD * 2);
      state.height = Math.ceil(box.height + PAD * 2);
      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);

      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          node.parentElement.closest('.hero__glyph-code, .hero__caret') || !node.textContent.trim()
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });

      const previous = state.glyphs;
      const glyphs = [];
      const range = document.createRange();
      let node = walker.nextNode();
      while (node) {
        const style = getComputedStyle(node.parentElement);
        const size = parseFloat(style.fontSize);
        const font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
        const base = parseColor(style.color); // a opacidade do DOM é 0, mas a cor computada é a real
        setFont(font);
        const ascent = ctx.measureText('H').fontBoundingBoxAscent ?? size * 0.92;

        const text = node.textContent;
        for (let i = 0; i < text.length; i += 1) {
          if (text[i].trim() === '') continue;
          const char = text[i].toLocaleUpperCase('pt-BR');
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const r = range.getBoundingClientRect();
          const m = ctx.measureText(char);
          const x = r.left - box.left + PAD;
          const y = r.top - box.top + PAD + ascent;
          const ink = {
            x: x - m.actualBoundingBoxLeft,
            y: y - m.actualBoundingBoxAscent,
            w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
            h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
          };
          const old = previous[glyphs.length];
          glyphs.push({
            char,
            font,
            base,
            x,
            y,
            ink,
            hit: { x0: x, x1: x + r.width, y0: ink.y - 6, y1: ink.y + ink.h + 6 },
            heat: old?.heat ?? 0,
            born: old?.born ?? 0,
            ox: 0, oy: 0, vx: 0, vy: 0,
          });
        }
        node = walker.nextNode();
      }
      state.glyphs = glyphs;
      state.hover = null;
      state.grab = null;
      state.box.glyph = null;
    };

    const glyphAt = (x, y) =>
      state.glyphs.find((g) => x >= g.hit.x0 && x <= g.hit.x1 && y >= g.hit.y0 && y <= g.hit.y1) || null;

    /* ---------- Desenho ---------- */
    const dashed = (g, x, y, alpha) => {
      if (alpha <= 0.01) return;
      ctx.globalAlpha = 1;
      setFont(g.font);
      ctx.setLineDash([5, 3.5]);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = `rgba(${LINE}, ${alpha})`;
      ctx.strokeText(g.char, x, y);
      ctx.setLineDash([]);
    };

    const drawSelection = () => {
      const { box } = state;
      if (box.a <= 0.01 || !box.glyph) return;
      const x = Math.round(box.x) + 0.5;
      const y = Math.round(box.y) + 0.5;
      const w = Math.round(box.w);
      const h = Math.round(box.h);

      ctx.globalAlpha = box.a;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${LINE}, 0.55)`;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = `rgb(${LINE})`;
      for (const [hx, hy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
        ctx.fillRect(hx - 3, hy - 3, 6, 6);
      }
      for (const [hx, hy] of [[x + w / 2, y], [x + w / 2, y + h], [x, y + h / 2], [x + w, y + h / 2]]) {
        ctx.fillRect(hx - 1.5, hy - 1.5, 3, 3);
      }

      // rótulo: medidas da letra, ou o deslocamento enquanto ela é arrastada
      const g = box.glyph;
      const grabbed = state.grab?.glyph === g;
      const label = grabbed
        ? `${signed(Math.round(g.ox))}, ${signed(Math.round(-g.oy))}`
        : `${g.char}  ${Math.round(g.ink.w)} × ${Math.round(g.ink.h)}`;
      setFont(LABEL_FONT, 'normal');
      ctx.fillStyle = `rgba(${MUTED}, 0.9)`;
      ctx.fillText(label, x, y - 8);
      ctx.globalAlpha = 1;
    };

    const drawDebris = () => {
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      state.debris.forEach((p) => {
        const a = (p.life / p.max) * 0.85 * Math.max(state.box.a, 0.3);
        if (p.hollow) {
          ctx.strokeStyle = `rgba(${MUTED}, ${a})`;
          ctx.strokeRect(Math.round(p.x) + 0.5, Math.round(p.y) + 0.5, p.s, p.s);
        } else {
          ctx.fillStyle = `rgba(${MUTED}, ${a})`;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
        }
      });
    };

    const draw = (now) => {
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);
      ctx.textBaseline = 'alphabetic';
      if (state.mode === 'idle') return;

      const grabbed = state.grab?.glyph;
      const { echo } = state;
      const echoSize = Math.hypot(echo.x, echo.y);

      // contornos-fantasma das vizinhas, deslocados contra o arraste
      if (echoSize > 0.6 && echo.from) {
        const fx = echo.from.ink.x + echo.from.ink.w / 2;
        const fy = echo.from.ink.y + echo.from.ink.h / 2;
        state.glyphs.forEach((g) => {
          if (g === echo.from) return;
          const d = Math.hypot(g.ink.x + g.ink.w / 2 - fx, g.ink.y + g.ink.h / 2 - fy);
          dashed(g, g.x + echo.x, g.y + echo.y, Math.min(1, echoSize / 10) * 0.38 * Math.exp(-d / 380));
        });
      }

      state.glyphs.forEach((g) => {
        if (g === grabbed) return;
        const local = state.mode === 'build' ? (now - g.born) / BUILD_MS : 1;
        if (local <= 0) return;
        const outline = clamp(local * 2.4);
        const fill = clamp((local - 0.28) / 0.6);
        const x = g.x + g.ox;
        const y = g.y + g.oy;
        const moved = Math.hypot(g.ox, g.oy);

        if (moved > 1) dashed(g, g.x, g.y, Math.min(1, moved / 12) * 0.6); // posição de origem
        setFont(g.font);
        ctx.globalAlpha = fill;
        ctx.fillStyle = rgb(mix(g.base, HOT, g.heat));
        ctx.fillText(g.char, x, y);
        dashed(g, x, y, Math.max(outline * (1 - fill), g.heat * g.heat) * outline);
      });

      // a letra agarrada fica oca e por cima de tudo, com a origem marcada
      if (grabbed) {
        const g = grabbed;
        dashed(g, g.x, g.y, Math.min(1, Math.hypot(g.ox, g.oy) / 12) * 0.6);
        setFont(g.font);
        ctx.globalAlpha = 1;
        ctx.fillStyle = rgb(HOLLOW);
        ctx.fillText(g.char, g.x + g.ox, g.y + g.oy);
        dashed(g, g.x + g.ox, g.y + g.oy, 1);
      }

      drawSelection();
      drawDebris();
    };

    /* ---------- Simulação: rastro, molas, caixa de seleção e detritos ---------- */
    const step = (now) => {
      const { box, echo } = state;
      if (state.tapUntil && now > state.tapUntil) {
        state.tapUntil = 0;
        state.hover = null;
      }
      if (state.mode === 'build' && now > state.buildEnd) state.mode = 'live';

      // quem recebe a caixa: a letra agarrada, a sob o cursor ou, na montagem, a mais recente
      let target = state.grab?.glyph || state.hover;
      if (state.mode === 'build') {
        target = null;
        state.glyphs.forEach((g) => {
          if (now >= g.born && now < g.born + BUILD_MS) target = g;
        });
      }

      let active = state.mode === 'build' || Boolean(target);

      state.glyphs.forEach((g) => {
        if (g === target && state.mode === 'live') g.heat = 1;
        else if (now > g.born + BUILD_MS * 0.45) g.heat = Math.max(0, g.heat - HEAT_DECAY);
        if (g !== state.grab?.glyph) {
          g.vx = (g.vx - g.ox * SPRING) * DAMPING;
          g.vy = (g.vy - g.oy * SPRING) * DAMPING;
          g.ox += g.vx;
          g.oy += g.vy;
          if (Math.abs(g.ox) + Math.abs(g.oy) < 0.05 && Math.abs(g.vx) + Math.abs(g.vy) < 0.05) {
            g.ox = g.oy = g.vx = g.vy = 0;
          }
        }
        if (g.heat > 0 || g.ox || g.oy) active = true;
      });

      // ecos: seguem o arraste ao contrário, com mola (balançam ao soltar)
      const grab = state.grab?.glyph;
      const tx = grab ? -grab.ox * ECHO : 0;
      const ty = grab ? -grab.oy * ECHO : 0;
      echo.vx = (echo.vx + (tx - echo.x) * SPRING) * DAMPING;
      echo.vy = (echo.vy + (ty - echo.y) * SPRING) * DAMPING;
      echo.x += echo.vx;
      echo.y += echo.vy;
      if (Math.abs(echo.x) + Math.abs(echo.y) + Math.abs(echo.vx) + Math.abs(echo.vy) > 0.1) active = true;

      if (target) {
        const tb = {
          x: target.ink.x + target.ox - 3,
          y: target.ink.y + target.oy - 3,
          w: target.ink.w + 6,
          h: target.ink.h + 6,
        };
        if (box.a < 0.05) Object.assign(box, tb); // reaparece direto na letra
        const k = state.grab ? 0.6 : 0.38;
        box.x += (tb.x - box.x) * k;
        box.y += (tb.y - box.y) * k;
        box.w += (tb.w - box.w) * k;
        box.h += (tb.h - box.h) * k;
        box.a = Math.min(1, box.a + 0.2);
        box.glyph = target;

        if (state.debris.length < MAX_DEBRIS && Math.random() < 0.3) {
          const side = Math.floor(Math.random() * 4);
          const t = Math.random();
          const out = 4 + Math.random() * 14;
          const px = side < 2 ? box.x + t * box.w : side === 2 ? box.x - out : box.x + box.w + out;
          const py = side >= 2 ? box.y + t * box.h : side === 0 ? box.y - out : box.y + box.h + out;
          const max = 18 + Math.random() * 26;
          state.debris.push({
            x: px,
            y: py,
            s: 2 + Math.floor(Math.random() * 6),
            hollow: Math.random() < 0.4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            life: max,
            max,
          });
        }
      } else if (box.a > 0) {
        box.a = Math.max(0, box.a - 0.07);
        active = true;
      }

      state.debris = state.debris.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        return p.life > 0;
      });
      if (state.debris.length) active = true;

      return active;
    };

    const loop = (now) => {
      state.frame = 0;
      if (!state.ready) return;
      const keep = step(now);
      draw(now);
      if (keep && !track.classList.contains('is-covered')) request();
    };

    const request = () => {
      if (!state.frame) state.frame = requestAnimationFrame(loop);
    };

    apiRef.current = {
      build() {
        if (!state.ready) return;
        const start = performance.now();
        state.glyphs.forEach((g, i) => {
          g.born = start + i * BUILD_STAGGER;
          g.heat = 1;
          g.ox = g.oy = g.vx = g.vy = 0;
        });
        state.buildEnd = start + state.glyphs.length * BUILD_STAGGER + BUILD_MS;
        state.mode = 'build';
        request();
      },
    };

    /* ---------- Eventos ---------- */
    const toLocal = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * state.width,
        y: ((event.clientY - rect.top) / rect.height) * state.height,
      };
    };

    const setCursor = () => {
      track.style.cursor = state.grab ? 'grabbing' : state.hover ? 'grab' : '';
    };

    // elástico: quanto mais longe, mais a letra resiste
    const rubber = (d, limit) => Math.sign(d) * limit * (1 - Math.exp(-Math.abs(d) / limit));

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch' || state.mode !== 'live') return;
      const { x, y } = toLocal(event);
      state.pointer.x = x;
      state.pointer.y = y;

      if (state.grab) {
        const { glyph, sx, sy } = state.grab;
        const limit = glyph.ink.h * DRAG_LIMIT;
        glyph.ox = rubber(x - sx, limit);
        glyph.oy = rubber(y - sy, limit);
        request();
        return;
      }

      const hover = glyphAt(x, y);
      if (hover !== state.hover) {
        state.hover = hover;
        setCursor();
        request();
      }
    };

    const onPointerLeave = () => {
      if (state.grab) return;
      state.hover = null;
      setCursor();
    };

    const onPointerDown = (event) => {
      if (state.mode !== 'live' || event.button !== 0 || event.target.closest('a, button')) return;
      const { x, y } = toLocal(event);
      const glyph = glyphAt(x, y);
      if (!glyph) return;

      // no toque só seleciona por um instante (arrastar fica para a rolagem)
      if (event.pointerType === 'touch' || !finePointer) {
        state.hover = glyph;
        state.tapUntil = performance.now() + 1400;
        request();
        return;
      }

      event.preventDefault();
      track.setPointerCapture?.(event.pointerId);
      state.grab = { glyph, sx: x - glyph.ox, sy: y - glyph.oy };
      state.echo.from = glyph;
      glyph.vx = glyph.vy = 0;
      setCursor();
      request();
    };

    const onPointerUp = (event) => {
      if (!state.grab) return;
      if (track.hasPointerCapture?.(event.pointerId)) track.releasePointerCapture(event.pointerId);
      state.grab = null;
      const { x, y } = state.pointer;
      state.hover = glyphAt(x, y);
      setCursor();
      request();
    };

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      if (!state.ready) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        measure();
        draw(performance.now());
      });
    });

    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      measure();
      state.ready = true;
      resizeObserver.observe(title);
      onReadyRef.current?.();
      if (playRef.current) apiRef.current?.build();
    });

    if (finePointer) {
      track.addEventListener('pointermove', onPointerMove, { passive: true });
      track.addEventListener('pointerleave', onPointerLeave);
    }
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    return () => {
      cancelled = true;
      cancelAnimationFrame(state.frame);
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerleave', onPointerLeave);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
      track.style.cursor = '';
      apiRef.current = null;
    };
  }, [titleRef, trackRef]);

  useEffect(() => {
    if (play) apiRef.current?.build();
  }, [play]);

  return <canvas ref={canvasRef} className="select-title" aria-hidden="true" />;
}

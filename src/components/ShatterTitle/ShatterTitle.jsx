import { useEffect, useRef } from 'react';
import './ShatterTitle.css';

const PAD = 120;          // margem do canvas além do título (os cacos voam para fora)
const CELL_FINE = 17;     // tamanho da célula da malha de cacos (px)
const CELL_TOUCH = 22;
const ASSEMBLE_MS = 1100; // montagem inicial
const CRACK_RADIUS = 110; // raio de influência do cursor
const SPRING = 0.07;
const DAMPING = 0.84;
const TINT = 'rgba(74, 116, 255, 0.55)'; // alguns cacos ganham o azul sinal, como os violetas da referência

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/* Malha triangular com vértices compartilhados e levemente deslocados */
function buildMesh(width, height, cell, seed) {
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const verts = [];
  for (let r = 0; r <= rows; r += 1) {
    for (let c = 0; c <= cols; c += 1) {
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      const j = edge ? 0 : cell * 0.38;
      verts.push([c * cell + (rand() - 0.5) * j, r * cell + (rand() - 0.5) * j]);
    }
  }
  const at = (r, c) => verts[r * (cols + 1) + c];
  const tris = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const a = at(r, c);
      const b = at(r, c + 1);
      const d = at(r + 1, c);
      const e = at(r + 1, c + 1);
      if ((r + c) % 2) {
        tris.push([a, b, e], [a, e, d]);
      } else {
        tris.push([a, b, d], [b, e, d]);
      }
    }
  }
  return tris;
}

/**
 * Título em cacos de vidro (referência: "Shatter Type").
 * Lê a posição real de cada letra no DOM, desenha o título num canvas e o
 * recorta em triângulos: monta a partir dos cacos, racha sob o cursor e
 * estilhaça no clique, sempre voltando ao lugar. O texto do DOM continua
 * lá para leitores de tela e layout; só fica transparente enquanto o
 * canvas está ativo. `onReady` avisa quando a troca pode acontecer.
 */
export default function ShatterTitle({ titleRef, trackRef, play, onReady }) {
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
    const source = document.createElement('canvas');
    const sctx = source.getContext('2d', { willReadFrequently: true });
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const state = {
      ready: false,
      width: 0,
      height: 0,
      dpr: 1,
      shards: [],
      mode: 'idle', // idle | assemble | live
      assembleStart: 0,
      pointer: { x: -9999, y: -9999, speed: 0, inside: false },
      frame: 0,
    };

    /* ---------- Rasteriza o título a partir das posições do DOM ---------- */
    const rasterize = () => {
      const box = title.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = Math.ceil(box.width + PAD * 2);
      state.height = Math.ceil(box.height + PAD * 2);

      for (const c of [canvas, source]) {
        c.width = Math.round(state.width * state.dpr);
        c.height = Math.round(state.height * state.dpr);
      }

      sctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      sctx.clearRect(0, 0, state.width, state.height);
      sctx.textBaseline = 'alphabetic';

      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          node.parentElement.closest('.hero__glyph-code, .hero__caret') || !node.textContent.trim()
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });

      const range = document.createRange();
      let node = walker.nextNode();
      while (node) {
        const style = getComputedStyle(node.parentElement);
        const size = parseFloat(style.fontSize);
        sctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
        if ('fontStretch' in sctx) sctx.fontStretch = 'semi-expanded';
        sctx.fillStyle = style.color; // a opacidade do DOM é 0, mas a cor computada é a real
        const metrics = sctx.measureText('H');
        const ascent = metrics.fontBoundingBoxAscent ?? size * 0.92;

        const text = node.textContent;
        for (let i = 0; i < text.length; i += 1) {
          const char = text[i];
          if (char.trim() === '') continue;
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const r = range.getBoundingClientRect();
          sctx.fillText(
            char.toLocaleUpperCase('pt-BR'),
            r.left - box.left + PAD,
            r.top - box.top + PAD + ascent
          );
        }
        node = walker.nextNode();
      }

      buildShards();
    };

    const buildShards = () => {
      const cell = finePointer ? CELL_FINE : CELL_TOUCH;
      const tris = buildMesh(state.width, state.height, cell, 1337);
      const { data } = sctx.getImageData(0, 0, source.width, source.height);
      const alphaAt = (x, y) => {
        const px = Math.min(source.width - 1, Math.max(0, Math.round(x * state.dpr)));
        const py = Math.min(source.height - 1, Math.max(0, Math.round(y * state.dpr)));
        return data[(py * source.width + px) * 4 + 3];
      };

      state.shards = [];
      tris.forEach(([a, b, c], i) => {
        const cx = (a[0] + b[0] + c[0]) / 3;
        const cy = (a[1] + b[1] + c[1]) / 3;
        const ink =
          alphaAt(cx, cy) + alphaAt(a[0], a[1]) + alphaAt(b[0], b[1]) + alphaAt(c[0], c[1]);
        if (ink < 40) return; // triângulo vazio: não vira caco
        state.shards.push({
          cx,
          cy,
          pts: [a[0] - cx, a[1] - cy, b[0] - cx, b[1] - cy, c[0] - cx, c[1] - cy],
          x: 0, y: 0, r: 0,
          vx: 0, vy: 0, vr: 0,
          tint: i % 7 === 0,
          // montagem: de onde o caco vem e quando começa
          fromX: 0, fromY: 0, fromR: 0, delay: 0,
        });
      });
    };

    /* ---------- Desenho ---------- */
    const trianglePath = (path, s, ox, oy, rot) => {
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const p = s.pts;
      for (let k = 0; k < 6; k += 2) {
        const x = s.cx + ox + p[k] * cos - p[k + 1] * sin;
        const y = s.cy + oy + p[k] * sin + p[k + 1] * cos;
        if (k === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      path.closePath();
    };

    const drawShard = (s, ox, oy, rot, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(s.cx + ox, s.cy + oy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(s.pts[0], s.pts[1]);
      ctx.lineTo(s.pts[2], s.pts[3]);
      ctx.lineTo(s.pts[4], s.pts[5]);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(source, -s.cx, -s.cy, state.width, state.height);
      if (s.tint) {
        ctx.fillStyle = TINT;
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = (now) => {
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);

      if (state.mode === 'assemble') {
        const t = now - state.assembleStart;
        let done = true;
        state.shards.forEach((s) => {
          const local = Math.min(1, Math.max(0, (t - s.delay) / (ASSEMBLE_MS * 0.7)));
          if (local < 1) done = false;
          if (local <= 0) return;
          const e = easeOut(local);
          drawShard(s, s.fromX * (1 - e), s.fromY * (1 - e), s.fromR * (1 - e), Math.min(1, local * 2.2));
        });
        if (done) state.mode = 'live';
        return true;
      }

      // título inteiro, com "buracos" onde há cacos fora do lugar
      ctx.drawImage(source, 0, 0, state.width, state.height);
      const moving = state.shards.filter(
        (s) => Math.abs(s.x) + Math.abs(s.y) > 0.3 || Math.abs(s.r) > 0.004
      );
      if (!moving.length) return false;

      const holes = new Path2D();
      moving.forEach((s) => trianglePath(holes, s, 0, 0, 0));
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill(holes);
      ctx.lineWidth = 1;
      ctx.stroke(holes); // fecha as costuras antisserrilhadas
      ctx.globalCompositeOperation = 'source-over';

      moving.forEach((s) => drawShard(s, s.x, s.y, s.r, 1));
      return true;
    };

    /* ---------- Física: mola de volta ao lugar + empurrão do cursor ---------- */
    const step = () => {
      const { pointer } = state;
      const r2 = CRACK_RADIUS * CRACK_RADIUS;
      const push = pointer.inside ? 0.35 + Math.min(pointer.speed / 14, 1.4) : 0;
      pointer.speed *= 0.85;
      let active = false;

      state.shards.forEach((s) => {
        if (push) {
          const dx = s.cx + s.x - pointer.x;
          const dy = s.cy + s.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / CRACK_RADIUS) ** 2 * push;
            s.vx += (dx / d) * f;
            s.vy += (dy / d) * f;
            s.vr += (s.pts[0] > 0 ? 1 : -1) * f * 0.012;
          }
        }
        s.vx = (s.vx - s.x * SPRING) * DAMPING;
        s.vy = (s.vy - s.y * SPRING) * DAMPING;
        s.vr = (s.vr - s.r * SPRING) * DAMPING;
        s.x += s.vx;
        s.y += s.vy;
        s.r += s.vr;
        if (Math.abs(s.vx) + Math.abs(s.vy) > 0.02 || Math.abs(s.x) + Math.abs(s.y) > 0.3) active = true;
      });
      return active || push > 0.4;
    };

    const loop = (now) => {
      state.frame = 0;
      if (!state.ready) return;
      let keep;
      if (state.mode === 'assemble') {
        keep = draw(now);
      } else {
        const stepping = step();
        keep = draw(now) || stepping;
      }
      if (keep && !track.classList.contains('is-covered')) request();
    };

    const request = () => {
      if (!state.frame) state.frame = requestAnimationFrame(loop);
    };

    apiRef.current = {
      assemble() {
        if (!state.ready) return;
        const cx = state.width / 2;
        state.shards.forEach((s) => {
          const angle = Math.atan2(s.cy - state.height / 2, s.cx - cx) + (Math.random() - 0.5) * 1.4;
          const dist = 120 + Math.random() * 380;
          s.fromX = Math.cos(angle) * dist;
          s.fromY = Math.sin(angle) * dist - 60;
          s.fromR = (Math.random() - 0.5) * 3;
          s.delay = (s.cx / state.width) * ASSEMBLE_MS * 0.35 + Math.random() * 120;
          s.x = s.y = s.r = s.vx = s.vy = s.vr = 0;
        });
        state.mode = 'assemble';
        state.assembleStart = performance.now();
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

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch' || state.mode !== 'live') return;
      const { x, y } = toLocal(event);
      const { pointer } = state;
      const speed = Math.hypot(x - pointer.x, y - pointer.y);
      pointer.speed = Math.min(40, Number.isFinite(speed) ? speed : 0);
      pointer.x = x;
      pointer.y = y;
      pointer.inside = x > PAD - 40 && x < state.width - PAD + 40 && y > PAD - 40 && y < state.height - PAD + 40;
      if (pointer.inside) request();
    };

    const onPointerLeave = () => {
      state.pointer.inside = false;
    };

    // clique sobre o título: estilhaça tudo a partir do ponto clicado
    const onClick = (event) => {
      if (state.mode !== 'live' || event.target.closest('a, button')) return;
      const { x, y } = toLocal(event);
      if (x < PAD || x > state.width - PAD || y < PAD || y > state.height - PAD) return;
      state.shards.forEach((s) => {
        const dx = s.cx - x;
        const dy = s.cy - y;
        const d = Math.hypot(dx, dy) || 1;
        const f = 9 + Math.random() * 14;
        s.vx += (dx / d) * f;
        s.vy += (dy / d) * f - 4;
        s.vr += (Math.random() - 0.5) * 0.5;
      });
      request();
    };

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      if (!state.ready) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        rasterize();
        if (state.mode !== 'idle') draw(performance.now());
      });
    });

    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      rasterize();
      state.ready = true;
      resizeObserver.observe(title);
      onReadyRef.current?.();
      if (playRef.current) apiRef.current?.assemble();
    });

    if (finePointer) {
      track.addEventListener('pointermove', onPointerMove, { passive: true });
      track.addEventListener('pointerleave', onPointerLeave);
    }
    track.addEventListener('click', onClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(state.frame);
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerleave', onPointerLeave);
      track.removeEventListener('click', onClick);
      apiRef.current = null;
    };
  }, [titleRef, trackRef]);

  useEffect(() => {
    if (play) apiRef.current?.assemble();
  }, [play]);

  return <canvas ref={canvasRef} className="shatter" aria-hidden="true" />;
}

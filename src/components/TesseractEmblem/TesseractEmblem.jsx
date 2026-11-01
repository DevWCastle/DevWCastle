import { useEffect, useRef } from 'react';
import './TesseractEmblem.css';

const DELAY_MS = 400;      // espera o hero aparecer
const BUILD_MS = 4200;     // ponto → linha → quadrado → cubo → tesseract
const TRACE_MS = 1100;     // as trilhas do cubo de circuitos se desenham depois
const HOLD_MS = 2600;      // pausa na pose da logo entre um giro e outro
const TURN_MS = 2400;      // um quarto de volta em 4D: o cubo de dentro passa para fora
const SIGNAL_EVERY = 520;  // ms entre sinais que correm pelas arestas
const SIGNAL_MS = 900;
const PULSE_EVERY = 650;   // ms entre pulsos nas trilhas de circuito
const PULSE_MS = 800;
const D4 = 5;              // distância da câmera na 4ª dimensão (cubo de dentro com 2/3 do de fora)
const D3 = 6;
const ISO_YAW = Math.PI / 4;           // cubo visto pela quina, como na logo
const ISO_PITCH = Math.atan(Math.SQRT1_2);
const CORE = 0.6;          // meia-aresta do cubo de circuitos (o tesseract vai de -1 a 1)

// mesma escala de azuis do retrato em pontos (HeroPortrait) e do título
const WHITE = '217, 226, 255'; // tom mais claro dos pontos (#d9e2ff)
const CYAN = '134, 162, 255';  // tom médio-claro dos pontos (#86a2ff), no lugar do ciano
const BLUE = '74, 116, 255';   // --blue-bright, o azul de "impacto real"
const BRAND = '0, 49, 249';    // --blue, o azul da logo

// 16 vértices do hipercubo e as 32 arestas (pares que diferem em uma coordenada)
const VERTS = Array.from({ length: 16 }, (_, i) => [0, 1, 2, 3].map((b) => ((i >> b) & 1 ? 1 : -1)));
const EDGES = [];
VERTS.forEach((_, i) => {
  for (let b = 0; b < 4; b += 1) {
    const j = i ^ (1 << b);
    if (i < j) EDGES.push([i, j]);
  }
});

// faces do cubo de circuitos: normal + dois eixos da face
const FACES = [
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, -1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, -1, 0] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, -1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, -1, 0] },
];

// trilhas de circuito em coordenadas da face (-1 a 1), com curvas a 45° e terminais nas pontas
const TRACES = [
  [[-0.62, -0.58], [-0.05, -0.58], [0.2, -0.33], [0.6, -0.33]],
  [[-0.62, -0.12], [-0.3, -0.12], [-0.05, 0.13], [0.42, 0.13]],
  [[-0.5, 0.5], [0.08, 0.5], [0.3, 0.72]],
  [[0.64, -0.7], [0.64, 0.12], [0.42, 0.34]],
  [[-0.72, 0.72], [-0.72, 0.22]],
];
// cada face recebe o desenho girado ou espelhado, para não repetir
const FACE_TRACES = [
  ([u, v]) => [u, v],
  ([u, v]) => [-v, u],
  ([u, v]) => [-u, v],
  ([u, v]) => [v, -u],
  ([u, v]) => [u, -v],
  ([u, v]) => [-v, -u],
].map((map) => TRACES.map((trace) => trace.map(map)));

const clamp = (v) => Math.min(1, Math.max(0, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

/* trecho de uma polilinha até a fração t do comprimento */
function partial(points, t) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let left = lengths.reduce((a, b) => a + b, 0) * t;
  const out = [points[0]];
  for (let i = 0; i < lengths.length; i += 1) {
    if (left >= lengths[i]) {
      out.push(points[i + 1]);
      left -= lengths[i];
    } else {
      const k = left / lengths[i];
      out.push([lerp(points[i][0], points[i + 1][0], k), lerp(points[i][1], points[i + 1][1], k)]);
      break;
    }
  }
  return out;
}

/**
 * Ícone da marca como tesseract (referência: "tesseract", postminimal agency).
 * Um ponto se move e vira linha, a linha vira quadrado, o quadrado vira cubo
 * e o cubo, empurrado para a quarta dimensão, vira tesseract, parando na
 * pose da logo: o cubo visto pela quina, um hexágono dentro do outro. No
 * meio dele fica o cubo de vidro com as trilhas de circuito da logo. Depois
 * o tesseract se vira do avesso em 4D de tempos em tempos, com sinais
 * correndo pelas arestas e pulsos pelas trilhas.
 */
export default function TesseractEmblem({ play, trackRef }) {
  const canvasRef = useRef(null);
  const playRef = useRef(play);
  const startRef = useRef(null);

  useEffect(() => {
    playRef.current = play;
    if (play) startRef.current?.();
  }, [play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const track = trackRef?.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const state = {
      size: 0,
      dpr: 1,
      begin: 0,   // 0 = ainda não começou
      visible: true,
      frame: 0,
      signals: [],
      lastSignal: 0,
      pulses: [],
      lastPulse: 0,
      tilt: { x: 0, y: 0, tx: 0, ty: 0 },
    };

    const resize = () => {
      const { width } = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.size = width;
      canvas.width = Math.round(width * state.dpr);
      canvas.height = Math.round(width * state.dpr);
    };

    /* ---------- Geometria ---------- */
    // s vai de 0 a 4: a parte inteira é a dimensão já pronta, a fração é a que está sendo varrida
    const sweep = (v, s) => v.map((c, i) => (s >= i + 1 ? c : s > i ? c * (s - i) : 0));

    // 3D → tela: guinada, inclinação e perspectiva (y do canvas cresce para baixo)
    const view = ([x, y, z], yaw, pitch) => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      [y, z] = [y * cp - z * sp, y * sp + z * cp];
      const p = D3 / (D3 - z);
      return { x: x * p, y: -y * p, z };
    };

    // 4D → 3D, com giro no plano XW: a cada 90° o tesseract volta à mesma forma
    const fold = ([x, y, z, w], angle, norm) => {
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      [x, w] = [x * ca - w * sa, x * sa + w * ca];
      const k = D4 / (D4 - w) / norm; // norm mantém o cubo de fora do tamanho do cubo 3D
      return [x * k, y * k, z * k];
    };

    /* ---------- Traços com brilho (somados em 'lighter') ---------- */
    const strokeGlow = (path, alpha, width) => {
      ctx.strokeStyle = `rgba(${BLUE}, ${alpha * 0.16})`;
      ctx.lineWidth = width * 7;
      ctx.stroke(path);
      ctx.strokeStyle = `rgba(${CYAN}, ${alpha * 0.38})`;
      ctx.lineWidth = width * 3;
      ctx.stroke(path);
      ctx.strokeStyle = `rgba(${WHITE}, ${alpha})`;
      ctx.lineWidth = width;
      ctx.stroke(path);
    };

    const line = (a, b) => {
      const path = new Path2D();
      path.moveTo(a.x, a.y);
      path.lineTo(b.x, b.y);
      return path;
    };

    const glowDot = (x, y, r, alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      g.addColorStop(0, `rgba(${WHITE}, ${alpha})`);
      g.addColorStop(0.25, `rgba(${CYAN}, ${alpha * 0.45})`);
      g.addColorStop(1, `rgba(${BLUE}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 5, 0, Math.PI * 2);
      ctx.fill();
    };

    /* ---------- Cubo de circuitos (fixo no centro, só acompanha a inclinação) ---------- */
    const drawCore = (toScreen, yaw, pitch, alpha, traces, now) => {
      if (alpha <= 0) return;
      const { size } = state;
      const unit = size / 340; // espessuras pensadas para o ícone com 340px
      const at = (face, u, v) =>
        toScreen([0, 1, 2].map((i) => (face.n[i] + face.u[i] * u + face.v[i] * v) * CORE));

      FACES.forEach((face, f) => {
        // só as faces voltadas para a câmera
        if (view(face.n, yaw, pitch).z <= 0.02) return;
        const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => at(face, u, v));
        const inset = [[-0.84, -0.84], [0.84, -0.84], [0.84, 0.84], [-0.84, 0.84]].map(([u, v]) => at(face, u, v));

        // vidro: preenchimento leve + moldura interna (a espessura do vidro na logo)
        const glass = new Path2D();
        corners.forEach((p, i) => (i ? glass.lineTo(p.x, p.y) : glass.moveTo(p.x, p.y)));
        glass.closePath();
        ctx.fillStyle = `rgba(${BRAND}, ${0.16 * alpha})`;
        ctx.fill(glass);
        const bevel = new Path2D();
        inset.forEach((p, i) => (i ? bevel.lineTo(p.x, p.y) : bevel.moveTo(p.x, p.y)));
        bevel.closePath();
        strokeGlow(bevel, 0.4 * alpha, 0.9 * unit);

        // trilhas: se desenham uma vez, depois só recebem pulsos
        FACE_TRACES[f].forEach((trace, t) => {
          const drawn = partial(trace, clamp(traces * 1.25 - t * 0.06));
          if (drawn.length < 2) return;
          const path = new Path2D();
          drawn.forEach(([u, v], i) => {
            const p = at(face, u, v);
            if (i) path.lineTo(p.x, p.y);
            else path.moveTo(p.x, p.y);
          });
          strokeGlow(path, 0.85 * alpha, 1.7 * unit);
          // terminais em anel nas pontas
          [drawn[0], drawn.length === trace.length ? drawn[drawn.length - 1] : null].forEach((end) => {
            if (!end) return;
            const p = at(face, end[0], end[1]);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.2 * unit, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${WHITE}, ${0.9 * alpha})`;
            ctx.lineWidth = 1.4 * unit;
            ctx.stroke();
          });
        });
      });

      // pulsos correndo pelas trilhas das faces visíveis
      state.pulses.forEach((pulse) => {
        const face = FACES[pulse.face];
        if (view(face.n, yaw, pitch).z <= 0.02) return;
        const t = (now - pulse.t0) / PULSE_MS;
        const trace = FACE_TRACES[pulse.face][pulse.trace];
        const head = partial(trace, easeInOut(t)).pop();
        const p = at(face, head[0], head[1]);
        glowDot(p.x, p.y, 1.8 * unit, Math.sin(t * Math.PI) * alpha);
      });

      // arestas do cubo, por cima do vidro
      for (let i = 0; i < 8; i += 1) {
        for (let b = 0; b < 3; b += 1) {
          const j = i ^ (1 << b);
          if (i > j) continue;
          const corner = (k) => [0, 1, 2].map((a) => ((k >> a) & 1 ? CORE : -CORE));
          strokeGlow(line(toScreen(corner(i)), toScreen(corner(j))), 0.9 * alpha, 1.3 * unit);
        }
      }
    };

    /* ---------- Quadro ---------- */
    const draw = (now) => {
      const { size, dpr } = state;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      if (!state.begin && !reduce) return;

      const elapsed = reduce ? Infinity : now - state.begin - DELAY_MS;
      const build = clamp(elapsed / BUILD_MS);
      const built = build >= 1;
      // um quarto do tempo por dimensão, com pausa curta em cada forma pronta
      const s = built ? 4 : Math.floor(build * 4) + easeInOut(clamp(((build * 4) % 1) * 1.25));
      const pose = easeInOut(clamp(build * 1.6));
      const norm = lerp(1, D4 / (D4 - 1), clamp(s - 3));

      // depois de montado: descansa na pose da logo, vira 90° em 4D, descansa de novo…
      let angle = 0;
      if (built && !reduce) {
        const t = elapsed - BUILD_MS;
        const cycle = HOLD_MS + TURN_MS;
        angle = (Math.floor(t / cycle) + easeInOut(clamp(((t % cycle) - HOLD_MS) / TURN_MS))) * (Math.PI / 2);
      }

      const { tilt } = state;
      const yaw = lerp(0.42, ISO_YAW, pose) + tilt.x;
      const pitch = lerp(0.3, ISO_PITCH, pose) + tilt.y;

      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.27;
      const toScreen = (p3) => {
        const p = view(p3, yaw, pitch);
        return { x: cx + p.x * R, y: cy + p.y * R, z: p.z };
      };

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // feixe de luz que desce sobre o cubo, como na logo
      const coreIn = clamp((build - 0.8) / 0.2);
      if (coreIn > 0) {
        const top = cy - R * 1.5;
        const beam = ctx.createLinearGradient(0, 0, 0, top);
        beam.addColorStop(0, `rgba(${BLUE}, 0)`);
        beam.addColorStop(1, `rgba(${BLUE}, ${0.4 * coreIn})`);
        ctx.fillStyle = beam;
        ctx.fillRect(cx - 1, 0, 2, top);
      }

      const pts = VERTS.map((v) => toScreen(fold(sweep(v, s), angle, norm)));

      // arestas do tesseract: as da frente brilham mais
      EDGES.forEach(([a, b]) => {
        const pa = pts[a];
        const pb = pts[b];
        if (Math.hypot(pa.x - pb.x, pa.y - pb.y) < 0.5) return; // ainda colapsada
        const depth = clamp(((pa.z + pb.z) / 2 + 2) / 4);
        strokeGlow(line(pa, pb), 0.35 + depth * 0.6, 1.3 * (size / 340));
      });

      // vértices: os "pads" das trilhas de circuito
      pts.forEach((p) => glowDot(p.x, p.y, 1.6, 0.55 + clamp((p.z + 2) / 4) * 0.4));

      // o ponto que começa tudo
      if (!built && s < 1) glowDot(pts[0].x, pts[0].y, 2.4, clamp(elapsed / 300));

      // cubo de circuitos no meio: surge com o tesseract, as trilhas vêm depois
      if (built && !reduce) {
        if (now - state.lastPulse > PULSE_EVERY) {
          state.lastPulse = now;
          state.pulses.push({ face: Math.floor(Math.random() * 6), trace: Math.floor(Math.random() * TRACES.length), t0: now });
        }
        state.pulses = state.pulses.filter((pulse) => now - pulse.t0 < PULSE_MS);
      }
      drawCore(toScreen, yaw, pitch, coreIn, reduce ? 1 : clamp((elapsed - BUILD_MS * 0.9) / TRACE_MS), now);

      // sinais correndo pelas arestas do tesseract
      if (built && !reduce) {
        if (now - state.lastSignal > SIGNAL_EVERY) {
          state.lastSignal = now;
          state.signals.push({ edge: EDGES[Math.floor(Math.random() * EDGES.length)], t0: now, flip: Math.random() < 0.5 });
        }
        state.signals = state.signals.filter((sig) => now - sig.t0 < SIGNAL_MS);
        state.signals.forEach((sig) => {
          const t = (now - sig.t0) / SIGNAL_MS;
          const [i, j] = sig.flip ? [sig.edge[1], sig.edge[0]] : sig.edge;
          const a = pts[i];
          const b = pts[j];
          const head = easeInOut(t);
          const tail = Math.max(0, head - 0.35);
          const fade = Math.sin(t * Math.PI);
          const from = { x: lerp(a.x, b.x, tail), y: lerp(a.y, b.y, tail) };
          const to = { x: lerp(a.x, b.x, head), y: lerp(a.y, b.y, head) };
          strokeGlow(line(from, to), fade, 1.8);
          glowDot(to.x, to.y, 2, fade);
        });
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (now) => {
      state.frame = 0;
      const { tilt } = state;
      tilt.x += (tilt.tx - tilt.x) * 0.06;
      tilt.y += (tilt.ty - tilt.y) * 0.06;
      draw(now);
      if (state.visible && state.begin && !reduce) state.frame = requestAnimationFrame(loop);
    };

    const request = () => {
      if (!state.frame && !reduce) state.frame = requestAnimationFrame(loop);
    };

    startRef.current = () => {
      if (state.begin) return;
      state.begin = performance.now();
      request();
    };

    // o cubo se inclina um pouco na direção do cursor
    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = track.getBoundingClientRect();
      state.tilt.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      state.tilt.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;
    };
    const onPointerLeave = () => {
      state.tilt.tx = 0;
      state.tilt.ty = 0;
    };

    // só anima enquanto aparece na tela
    const visibility = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) request();
    });
    visibility.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);
    resize();

    if (reduce) draw(performance.now());
    else if (playRef.current) startRef.current();

    track?.addEventListener('pointermove', onPointerMove, { passive: true });
    track?.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(state.frame);
      visibility.disconnect();
      resizeObserver.disconnect();
      track?.removeEventListener('pointermove', onPointerMove);
      track?.removeEventListener('pointerleave', onPointerLeave);
      startRef.current = null;
    };
  }, [trackRef]);

  return <canvas ref={canvasRef} className="tesseract-emblem" aria-hidden="true" />;
}

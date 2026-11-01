import { useEffect, useRef } from 'react';
import './CircuitField.css';

const DELAY_MS = 400;      // começa junto com o tesseract
const BUILD_MS = 2600;     // as trilhas se desenham da luz para fora
const TRACE_MS = 1300;     // tempo de cada trilha
const PULSE_EVERY = 170;   // ms entre sinais que saem da luz
const SPARKS = 150;
const CHIPS = 46;

// mesma escala de azuis do tesseract e do retrato
const WHITE = '217, 226, 255';
const SOFT = '134, 162, 255';
const BLUE = '74, 116, 255';
const BRAND = '0, 49, 249';

const clamp = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

// sorteio fixo: o desenho é sempre o mesmo, só muda de escala
function random(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* polilinha medida, para desenhar só um trecho dela */
function measure(points) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  return { points, lengths, total: lengths.reduce((a, b) => a + b, 0) };
}

function pointAt({ points, lengths, total }, t) {
  let left = total * clamp(t);
  for (let i = 0; i < lengths.length; i += 1) {
    if (left <= lengths[i]) {
      const k = lengths[i] ? left / lengths[i] : 0;
      return [lerp(points[i][0], points[i + 1][0], k), lerp(points[i][1], points[i + 1][1], k)];
    }
    left -= lengths[i];
  }
  return points[points.length - 1];
}

function slice(trace, from, to) {
  const { points, lengths, total } = trace;
  const a = total * clamp(from);
  const b = total * clamp(to);
  const out = [pointAt(trace, from)];
  let run = 0;
  for (let i = 0; i < lengths.length; i += 1) {
    run += lengths[i];
    if (run > a && run < b) out.push(points[i + 1]);
  }
  out.push(pointAt(trace, to));
  return out;
}

/* ---------- Placa: trilhas que saem da luz à esquerda e correm para a direita ----------
   Coordenadas em frações (x da largura, y da altura); a luz fica em (0, oy).
   spread abre o feixe na vertical (no celular ele cobre a metade de cima do hero). */
function buildBoard(oy, spread = 1) {
  const rnd = random(31);
  const traces = [];

  for (let i = 0; i < 34; i += 1) {
    const far = i % 3 === 0; // camada de trás: mais fina, mais apagada, mexe menos
    const side = rnd() < 0.5 ? -1 : 1;
    let x = rnd() * 0.12;
    let y = oy + side * Math.pow(rnd(), 1.4) * 0.38 * spread;
    const end = 0.32 + rnd() * 0.6;
    const pts = [[x, y]];
    while (x < end) {
      // trecho reto, depois uma dobra de 45° que abre o feixe (às vezes fecha)
      x = Math.min(end, x + 0.04 + rnd() * 0.12);
      pts.push([x, y]);
      if (x >= end) break;
      const dy = (0.02 + rnd() * 0.07) * (rnd() < 0.72 ? side : -side);
      x += Math.abs(dy) * 0.56; // 45° na tela (a área é ~1,8x mais larga que alta)
      y += dy;
      pts.push([x, y]);
    }
    const bus = !far && rnd() < 0.3 ? 3 : 1; // barramentos de três linhas paralelas
    const tip = rnd();
    for (let k = 0; k < bus; k += 1) {
      traces.push({
        ...measure(pts.map(([px, py]) => [px, py + k * 0.007])),
        far,
        delay: pts[0][0] * 2 + rnd() * 0.35 + k * 0.04,
        end: tip < 0.55 ? 'pad' : tip < 0.8 ? 'arrow' : null,
      });
    }
  }

  // partículas: mais densas perto da luz
  const sparks = Array.from({ length: SPARKS }, () => ({
    x: Math.pow(rnd(), 1.8) * 0.95,
    y: oy + (rnd() - 0.5) * 0.95 * (0.5 + rnd()) * spread,
    r: 0.5 + Math.pow(rnd(), 3) * 2.2,
    phase: rnd() * Math.PI * 2,
    speed: 0.6 + rnd() * 1.6,
    far: rnd() < 0.5,
  }));

  // placas de vidro quadradas, quase invisíveis, que dão o fundo de profundidade
  const chips = Array.from({ length: CHIPS }, () => ({
    x: Math.pow(rnd(), 1.5) * 0.7,
    y: oy + (rnd() - 0.5) * 0.9 * spread,
    s: 0.008 + rnd() * 0.03,
    a: 0.03 + rnd() * 0.07,
    phase: rnd() * Math.PI * 2,
  }));

  // setas »»»» e fileiras de quadradinhos, acesas em sequência
  const marks = Array.from({ length: 7 }, (_, i) => ({
    x: 0.08 + rnd() * 0.5,
    y: oy + (rnd() - 0.5) * 0.6 * spread,
    kind: i % 2 ? 'dash' : 'chevron',
    phase: rnd(),
  }));

  return { oy, traces, sparks, chips, marks };
}

/**
 * Fundo de circuitos atrás do tesseract (referência: placa de circuito com
 * profundidade, girada 180°): a luz fica à esquerda e as trilhas correm para
 * a direita até sumir. Elas se desenham junto com a montagem do tesseract e
 * depois recebem sinais que saem da luz, como os das arestas do tesseract.
 * Duas camadas com parallax no cursor dão a profundidade.
 */
export default function CircuitField({ play, trackRef, anchorRef }) {
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
      w: 0,
      h: 0,
      dpr: 1,
      board: null,
      begin: 0,
      visible: true,
      frame: 0,
      pulses: [],
      lastPulse: 0,
      hole: null,     // centro e raio do tesseract, em px
      full: false,    // cobre o hero inteiro (sem o tesseract)
      hits: new Map(), // trilha → hora em que um sinal chegou na ponta
      shift: { x: 0, y: 0, tx: 0, ty: 0 },
    };

    const covered = () => track?.classList.contains('is-covered');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = Math.round(rect.width * state.dpr);
      canvas.height = Math.round(rect.height * state.dpr);
      // a luz nasce na altura do meio do tesseract
      const anchor = anchorRef?.current?.getBoundingClientRect();
      const ok = anchor && anchor.height && rect.width && rect.height;
      // sem o tesseract (tablet e celular), a placa vira fundo da metade de cima do hero
      state.full = !ok;
      const oy = ok ? (anchor.top + anchor.height / 2 - rect.top) / rect.height : 0.27;
      state.hole = ok
        ? { x: anchor.left + anchor.width / 2 - rect.left, y: anchor.top + anchor.height / 2 - rect.top, r: anchor.width * 0.5 }
        : null;
      state.board = buildBoard(oy, state.full ? 0.8 : 1);
    };

    /* ---------- Desenho ---------- */
    const pathOf = (points) => {
      const { w, h } = state;
      const path = new Path2D();
      points.forEach(([x, y], i) => (i ? path.lineTo(x * w, y * h) : path.moveTo(x * w, y * h)));
      return path;
    };

    const glowDot = (x, y, r, alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      g.addColorStop(0, `rgba(${WHITE}, ${alpha})`);
      g.addColorStop(0.25, `rgba(${SOFT}, ${alpha * 0.45})`);
      g.addColorStop(1, `rgba(${BLUE}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTrace = (trace, grown, now) => {
      const { w, h } = state;
      const pts = slice(trace, 0, grown);
      const path = pathOf(pts);
      const base = trace.far ? 0.22 : 0.42;
      ctx.strokeStyle = `rgba(${BLUE}, ${base * 0.35})`;
      ctx.lineWidth = trace.far ? 2.4 : 3.6;
      ctx.stroke(path);
      ctx.strokeStyle = `rgba(${SOFT}, ${base})`;
      ctx.lineWidth = trace.far ? 0.7 : 1.1;
      ctx.stroke(path);

      // ponta: terminal redondo ou seta, que acende quando um sinal chega
      if (grown < 1 || !trace.end) return;
      const [ex, ey] = trace.points[trace.points.length - 1];
      const hit = state.hits.get(trace);
      const flash = hit ? clamp(1 - (now - hit) / 600) : 0;
      const a = (trace.far ? 0.35 : 0.7) + flash * 0.3;
      if (trace.end === 'pad') {
        glowDot(ex * w, ey * h, trace.far ? 1 : 1.6, a);
      } else {
        const s = trace.far ? 4 : 6;
        ctx.fillStyle = `rgba(${SOFT}, ${a})`;
        ctx.beginPath();
        ctx.moveTo(ex * w + s, ey * h);
        ctx.lineTo(ex * w - s * 0.4, ey * h - s * 0.75);
        ctx.lineTo(ex * w - s * 0.4, ey * h + s * 0.75);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawMark = (mark, t, alpha) => {
      const { w, h } = state;
      const x = mark.x * w;
      const y = mark.y * h;
      for (let i = 0; i < 5; i += 1) {
        // a luz corre da esquerda para a direita, como os sinais
        const lit = 0.25 + 0.75 * Math.max(0, Math.sin((t * 0.0016 + mark.phase) * Math.PI * 2 - i * 0.7));
        ctx.globalAlpha = alpha * lit;
        if (mark.kind === 'chevron') {
          const cx = x + i * 7;
          ctx.strokeStyle = `rgba(${SOFT}, 0.8)`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(cx, y - 6);
          ctx.lineTo(cx + 5, y);
          ctx.lineTo(cx, y + 6);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${SOFT}, 0.8)`;
          ctx.fillRect(x + i * 9, y - 2.5, 6, 5);
        }
      }
      ctx.globalAlpha = 1;
    };

    // camada da frente mexe mais que a de trás: é isso que dá a profundidade
    const layer = (far) => {
      const { shift, dpr } = state;
      const k = far ? 6 : 16;
      ctx.setTransform(dpr, 0, 0, dpr, shift.x * k * dpr, shift.y * k * dpr);
    };

    const draw = (now) => {
      const { w, h, dpr, board } = state;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!board || (!state.begin && !reduce)) return;

      const elapsed = reduce ? Infinity : now - state.begin - DELAY_MS;
      const intro = clamp(elapsed / (BUILD_MS + TRACE_MS));
      const t = reduce ? 0 : now;

      // a luz de onde tudo sai, à esquerda, na altura do tesseract
      const lightY = board.oy * h;
      const light = ctx.createRadialGradient(0, lightY, 0, 0, lightY, w * 0.75);
      light.addColorStop(0, `rgba(${BLUE}, ${0.45 * easeOut(intro)})`);
      light.addColorStop(0.35, `rgba(${BRAND}, ${0.14 * easeOut(intro)})`);
      light.addColorStop(1, `rgba(${BRAND}, 0)`);
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // placas de vidro (bem ao fundo)
      layer(true);
      board.chips.forEach((chip) => {
        const blink = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * 0.0009 + chip.phase);
        ctx.fillStyle = `rgba(${BLUE}, ${chip.a * blink * intro})`;
        const s = chip.s * w;
        ctx.fillRect(chip.x * w, chip.y * h - s / 2, s, s);
      });

      // trilhas: crescem da luz para fora, a de trás primeiro
      [true, false].forEach((far) => {
        layer(far);
        board.traces.forEach((trace) => {
          if (trace.far !== far) return;
          const grown = reduce ? 1 : easeOut(clamp((elapsed - trace.delay * (BUILD_MS / 2.3)) / TRACE_MS));
          if (grown > 0) drawTrace(trace, grown, now);
        });
      });

      // partículas piscando
      board.sparks.forEach((spark) => {
        layer(spark.far);
        const tw = reduce ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(t * 0.001 * spark.speed + spark.phase));
        const a = tw * intro * (spark.far ? 0.5 : 0.85);
        if (spark.r > 1.6) glowDot(spark.x * w, spark.y * h, spark.r * 0.6, a);
        else {
          ctx.fillStyle = `rgba(${WHITE}, ${a * 0.8})`;
          ctx.fillRect(spark.x * w, spark.y * h, spark.r, spark.r);
        }
      });

      layer(false);
      board.marks.forEach((mark) => drawMark(mark, t, intro * 0.8));

      // sinais saindo da luz pelas trilhas, como nas arestas do tesseract
      state.pulses.forEach((pulse) => {
        layer(pulse.trace.far);
        const p = (now - pulse.t0) / pulse.ms;
        const head = easeOut(p);
        const tail = Math.max(0, head - 0.12);
        const fade = Math.sin(clamp(p) * Math.PI) * (pulse.trace.far ? 0.6 : 1);
        const path = pathOf(slice(pulse.trace, tail, head));
        ctx.strokeStyle = `rgba(${WHITE}, ${0.8 * fade})`;
        ctx.lineWidth = pulse.trace.far ? 1 : 1.6;
        ctx.stroke(path);
        const [hx, hy] = pointAt(pulse.trace, head);
        glowDot(hx * w, hy * h, pulse.trace.far ? 1.2 : 1.8, fade);
      });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // respiro escuro atrás do tesseract: as trilhas passam por trás dele, não por cima
      if (state.hole) {
        const { x, y, r } = state.hole;
        ctx.globalCompositeOperation = 'destination-out';
        const hole = ctx.createRadialGradient(x, y, 0, x, y, r);
        hole.addColorStop(0, 'rgba(0,0,0,0.85)');
        hole.addColorStop(0.6, 'rgba(0,0,0,0.6)');
        hole.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hole;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // some para a direita (antes do retrato), no topo (menu) e embaixo (título)
      ctx.globalCompositeOperation = 'destination-in';
      const fadeX = ctx.createLinearGradient(0, 0, w, 0);
      fadeX.addColorStop(0, 'rgba(0,0,0,1)');
      fadeX.addColorStop(0.45, 'rgba(0,0,0,0.9)');
      fadeX.addColorStop(1, `rgba(0,0,0,${state.full ? 0.35 : 0})`);
      ctx.fillStyle = fadeX;
      ctx.fillRect(0, 0, w, h);
      const fadeY = ctx.createLinearGradient(0, 0, 0, h);
      fadeY.addColorStop(0.06, 'rgba(0,0,0,0)');
      fadeY.addColorStop(state.full ? 0.12 : 0.2, 'rgba(0,0,0,1)');
      fadeY.addColorStop(state.full ? 0.36 : 0.55, 'rgba(0,0,0,1)');
      fadeY.addColorStop(state.full ? 0.5 : 0.78, 'rgba(0,0,0,0)');
      ctx.fillStyle = fadeY;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (now) => {
      state.frame = 0;
      if (!state.visible || document.hidden || covered()) return;
      const { shift, board } = state;
      shift.x += (shift.tx - shift.x) * 0.05;
      shift.y += (shift.ty - shift.y) * 0.05;

      if (board && now - state.begin > DELAY_MS + BUILD_MS && now - state.lastPulse > PULSE_EVERY) {
        state.lastPulse = now;
        const trace = board.traces[Math.floor(Math.random() * board.traces.length)];
        state.pulses.push({ trace, t0: now, ms: 1400 + trace.total * 1800 });
      }
      state.pulses = state.pulses.filter((pulse) => {
        if (now - pulse.t0 < pulse.ms) return true;
        state.hits.set(pulse.trace, now);
        return false;
      });

      draw(now);
      state.frame = requestAnimationFrame(loop);
    };

    const request = () => {
      if (!state.frame && !reduce && state.begin) state.frame = requestAnimationFrame(loop);
    };

    startRef.current = () => {
      if (state.begin) return;
      state.begin = performance.now();
      request();
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = track.getBoundingClientRect();
      state.shift.tx = ((event.clientX - rect.left) / rect.width - 0.5) * -1;
      state.shift.ty = ((event.clientY - rect.top) / rect.height - 0.5) * -1;
    };
    const onPointerLeave = () => {
      state.shift.tx = 0;
      state.shift.ty = 0;
    };

    const visibility = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) request();
    });
    visibility.observe(canvas);

    // volta a animar quando a aba reaparece ou o hero é descoberto
    const onWake = () => request();
    const coverWatch = track ? new MutationObserver(onWake) : null;
    coverWatch?.observe(track, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', onWake);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);
    // o tesseract carrega depois: quando ele ganha altura, a luz se realinha
    if (anchorRef?.current) resizeObserver.observe(anchorRef.current);
    resize();

    if (reduce) draw(performance.now());
    else if (playRef.current) startRef.current();

    track?.addEventListener('pointermove', onPointerMove, { passive: true });
    track?.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(state.frame);
      visibility.disconnect();
      resizeObserver.disconnect();
      coverWatch?.disconnect();
      document.removeEventListener('visibilitychange', onWake);
      track?.removeEventListener('pointermove', onPointerMove);
      track?.removeEventListener('pointerleave', onPointerLeave);
      startRef.current = null;
    };
  }, [trackRef, anchorRef]);

  return <canvas ref={canvasRef} className="circuit-field" aria-hidden="true" />;
}

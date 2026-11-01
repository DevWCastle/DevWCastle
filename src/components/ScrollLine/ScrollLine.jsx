import { useEffect, useRef, useState } from 'react';
import { sections } from '../../data/site';
import './ScrollLine.css';

const SAMPLES = 480;   // pontos amostrados do traçado para achar o comprimento por altura
const BEND = 170;      // altura das curvas que levam da margem ao centro
const READ_LINE = 0.62; // a cabeça da linha acompanha 62% da altura da tela

/**
 * Linha que acompanha a rolagem (referência: trek.cards). Um traço fino desce
 * pelas margens, alternando os lados, e cruza o centro em cada fronteira
 * entre seções, onde deixa um nó. É desenhado até a altura de leitura,
 * com um ponto luminoso na cabeça. Decorativo: fica fora da árvore de
 * acessibilidade. Com movimento reduzido, aparece inteiro e sem a cabeça.
 */
export default function ScrollLine() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const headRef = useRef(null);
  const [geo, setGeo] = useState({ d: '', width: 0, height: 0, nodes: [] });

  /* ---------- Geometria: recalculada quando o layout muda ---------- */
  useEffect(() => {
    const main = svgRef.current?.parentElement;
    if (!main) return undefined;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const mainRect = main.getBoundingClientRect();
      const wrap = main.querySelector('.w');
      const width = main.clientWidth;
      const contentLeft = wrap
        ? wrap.getBoundingClientRect().left - mainRect.left + parseFloat(getComputedStyle(wrap).paddingLeft)
        : 24;
      const xLeft = Math.max(8, contentLeft / 2);
      const xRight = width - xLeft;
      const cx = width / 2;

      const tops = sections
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean)
        .map((el) => ({ top: el.getBoundingClientRect().top - mainRect.top, el }));
      if (tops.length < 2) return;

      const last = tops[tops.length - 1];
      const endY = last.top + last.el.offsetHeight * 0.55;
      let d = `M ${cx} ${tops[0].top}`;
      const nodes = [];

      tops.forEach((section, i) => {
        const side = i % 2 === 0 ? xLeft : xRight;
        const y = section.top;
        const nextY = i < tops.length - 1 ? tops[i + 1].top : endY;
        const bend = Math.min(BEND, (nextY - y) / 3);
        // do centro da fronteira até a margem…
        d += ` C ${cx} ${y + bend * 0.6}, ${side} ${y + bend * 0.4}, ${side} ${y + bend}`;
        if (i < tops.length - 1) {
          // …desce pela margem e volta ao centro da próxima fronteira
          d += ` L ${side} ${nextY - bend}`;
          d += ` C ${side} ${nextY - bend * 0.4}, ${cx} ${nextY - bend * 0.6}, ${cx} ${nextY}`;
          nodes.push({ x: cx, y: nextY });
        } else {
          d += ` L ${side} ${endY}`;
        }
      });

      setGeo({ d, width, height: main.scrollHeight, nodes });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(main);
    window.addEventListener('resize', schedule, { passive: true });
    document.fonts?.ready.then(schedule);
    schedule();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* ---------- Progresso: comprimento desenhado até a altura de leitura ---------- */
  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg || !geo.d) return undefined;

    const total = path.getTotalLength();
    const ys = new Float32Array(SAMPLES + 1);
    const pts = [];
    for (let i = 0; i <= SAMPLES; i += 1) {
      const p = path.getPointAtLength((i / SAMPLES) * total);
      ys[i] = p.y;
      pts.push(p);
    }
    path.style.strokeDasharray = `${total}`;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      path.style.strokeDashoffset = '0';
      svg.classList.add('is-static');
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = svg.getBoundingClientRect().top;
      const target = window.innerHeight * READ_LINE - top;
      // busca binária: o traçado sempre desce, então y cresce com o comprimento
      let lo = 0;
      let hi = SAMPLES;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      const i = Math.max(0, Math.min(SAMPLES, lo));
      const length = (i / SAMPLES) * total;
      path.style.strokeDashoffset = `${total - length}`;
      const p = pts[i];
      headRef.current?.setAttribute('transform', `translate(${p.x} ${p.y})`);
      svg.classList.toggle('is-started', length > 2);
      svg.querySelectorAll('.scroll-line__node').forEach((node) => {
        node.classList.toggle('is-on', Number(node.dataset.y) <= p.y + 1);
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [geo]);

  return (
    <svg
      ref={svgRef}
      className="scroll-line"
      width={geo.width}
      height={geo.height}
      viewBox={`0 0 ${geo.width || 1} ${geo.height || 1}`}
      aria-hidden="true"
      focusable="false"
    >
      <path ref={pathRef} className="scroll-line__path" d={geo.d} />
      {geo.nodes.map((node) => (
        <circle
          key={node.y}
          className="scroll-line__node"
          data-y={node.y}
          cx={node.x}
          cy={node.y}
          r="4"
        />
      ))}
      <g ref={headRef} className="scroll-line__head">
        <circle r="12" className="scroll-line__glow" />
        <circle r="3.5" className="scroll-line__dot" />
      </g>
    </svg>
  );
}

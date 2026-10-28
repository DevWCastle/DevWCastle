import React, { useState, useEffect, useRef } from 'react';
import './Projects.css';

const projectsData = [
  {
    k: "SISTEMA PARA ESCOLAS TÉCNICAS",
    t: "CBPatio — plataforma de campeonatos",
    d: "Aplicação cliente para divulgação e inscrição nos campeonatos do evento: campeonatos em destaque, times, classificação e busca de jogadores.",
    tech: ["Vite", "SQL", "Vercel", "Selenium"],
    demo: "#",
    code: "#",
    vis: "device",
    label: "CBPATIO",
    note: "trocar pelo print real"
  },
  // {
  //   k: "AUTOMAÇÃO INDUSTRIAL",
  //   t: "Permissões com reconhecimento facial",
  //   d: "Controle de permissões de usuários com reconhecimento facial, usando Raspberry Pi e CLP.",
  //   tech: ["Raspberry Pi", "CLP"],
  //   code: "#",
  //   vis: "nodes",
  //   nodes: ["Raspberry Pi", "CLP", "Reconhecimento facial"]
  // },
  // {
  //   k: "REPOSITÓRIO",
  //   t: "Automação para SMEs",
  //   d: "Projeto de automação para pequenas e médias empresas. Descrição e link serão atualizados.",
  //   tech: ["Automação"],
  //   vis: "nodes",
  //   nodes: ["Automação", "SMEs"]
  // }
];

export default function Projects() {
  const [cur, setCur] = useState(0);
  const [direction, setDirection] = useState(1);
  const [outIndex, setOutIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ mx: 0, my: 0 });

  const stageRef = useRef(null);
  const pointerXRef = useRef(null);

  const pad = (n) => String(n).padStart(2, "0");

  const go = (n, dir) => {
    const nextIndex = (n + projectsData.length) % projectsData.length;
    if (nextIndex === cur) return;

    setDirection(dir);
    setOutIndex(cur);
    setCur(nextIndex);

    setTimeout(() => {
      setOutIndex(null);
    }, 650);
  };

  const handleNext = () => go(cur + 1, 1);
  const handlePrev = () => go(cur - 1, -1);

  const handleDotClick = (i) => {
    go(i, i > cur ? 1 : -1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      handleNext();
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      handlePrev();
      e.preventDefault();
    }
  };

  const handlePointerDown = (e) => {
    pointerXRef.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (pointerXRef.current !== null && Math.abs(e.clientX - pointerXRef.current) > 50) {
      if (e.clientX < pointerXRef.current) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    pointerXRef.current = null;
  };

  const handleMouseMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;

    if (stageRef.current) {
      const r = stageRef.current.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * -2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * -2;
      setMousePos({ mx, my });
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ mx: 0, my: 0 });
  };

  return (
    <section className="sheet gray projects-sheet" id="projetos">
      <div className="w">
        <div className="lbl">PROJETOS</div>
        <h2 >Projetos <em>selecionados</em></h2>

        <div className="car" id="car" aria-roledescription="carrossel" aria-label="Projetos em destaque">
          <div
            className="stage"
            id="stage"
            tabIndex="0"
            aria-live="polite"
            ref={stageRef}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              '--dir': direction,
              '--mx': mousePos.mx,
              '--my': mousePos.my
            }}
          >
            {projectsData.map((p, i) => {
              const isOn = i === cur;
              const isOut = i === outIndex;
              const isVisible = isOn || isOut;

              return (
                <article
                  key={i}
                  className={`sl ${isOn ? 'on' : ''} ${isOut ? 'out' : ''}`}
                  data-i={i}
                  aria-hidden={!isOn}
                  style={{ visibility: isVisible ? 'visible' : 'hidden' }}
                >
                  <div className="ly grid" style={{ '--d': 0.2 }}>
                    <div></div>
                  </div>

                  <svg
                    className="lines ly"
                    style={{ '--d': 0.3 }}
                    viewBox="0 0 1200 620"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                    stroke="#1E6BFF"
                    strokeWidth="1.5"
                  >
                    <g>
                      <path d="M1200 90H960l-80 70" />
                      <circle cx="880" cy="160" r="4" fill="#1E6BFF" />
                      <path d="M1200 540H900l-110 80" opacity=".7" />
                      <path d="M480 20l90 90h140" />
                    </g>
                  </svg>

                  <div className="ly ring" style={{ '--d': 0.5 }}>
                    <div></div>
                  </div>

                  <div className="ly dev" style={{ '--d': 1 }}>
                    {p.vis === "device" ? (
                      <div className="lap">
                        {p.label}
                        <small>{p.note || ""}</small>
                      </div>
                    ) : (
                      <div className="nodes">
                        {p.nodes && p.nodes.map((n, idx) => (
                          <span key={idx}>{n}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {p.tech[0] && (
                    <div className="ly chip c1" style={{ '--d': 1.5 }}>
                      <span>{p.tech[0]}</span>
                    </div>
                  )}
                  {p.tech[1] && (
                    <div className="ly chip c2" style={{ '--d': 1.3 }}>
                      <span>{p.tech[1]}</span>
                    </div>
                  )}

                  <div className="panel">
                    <small>{p.k}</small>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                    <div className="tg">
                      {p.tech.map((x, idx) => (
                        <span key={idx}>{x}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {p.demo && (
                        <a className="btn p" href={p.demo}>Demo ao vivo ↗</a>
                      )}
                      {p.code && (
                        <a className="btn dk" href={p.code}>Código ↗</a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="ctl">
            <button className="ar" onClick={handlePrev} aria-label="Projeto anterior">←</button>
            <span className="cnt">
              {pad(cur + 1)} / {pad(projectsData.length)}
            </span>
            <button className="ar" onClick={handleNext} aria-label="Próximo projeto">→</button>
            <div className="dots">
              {projectsData.map((p, i) => (
                <button
                  key={i}
                  aria-label={`Ir para ${p.t}`}
                  className={i === cur ? 'on' : ''}
                  onClick={() => handleDotClick(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
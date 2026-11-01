import { useRef, useState } from 'react';
import { projects } from '../../data/projects';
import cbpatioHome from '../../assets/cbpatio-home.jpg';
import ProjectCard from '../ProjectCard/ProjectCard';
import CarouselControls from '../CarouselControls/CarouselControls';
import InlineShot from '../InlineShot/InlineShot';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import './Projects.css';

const visibleProjects = projects.filter((project) => !project.draft);
const SWIPE_MIN = 48;

/**
 * Palco de projetos: faixas que se expandem (formato do "carousel 2"), com a
 * mídia de cada projeto numa roda vertical em 3D (animação do "carousel 1").
 * Setas, índice com títulos, arrastar (mouse ou toque) e teclado.
 * A seção sobe por cima do hero fixo e a mídia tem parallax de rolagem.
 */
export default function Projects() {
  const [current, setCurrent] = useState(0);
  const pointerStart = useRef(null);
  const stageRef = useRef(null);
  const total = visibleProjects.length;
  useScrollParallax(stageRef);

  const go = (index) => setCurrent((index + total) % total);
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    }
  };

  const onPointerDown = (event) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) next();
      else prev();
    }
  };

  const active = visibleProjects[current];

  return (
    <section className="section section--paper projects" id="projetos" aria-labelledby="projetos-title">
      <div className="w projects__head">
        <h2 className="section__title rv" id="projetos-title">
         Projetos  <em>selecionados</em>   {/*<InlineShot src={cbpatioHome} position="30% 40%" /> */}
        </h2>
        <p className="projects__intro rv" style={{ '--d': '120ms' }}>
          Código aberto, arquitetura descrita e links para conferir cada decisão.
        </p>
        <CarouselControls
          current={current}
          total={total}
          onPrev={prev}
          onNext={next}
          onSelect={go}
          labels={visibleProjects.map((project) => project.label)}
        />
      </div>

      <div className="w">
        <div
          ref={stageRef}
          className="projects__stage rv"
          style={{ '--n': total, '--d': '200ms' }}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Projetos selecionados"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { pointerStart.current = null; }}
        >
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={total}
              isActive={index === current}
              onSelect={go}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Projeto ${current + 1} de ${total}: ${active.label}`}
      </p>
    </section>
  );
}

import { useRef, useState } from 'react';
import { projects } from '../../data/projects';
import ProjectCard from '../ProjectCard/ProjectCard';
import CarouselControls from '../CarouselControls/CarouselControls';
import './Projects.css';

const visibleProjects = projects.filter((project) => !project.draft);
const SWIPE_MIN = 48;

/**
 * Carrossel largo: o projeto ativo ocupa a largura e o próximo aparece
 * na borda. Setas, bolinhas, arrastar (mouse ou toque) e teclado.
 */
export default function Projects() {
  const [current, setCurrent] = useState(0);
  const pointerStart = useRef(null);
  const total = visibleProjects.length;

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
        <h2 className="section__title" id="projetos-title">
          Projetos <em>selecionados</em>
        </h2>
        <p className="projects__intro">
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

      <div
        className="projects__viewport"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Projetos selecionados"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <div className="projects__track" style={{ '--index': current }}>
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

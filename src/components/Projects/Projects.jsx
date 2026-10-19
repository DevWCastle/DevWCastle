import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import CarouselControls from '../CarouselControls/CarouselControls';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import { projects } from '../../data/projects';
import './Projects.css';

const SWIPE_THRESHOLD = 50;

function Projects() {
  const [current, setCurrent] = useState(0);
  const [stageHeight, setStageHeight] = useState(undefined);
  const sectionRef = useRef(null);
  const slideRefs = useRef([]);
  const swipeStartX = useRef(null);

  const total = projects.length;
  const half = Math.floor(total / 2);

  useRevealOnScroll(sectionRef);

  const goTo = useCallback((index) => setCurrent((index + total) % total), [total]);

  // posição relativa ao slide ativo: 0 (centro), 1 (direita), -1 (esquerda)...
  const positionOf = (index) => ((index - current + total + half) % total) - half;

  // os slides são absolutos, então a altura do palco acompanha o slide ativo
  const updateHeight = useCallback(() => {
    const active = slideRefs.current[current];
    if (active) setStageHeight(active.offsetHeight);
  }, [current]);

  useLayoutEffect(updateHeight, [updateHeight]);

  useEffect(() => {
    window.addEventListener('resize', updateHeight);
    window.addEventListener('load', updateHeight);
    if (document.fonts) document.fonts.ready.then(updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('load', updateHeight);
    };
  }, [updateHeight]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(current + 1);
    }
  };

  const handlePointerUp = (event) => {
    if (swipeStartX.current === null) return;
    const delta = event.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) goTo(current + (delta < 0 ? 1 : -1));
  };

  return (
    <section ref={sectionRef} className="wrap projects" id="projetos" aria-labelledby="projects-title">
      <div className="projects__grid" aria-hidden="true" />
      <div className="projects__blob projects__blob--a" aria-hidden="true" />
      <div className="projects__blob projects__blob--b" aria-hidden="true" />

      <div className="projects__wrap">
        <p className="mono projects__kicker rv">Portfólio</p>
        <h2 id="projects-title" className="projects__title rv">
          Projetos em <span className="projects__highlight">destaque</span>
        </h2>
        <p className="projects__sub rv">
          Sistemas que saíram do papel: do hardware industrial ao deploy. Use as setas, arraste ou
          toque nos cards laterais.
        </p>
      </div>

      <div className="projects__wrap">
        <div
          className="rv"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Projetos em destaque"
        >
          <div
            className="projects__view"
            tabIndex={0}
            aria-label="Carrossel de projetos. Use as setas do teclado para navegar."
            onKeyDown={handleKeyDown}
            onPointerDown={(event) => {
              swipeStartX.current = event.clientX;
            }}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              swipeStartX.current = null;
            }}
          >
            <div className="projects__stage" style={{ height: stageHeight }}>
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  ref={(element) => {
                    slideRefs.current[index] = element;
                  }}
                  project={project}
                  index={index}
                  total={total}
                  position={positionOf(index)}
                  onSelect={goTo}
                />
              ))}
            </div>
          </div>

          <CarouselControls
            current={current}
            total={total}
            onPrev={() => goTo(current - 1)}
            onNext={() => goTo(current + 1)}
            onSelect={goTo}
          />
          <p className="sr" aria-live="polite">{`Projeto ${current + 1} de ${total}`}</p>
        </div>
      </div>
    </section>
  );
}

export default Projects;

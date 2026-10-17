import { forwardRef } from 'react';
import ProjectDiagram from '../ProjectDiagram/ProjectDiagram';
import ScreenshotStack from '../ScreenshotStack/ScreenshotStack';
import './ProjectCard.css';

/**
 * Slide do carrossel. `position` é 0 para o ativo e ±1 para os vizinhos.
 * Os vizinhos ficam fora da navegação por teclado e do leitor de tela;
 * clicar neles seleciona o projeto.
 */
const ProjectCard = forwardRef(function ProjectCard(
  { project, index, total, position, onSelect },
  ref
) {
  const isActive = position === 0;
  const { media } = project;
  const tabIndex = isActive ? 0 : -1;

  return (
    <article
      ref={ref}
      className={`project-slide${isActive ? ' is-active' : ''}`}
      data-pos={position}
      aria-hidden={!isActive}
      aria-label={`${index + 1} de ${total}: ${project.label}`}
      onClick={() => {
        if (!isActive) onSelect(index);
      }}
    >
      <div className="project-card">
        <div className={`project-media${media.type === 'screens' ? ' project-media--screens' : ''}`}>
          <span className="project-num mono">{String(index + 1).padStart(2, '0')}</span>

          {media.type === 'screens' ? (
            <ScreenshotStack screens={media.screens} active={isActive} />
          ) : (
            <>
              <ProjectDiagram
                nodes={media.nodes}
                edges={media.edges}
                dashed={media.dashed}
                label={media.label}
              />
              <span className="project-cap mono">Diagrama de arquitetura</span>
            </>
          )}
        </div>

        <div className="project-body">
          <p className="project-cat mono" style={{ '--i': 0 }}>{project.category}</p>
          <h3 className="project-title" style={{ '--i': 1 }}>{project.title}</h3>
          <p className="project-desc" style={{ '--i': 2 }}>{project.description}</p>
          <div className="project-tags mono" style={{ '--i': 3 }}>
            {project.tags.map((tag) => (
              <span className="project-tag" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-actions" style={{ '--i': 4 }}>
            {project.links.map((link) => (
              <a
                key={link.href + link.label}
                className={`project-btn${link.primary ? ' project-btn--primary' : ''}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tabIndex}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
});

export default ProjectCard;

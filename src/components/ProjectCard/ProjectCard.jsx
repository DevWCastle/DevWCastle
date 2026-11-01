import { useRef } from 'react';
import Icon from '../Icon/Icon';
import ProjectDiagram from '../ProjectDiagram/ProjectDiagram';
import ScreenshotStack from '../ScreenshotStack/ScreenshotStack';
import './ProjectCard.css';

/**
 * Slide do carrossel. O inativo fica fora do teclado e do leitor de tela
 * (inert) e, ao ser clicado, vira o ativo. A mídia ganha um parallax leve
 * com o mouse, escrito direto em variáveis CSS (sem re-render).
 */
export default function ProjectCard({ project, index, total, isActive, onSelect }) {
  const mediaRef = useRef(null);
  const { media } = project;

  const onPointerMove = (event) => {
    if (!isActive || event.pointerType !== 'mouse') return;
    const el = mediaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    el.style.setProperty('--my', ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };

  const onPointerLeave = () => {
    mediaRef.current?.style.setProperty('--mx', '0');
    mediaRef.current?.style.setProperty('--my', '0');
  };

  return (
    <article
      className={`project${isActive ? ' is-active' : ''}`}
      aria-label={`${index + 1} de ${total}: ${project.label}`}
      onClick={isActive ? undefined : () => onSelect(index)}
    >
      {/* inert nos filhos, não no article: o clique no slide vizinho ainda chega aqui */}
      <div
        ref={mediaRef}
        inert={!isActive}
        className={`project__media cut project__media--${media.type}`}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {media.type === 'screens' ? (
          <ScreenshotStack screens={media.screens} active={isActive} />
        ) : (
          <ProjectDiagram
            nodes={media.nodes}
            edges={media.edges}
            dashed={media.dashed}
            label={media.label}
          />
        )}
      </div>

      <div className="project__body" inert={!isActive}>
        <p className="project__cat">{project.category}</p>
        <h3 className="project__title">{project.title}</h3>
        <p className="project__desc">{project.description}</p>

        <ul className="project__tags" aria-label="Tecnologias">
          {project.tags.map((tag) => (
            <li key={tag} className="data">{tag}</li>
          ))}
        </ul>

        <div className="project__actions">
          {project.links.map((link) => (
            <a
              key={link.href + link.label}
              className={`btn ${link.primary ? 'btn--primary' : 'btn--outline-ink'}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <Icon name="arrow-up-right" size={16} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

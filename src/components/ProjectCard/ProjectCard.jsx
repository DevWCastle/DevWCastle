import { useRef } from 'react';
import Icon from '../Icon/Icon';
import ProjectDiagram from '../ProjectDiagram/ProjectDiagram';
import ScreenshotStack from '../ScreenshotStack/ScreenshotStack';
import './ProjectCard.css';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Faixa do palco de projetos (formato do "carousel 2"): fechada, vira uma
 * tira com rótulo vertical e é um botão que abre o projeto; aberta, ocupa
 * o palco com a ficha à esquerda e a mídia numa roda vertical em 3D à
 * direita (animação do "carousel 1"). A mídia tem parallax de mouse
 * (variáveis CSS, sem re-render) e de rolagem (--sy, escrito pelo palco).
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
      className={`project project--${media.type}${isActive ? ' is-active' : ''}`}
      aria-label={`${index + 1} de ${total}: ${project.label}`}
      style={media.type === 'screens' ? { '--strip-img': `url(${media.screens[0].src})` } : undefined}
    >
      {/* Tira fechada: o próprio botão de abrir */}
      <button
        type="button"
        className="project__strip"
        onClick={() => onSelect(index)}
        hidden={isActive}
        aria-label={`Abrir projeto ${index + 1}: ${project.label}`}
      >
        <span className="project__strip-num data">{pad(index + 1)}</span>
        <span className="project__strip-label">{project.label}</span>
        <Icon name="arrow-right" size={18} />
      </button>

      <div className="project__panel" inert={!isActive}>
        <div className="project__body">
          <p className="project__cat">
            <span className="data">{pad(index + 1)} / {pad(total)}</span>
            {project.category}
          </p>
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
                className={`btn ${link.primary ? 'btn--light' : 'btn--outline'}`}
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

        <div
          ref={mediaRef}
          className="project__media"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div className="project__wheel">
            {media.type === 'screens' ? (
              <ScreenshotStack screens={media.screens} active={isActive} />
            ) : (
              <div className="project__wheel-item is-front">
                <ProjectDiagram
                  nodes={media.nodes}
                  edges={media.edges}
                  dashed={media.dashed}
                  label={media.label}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

import { useState, useEffect } from 'react';
import profileImg from '../../assets/profile.jpg';
import './Hero.css';

// Lista de frases dinâmicas configuráveis
const TYPING_PHRASES = [
  "desenvolver aplicações e APIs robustas",
  "integrar sistemas, serviços e dados",
  "conectar software ao mundo físico",
  "automatizar processos e operações",
  "construir soluções Full Stack"
];

// Configurações de velocidade (ms)
const TYPING_SPEED = 55;
const DELETING_SPEED = 30;
const PAUSE_COMPLETE = 1800;
const PAUSE_BETWEEN = 300;

export default function Hero() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = TYPING_PHRASES[currentPhraseIndex];
    let timeout;

    if (!isDeleting) {
      // Etapa de digitação
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.substring(0, displayedText.length + 1));
        }, TYPING_SPEED);
      } else {
        // Pausa quando a frase estiver completa
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_COMPLETE);
      }
    } else {
      // Etapa de exclusão/apagamento
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.substring(0, displayedText.length - 1));
        }, DELETING_SPEED);
      } else {
        // Alterna para a próxima frase após apagar
        setIsDeleting(false);
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % TYPING_PHRASES.length);
        timeout = setTimeout(() => {}, PAUSE_BETWEEN);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  return (
    <main id="inicio" className="hero-section">
      {/* Padrões sutis de fundo (Grid/Matrix & Circuitos) */}
      <div className="bg-matrix-pattern" aria-hidden="true" />

      <div className="hero">
        {/* Lado Esquerdo: Conteúdo Principal */}
        <div className="hero-content">
          {/* Brand/Logo com Ícone de Castelo */}
          <div className="brand-badge">
            <span className="castle-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 22h20V10l-3-3v3h-2V7l-3-3-3 3v3H9V7L6 10v3H4V7L1 10v12zm4-10h2v10H6V12zm5-3h2v13h-2V9zm5 3h2v10h-2V12z" />
              </svg>
              <i>&lt;/&gt;</i>
            </span>
            <span className="logo-hero" aria-label="DevWCastle — início">
              <i className="destaque">DEvW</i>Castle
            </span>
          </div>

          {/* Título de Alto Impacto (Sólido + Stroke) */}
          <h1 className="hero-title">
            DO CÓDIGO AO <br />
            <span className="stroke-lime">IMPACTO REAL</span>
          </h1>

          {/* Descrição com Efeito de Digitação Dinâmica */}
          <p className="hero-description" aria-live="polite">
            <span className="hero-description-prefix">Especialista em &nbsp;</span>
            <span className="hero-description-highlight">
              {displayedText}
              <span className="typing-cursor" aria-hidden="true" />
            </span>
          </p>

          {/* Badges da Stack Tecnológica */}
          <div className="stack-badges">
            <span className="badge-item">
              <i className="icon-react">⚛</i> [React]
            </span>
            <span className="badge-item">
              <i className="icon-node">JS</i> [Node.js]
            </span>
            <span className="badge-item">
              <i className="icon-chip">🎛</i> [Hardware Circuits]
            </span>
            <span className="badge-item">
              <i className="icon-cloud">☁</i> [Cloud Data]
            </span>
          </div>

          {/* Botoes de Ação (CTA) */}
          <div className="cta-group">
            <a className="btn-primary-glow" href="#projetos">
              Ver Projetos ↓
            </a>
            <a className="btn-secondary-outline" href="#contato">
              Fale Comigo ↗
            </a>
          </div>
        </div>

        {/* Lado Direito: Foto e Cards Decorativos */}
        <div className="hero-media">
          {/* Card decorativo superior (JSON) */}
          <div className="code-card code-card-top" aria-hidden="true">
            <pre>
              <code>
{`{
  "name": "json",
  "projet": "des",
  "done": "tine",
  "color": "t."
}`}
              </code>
            </pre>
          </div>

          {/* Container com Moldura Tech & Glow na Foto */}
          <div className="profile-frame">
            <div className="profile-border-glow">
              <img src={profileImg} alt="Desenvolvedor DevWCastle" />
              <span className="status-chip">
                <span className="pulse-dot" /> DISPONÍVEL
              </span>
            </div>
          </div>

          {/* Card decorativo inferior (Python/Code) */}
          <div className="code-card code-card-bottom" aria-hidden="true">
            <pre>
              <code>
{`# forsteine R
python = 0
def __comigo__(
  "stat": "HellaWeRous"
  return 1
)`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
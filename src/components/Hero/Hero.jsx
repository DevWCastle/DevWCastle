import { useState, useEffect } from 'react';
import { SiReact, SiNodedotjs, SiRaspberrypi, SiDocker } from 'react-icons/si';
import profileImg from '../../assets/profile.png';
import './Hero.css';

// Lista de frases dinâmicas configuráveis
const TYPING_PHRASES = [
  "Desenvolver aplicações e APIs robustas",
  "Integrar sistemas, serviços e dados",
  "Conectar software ao mundo físico",
  "Automatizar processos e operações",
  "Construir soluções Full Stack"
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

          {/* Badges da Stack Tecnológica com Ícones Consistentes */}
          <div className="stack-badges" aria-label="Tecnologias principais">
            <span className="badge-item">
              <i><SiReact /></i>
              <span className="badge-text">React</span>
            </span>
            <span className="badge-item">
              <i><SiNodedotjs /></i>
              <span className="badge-text">Node.js</span>
            </span>
            <span className="badge-item">
              <i><SiRaspberrypi /></i>
              <span className="badge-text">IoT &amp; CLP</span>
            </span>
            <span className="badge-item">
              <i><SiDocker /></i>
              <span className="badge-text">Docker &amp; SQL</span>
            </span>
          </div>

          {/* Botões de Ação (CTA) */}
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
          {/* Card decorativo superior (Telemetria / TypeScript & CLP) */}
          <div className="code-card code-card-top" aria-hidden="true">
            <div className="code-card-header">
              <span className="code-card-dot" />
              <span className="code-card-title">telemetry.service.ts</span>
            </div>
            <pre>
              <code>
                <span className="code-keyword">async</span> <span className="code-func">syncClp</span>() &#123;{'\n'}
                {'  '}<span className="code-keyword">const</span> data = <span className="code-keyword">await</span> modbus.<span className="code-func">read</span>();{'\n'}
                {'  '}<span className="code-keyword">return</span> &#123; status: <span className="code-string">"ONLINE"</span>, data &#125;;{'\n'}
                &#125;
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

          {/* Card decorativo inferior (Python / Bridge Industrial) */}
          <div className="code-card code-card-bottom" aria-hidden="true">
            <div className="code-card-header">
              <span className="code-card-dot" />
              <span className="code-card-title">clp_bridge.py</span>
            </div>
            <pre>
              <code>
                <span className="code-keyword">import</span> snap7{'\n'}
                plc = snap7.client.<span className="code-func">Client</span>(){'\n'}
                plc.<span className="code-func">connect</span>(<span className="code-string">"192.168.0.10"</span>, 0, 1){'\n'}
                state = plc.<span className="code-func">db_read</span>(1, 0, 16)
              </code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}

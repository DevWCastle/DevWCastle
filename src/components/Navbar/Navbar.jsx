import { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/dwc-logo-mobile.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        // Define o ponto de gatilho em 60vh (60% da altura da tela)
        const triggerPoint = window.innerHeight * 0.6;
        // Distância em pixels para completar o efeito de fade-in suave
        const fadeLength = 150; 

        let mappedProgress = 0;

        if (currentScroll >= triggerPoint) {
          mappedProgress = (currentScroll - triggerPoint) / fadeLength;
          mappedProgress = Math.min(Math.max(mappedProgress, 0), 1);
        } else {
          mappedProgress = 0;
        }

        // Define a variável CSS que controla a animação
        document.documentElement.style.setProperty('--scroll-progress', mappedProgress.toFixed(3));

        // Define se está interativo e se concluiu a transição
        setIsInteractive(mappedProgress > 0);
        setIsScrolled(mappedProgress >= 1);
      });
    };

    // Avaliação no carregamento inicial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <header
      className={`nav ${isScrolled ? 'is-scrolled' : ''} ${!isInteractive ? 'is-hidden' : ''}`}
      inert={!isInteractive ? '' : undefined}
    >
      <div className="bar">
         <a className="logo" href="#inicio" aria-label="DWC — início">
            <img src={logo} alt="Logo DWC" width="1254" height="1254" />
        </a>
        <nav className="links" aria-label="Principal">
          <a href="#projetos">Projetos</a>
          <a href="#sobre">Sobre</a>
          <a href="#stack">Stack</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="pill nav-pill" href="#contato">Contato ↗</a>
        <button
          className="burger"
          aria-expanded={isOpen}
          aria-controls="mn"
          aria-label="Abrir menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>
      <nav className={`menu ${isOpen ? 'open' : ''}`} id="mn" aria-label="Menu móvel">
        <a href="#projetos" onClick={() => setIsOpen(false)}>Projetos</a>
        <a href="#sobre" onClick={() => setIsOpen(false)}>Sobre</a>
        <a href="#tecnologias" onClick={() => setIsOpen(false)}>Stack</a>
        <a href="#contato" onClick={() => setIsOpen(false)}>Contato</a>
        <a className="pill" href="#contato" onClick={() => setIsOpen(false)}>Fale comigo</a>
      </nav>
    </header>
  );
}
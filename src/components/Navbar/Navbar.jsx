import { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/dwc-logo.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    let animationFrameId = null;

    // A revelação iniciará nos últimos 20% de saída do Hero (80% a 100%)
    const START_THRESHOLD = 0.8;
    const END_THRESHOLD = 1.0;

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const heroElement = document.getElementById('inicio');

        if (!heroElement) {
          document.documentElement.style.setProperty('--scroll-progress', '1');
          setIsScrolled(true);
          setIsInteractive(true);
          return;
        }

        const heroHeight = heroElement.offsetHeight;
        const currentScroll = window.scrollY;

        // Progresso bruto do scroll ao longo da Hero (0 a 1)
        const rawProgress = Math.min(Math.max(currentScroll / heroHeight, 0), 1);

        // Mapeamento concentrado na faixa final (0.80 -> 0 | 1.00 -> 1)
        let mappedProgress = 0;
        if (rawProgress > START_THRESHOLD) {
          mappedProgress = (rawProgress - START_THRESHOLD) / (END_THRESHOLD - START_THRESHOLD);
          mappedProgress = Math.min(Math.max(mappedProgress, 0), 1);
        }

        // Define a variável CSS que controla a animação rápida
        document.documentElement.style.setProperty('--scroll-progress', mappedProgress.toFixed(3));

        // Define se está interativo (começou a revelar) e se concluiu a Hero
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
          <a href="#tecnologias">Stack</a>
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
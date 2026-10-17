import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap bar">
        <a className="logo" href="#inicio" aria-label="WCastle Dev — início">
          <i className='destaque'>DEVW</i>CASTLE
        </a>
        <nav className="links" aria-label="Principal">
          <a href="#projetos">Projetos</a>
          <a href="#sobre">Sobre</a>
          <a href="#tecnologias">Stack</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="pill" href="#contato">Contato ↗</a>
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
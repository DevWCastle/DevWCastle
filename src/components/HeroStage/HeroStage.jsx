import { useState, useEffect } from 'react';
import './HeroStage.css';
import logo from '../../assets/dwc-logo.png'; // Ajuste o caminho conforme a estrutura do seu projeto

export default function HeroStage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="hero-stage-container">
      <div className="hero">
        {/* Circuitos e elementos decorativos em SVG */}
        <svg className="hero__circuits" viewBox="0 0 1365 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
          <defs>
            <g id="bars-stage">
              <g transform="skewX(-35)">
                <rect x="0" y="0" width="9" height="11"/>
                <rect x="14" y="0" width="9" height="11"/>
                <rect x="28" y="0" width="9" height="11"/>
                <rect x="42" y="0" width="9" height="11" opacity=".7"/>
                <rect x="56" y="0" width="9" height="11" opacity=".45"/>
              </g>
            </g>
          </defs>
          <g className="lines">
            <path d="M0 32H108L142 0"/>
            <path d="M82 145H200"/>
            <path d="M0 245H95L175 302"/>
            <path d="M0 405H60L165 527H336"/>
            <path d="M90 580L150 608H395"/>
            <path className="faint" d="M170 640L270 768"/>
            <path d="M1095 188H1175L1250 232H1365"/>
            <path d="M1078 94L1030 140"/>
            <path d="M930 664H1040"/>
            <path d="M1030 702L1165 565H1365"/>
            <path d="M1105 677H1135"/>
            <path className="faint" d="M1255 330V400M1255 520V540"/>
          </g>
          <g className="nodes">
            <circle cx="175" cy="302" r="3.5"/>
            <circle cx="127" cy="481" r="3.5"/>
            <circle cx="336" cy="527" r="3.5"/>
            <circle cx="395" cy="608" r="3.5"/>
            <circle cx="1078" cy="94" r="3.5"/>
            <circle cx="1165" cy="565" r="3.5"/>
            <circle cx="930" cy="664" r="2.5"/>
          </g>
          <g className="plus">
            <path d="M1308 282V294M1302 288H1314"/>
            <path d="M46 455V467M40 461H52"/>
          </g>
          <g className="bars">
            <use href="#bars-stage" x="18" y="154"/>
            <use href="#bars-stage" x="1290" y="154"/>
            <use href="#bars-stage" x="10" y="559"/>
            <use href="#bars-stage" x="1150" y="676"/>
            <polygon points="1252,208 1268,196 1272,208"/>
          </g>
        </svg>

        <span className="hero__dots hero__dots--left" aria-hidden="true"></span>
        <span className="hero__dots hero__dots--right" aria-hidden="true"></span>

        {/* Header com a Logo DWC centralizada acima */}
        <header className="site-header">
          <span className="site-header__spacer"></span>
          <a className="site-header__logo" href="#inicio" aria-label="DWC — início" id="inicio">
            <img src={logo} alt="Logo DWC" width="1254" height="1254" />
          </a>
        </header>

        {/* Menu interativo */}
       

        <p className="hero__tagline" aria-hidden="true">
          &lt; DEVELOP<br />/ BUILD<br />&gt; IMPACT
          <span className="hero__tagline-dots"><i></i><i></i><i></i></span>
        </p>

        {/* Conteúdo Principal */}
        <main className="hero__content" >
          <h1 className="hero__title">
            <span className="hero__title-main">Do código ao</span>
            <span className="hero__title-sub">Impacto real</span>
          </h1>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#projetos">
              Ver Projetos
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5V13M3.5 8.5L8 13l4.5-4.5"/></svg>
            </a>
            <a className="btn btn--outline" href="#contato">
              Fale Comigo
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5"/></svg>
            </a>
          </div>
        </main>

        <ul className="hero__stack" aria-label="Áreas de atuação">
          <li>Full Stack</li>
          <li>Cloud</li>
          <li>DevOps</li>
        </ul>
      </div>
    </div>
  );
}
import { useState } from 'react';
import './HeroStage.css';

// Importações dos assets originais
import smokeBack from '../../assets/smoke/smoke-back.webp';
import smokeFront from '../../assets/smoke/smoke-front.webp';
import pessoaImg from '../../assets/images/pessoa.webp';

export default function HeroStage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="hero-stage" id="inicio">
      <div className="stage">
        
        {/* 1-2. Fundo + Fumaça (atrás) */}
        <div className="layer layer--bg" aria-hidden="true" />
        <img className="layer layer--smoke-back" src={smokeBack} alt="" aria-hidden="true" />

        {/* 3. Elementos tecnológicos decorativos */}
        <svg className="layer layer--deco" viewBox="0 0 1672 940" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="var(--lime)" strokeWidth="1.2" opacity=".85">
            <polyline points="0,21 130,21" />
            <polyline points="130,21 148,0" opacity=".6" />
            <polyline points="0,131 240,131" />
            <polyline points="0,122 66,122 50,131" opacity=".5" />
            <polyline points="0,513 197,513" />
            <polyline points="0,504 72,504 60,513" opacity=".5" />
            <polyline points="0,703 55,703 103,750 0,750" opacity=".8" />
            <polyline points="103,750 172,822 239,822" />
            <polyline points="0,840 278,840" opacity=".6" />
            <polyline points="1672,180 1585,262 1527,285" opacity=".8" />
            <polyline points="1672,710 1570,710 1510,767 1452,767" />
          </g>
          <g fill="var(--lime)">
            <circle cx="130" cy="21" r="3" />
            <circle cx="240" cy="131" r="3" />
            <circle cx="197" cy="513" r="3" />
            <circle cx="239" cy="822" r="3.5" />
            <circle cx="278" cy="840" r="3" />
            <circle cx="1452" cy="767" r="3.5" />
            <rect x="0" y="138" width="6" height="9" />
            <rect x="11" y="138" width="6" height="9" />
            <rect x="22" y="138" width="6" height="9" />
            <rect x="0" y="520" width="8" height="10" />
            <rect x="14" y="520" width="8" height="10" />
            <rect x="28" y="520" width="8" height="10" />
            <rect x="40" y="520" width="6" height="10" />
            <rect x="1563" y="266" width="6" height="6" transform="rotate(-40 1566 269)" />
            <rect x="1574" y="258" width="6" height="6" transform="rotate(-40 1577 261)" />
            <rect x="1586" y="250" width="6" height="6" transform="rotate(-40 1589 253)" />
          </g>
        </svg>

        {/* Logotipo no Canto Superior Esquerdo */}
        <div className="hero-top-bar">
          <a className="brand-badge" href="#inicio" aria-label="DevWCastle — início">
            <span className="castle-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 22h20V10l-3-3v3h-2V7l-3-3-3 3v3H9V7L6 10v3H4V7L1 10v12zm4-10h2v10H6V12zm5-3h2v13h-2V9zm5 3h2v10h-2V12z" />
              </svg>
              <i>&lt;/&gt;</i>
            </span>
            <span className="logo-hero">
              <i className="destaque">DEVW</i>Castle
            </span>
          </a>
        </div>

        {/* 5. Headline (texto real em SVG com filtros) */}
        <h1 className="headline">
          <svg viewBox="0 0 1400 400" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbf8ef" />
                <stop offset="1" stopColor="#d9d4c6" />
              </linearGradient>
              <filter id="grunge-white" x="-5%" y="-10%" width="110%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="3" result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 .55  0 0 0 0 .56  0 0 0 0 .52  0 0 0 1.6 -.35" result="smudge" />
                <feComposite in="smudge" in2="SourceAlpha" operator="in" result="s" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="s" />
                </feMerge>
              </filter>
              <filter id="brush" x="-8%" y="-20%" width="116%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency=".008 .09" numOctaves="3" seed="8" result="streak" />
                <feDisplacementMap in="SourceGraphic" in2="streak" scale="9" xChannelSelector="R" yChannelSelector="G" result="rough" />
                <feTurbulence type="fractalNoise" baseFrequency=".02 .5" numOctaves="2" seed="2" result="fine" />
                <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.0" result="holes" />
                <feComposite in="rough" in2="holes" operator="in" result="eroded" />
                <feGaussianBlur in="eroded" stdDeviation="7" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="glow" />
                  <feMergeNode in="eroded" />
                </feMerge>
              </filter>
            </defs>
            <text className="hl-1" x="172" y="147" textLength="1000" lengthAdjust="spacingAndGlyphs" filter="url(#grunge-white)">
              DO CÓDIGO AO
            </text>
            <g transform="translate(62 340) skewX(-14)">
              <text className="hl-2" x="0" y="0" textLength="1230" lengthAdjust="spacingAndGlyphs" filter="url(#brush)">
                IMPACTO REAL
              </text>
            </g>
          </svg>
        </h1>

        {/* 6. Pessoa (Apenas da metade para cima visível) */}
        {/* <img 
          className="layer layer--person" 
          src={pessoaImg} 
          alt="Retrato de DevWCastle, desenvolvedor de software, de jaqueta marrom e óculos" 
          width="1086" 
          height="1439" 
        /> */}

        {/* 7. Fumaça frontal + iluminação (Vignette) */}
        <img className="layer layer--smoke-front" src={smokeFront} alt="" aria-hidden="true" />
        <div className="layer layer--vignette" aria-hidden="true" />

        {/* Botões de Ação Centralizados na Parte Inferior */}
        <div className="hero-footer-content">
          <div className="actions">
            <a className="btn-primary-glow" href="#projetos">
              Ver Projetos <span aria-hidden="true">↓</span>
            </a>
            <a className="btn-secondary-outline" href="#contato">
              Fale Comigo <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
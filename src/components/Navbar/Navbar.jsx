import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import wordmark from '../../assets/dwc-wordmark-520.webp';
import Icon from '../Icon/Icon';
import { sections } from '../../data/site';
import './Navbar.css';

/**
 * Barra flutuante que só existe depois do hero (o hero tem a própria navegação).
 *  - some ao rolar para baixo e volta ao rolar para cima;
 *  - marca a seção ativa com um indicador que desliza entre os links.
 */
export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [active, setActive] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const linksRef = useRef(null);

  /* Rolagem: passou do hero? direção? (um cálculo por quadro) */
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const hero = document.getElementById('inicio');
      const limit = hero ? hero.offsetHeight * 0.72 : window.innerHeight * 0.6;
      setPastHero(y > limit);

      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHiddenByScroll(delta > 0 && y > limit + 120);
        lastY = y;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* Seção ativa: a que cruza a faixa central da tela */
  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  /* Indicador: posição e largura do link ativo em variáveis CSS */
  useLayoutEffect(() => {
    const list = linksRef.current;
    if (!list) return;
    const link = list.querySelector(`[data-id="${active}"]`);
    if (!link) {
      list.style.setProperty('--ind-o', '0');
      return;
    }
    list.style.setProperty('--ind-x', `${link.offsetLeft}px`);
    list.style.setProperty('--ind-w', `${link.offsetWidth}px`);
    list.style.setProperty('--ind-o', '1');
  }, [active, pastHero]);

  /* Menu móvel: fecha com Esc */
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const visible = pastHero && (!hiddenByScroll || isOpen);
  const close = () => setIsOpen(false);

  return (
    <header
      className={`nav${visible ? ' is-visible' : ''}${isOpen ? ' is-open' : ''}`}
      inert={!visible}
    >
      <div className="nav__bar">
        <a className="nav__logo" href="#inicio" aria-label="DevWCastle — início">
          <img src={wordmark} alt="" width="520" height="115" />
        </a>

        <nav className="nav__links" aria-label="Principal" ref={linksRef}>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-id={section.id}
              aria-current={active === section.id ? 'true' : undefined}
            >
              {section.label}
            </a>
          ))}
          <span className="nav__indicator" aria-hidden="true" />
        </nav>

        <a className="btn btn--outline nav__cta" href="#contato">
          Fale comigo
          <Icon name="arrow-up-right" size={16} />
        </a>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <Icon name={isOpen ? 'close' : 'menu'} size={20} />
        </button>
      </div>

      <nav className="nav__menu" id="nav-menu" aria-label="Menu móvel" hidden={!isOpen}>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={close}
            aria-current={active === section.id ? 'true' : undefined}
          >
            {section.label}
            <Icon name="arrow-right" size={18} />
          </a>
        ))}
      </nav>
    </header>
  );
}

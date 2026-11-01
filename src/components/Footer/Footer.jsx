import wordmark from '../../assets/dwc-wordmark-520.webp';
import Icon from '../Icon/Icon';
import { contact } from '../../data/site';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="w footer__row">
        <img className="footer__logo" src={wordmark} alt="DevWCastle" width="520" height="115" loading="lazy" />
        <p className="footer__copy">© {new Date().getFullYear()} DevWCastle. Todos os direitos reservados.</p>
        <nav className="footer__links" aria-label="Rodapé">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="#inicio">
            Voltar ao topo
            <Icon name="arrow-down" size={14} className="footer__up" />
          </a>
        </nav>
      </div>
    </footer>
  );
}

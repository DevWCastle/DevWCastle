import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [buttonText, setButtonText] = useState('Enviar mensagem');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonText('Mensagem enviada');
    setIsSent(true);
  };

  return (
    <section className="ct" id="contato">
      <div className="w">
        {/* Coluna Esquerda: Informações de Contato */}
        <div className="ct__info">
          <div className="lbl">CONTATO</div>
          <h2>
            Vamos <br />
            <em>conversar?</em>
          </h2>
          <p className="sub">
            Disponível para oportunidades de trabalho, projetos freelance ou parcerias na área de tecnologia.
          </p>
          
          <div className="lk">
            <a href="mailto:pedrocastelobrancodosantos@gmail.com" className="lk-item">
              <span className="lk-badge">@</span>
              <div className="lk-text">
                <span className="lk-label">E-mail</span>
                <span className="lk-value">contato@devwcastle.com</span>
              </div>
              <span className="lk-arrow">↗</span>
            </a>

            <a href="https://github.com/DevWCastle" target="_blank" rel="noopener noreferrer" className="lk-item">
              <span className="lk-badge">GH</span>
              <div className="lk-text">
                <span className="lk-label">GitHub</span>
                <span className="lk-value">github.com/DevWCastle</span>
              </div>
              <span className="lk-arrow">↗</span>
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer" className="lk-item">
              <span className="lk-badge">IN</span>
              <div className="lk-text">
                <span className="lk-label">LinkedIn</span>
                <span className="lk-value">Conecte-se comigo</span>
              </div>
              <span className="lk-arrow">↗</span>
            </a>
          </div>
        </div>

        {/* Coluna Direita: Formulário Escuro Profissional */}
        <form className={`ct-form ${isSent ? 'sent' : ''}`} onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Envie uma mensagem</h3>
            <p>Preencha os campos abaixo para iniciar uma conversa.</p>
          </div>

          <label>
            Nome
            <input required placeholder="Seu nome completo" />
          </label>

          <label>
            E-mail
            <input type="email" required placeholder="voce@email.com" />
          </label>

          <label>
            Mensagem
            <textarea required placeholder="Escreva sua mensagem detalhada..."></textarea>
          </label>

          <button className="btn-grad p form-btn" type="submit" disabled={isSent}>
            {buttonText} {!isSent && <span>↗</span>}
          </button>
        </form>
      </div>
    </section>
  );
}
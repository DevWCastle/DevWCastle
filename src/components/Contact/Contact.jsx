import './Contact.css';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="wrap" id="contato" style={{ paddingBottom: 'clamp(60px,10vh,100px)' }}>
      <div className="contact rv">
        <div>
          <p className="mono kick">Contato</p>
          <h2>Vamos <em>conversar?</em></h2>
          <p style={{ color: 'var(--mu)' }}>Estou disponível para novas oportunidades de trabalho, projetos freelance ou parcerias na área de tecnologia.</p>

          <ul className="ch">
            <li>
              <span className="mono off" style={{ display: 'block', fontSize: '11px' }}>E-MAIL</span>
              <a href="mailto:contato@devwcastle.com">contato@devwcastle.com</a>
            </li>
            <li>
              <span className="mono off" style={{ display: 'block', fontSize: '11px' }}>GITHUB</span>
              <a href="https://github.com/DevWCastle" target="_blank" rel="noopener noreferrer">github.com/DevWCastle</a>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="f">
            <label htmlFor="nm">Nome <span className="req">*</span></label>
            <input type="text" id="nm" name="name" required placeholder="Seu nome" />
          </div>
          <div className="f">
            <label htmlFor="em">E-mail <span className="req">*</span></label>
            <input type="email" id="em" name="email" required placeholder="seu@email.com" />
          </div>
          <div className="f">
            <label htmlFor="msg">Mensagem <span className="req">*</span></label>
            <textarea id="msg" name="message" required placeholder="Escreva sua mensagem..."></textarea>
          </div>
          <button type="submit" className="pill" style={{ width: '100%' }}>Enviar mensagem ↗</button>
        </form>
      </div>
    </section>
  );
}
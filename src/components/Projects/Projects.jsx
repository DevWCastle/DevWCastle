import './Projects.css';

export default function Projects() {
  return (
    <section className="wrap" id="projetos">
      <p className="mono kick rv">Portfólio</p>
      <h2 className="rv">Projetos em <em>destaque</em></h2>

      <div className="case rv">
        <div className="shots">
          <div className="arch">
            <span>[ Controller / Service ]</span>
            <span>[ PostgreSQL / TypeORM ]</span>
            <span>[ Docker Container ]</span>
            <span>[ Client App ]</span>
          </div>
        </div>
        <div>
          <h3>Sistema de Gestão Industrial / ERP</h3>
          <p style={{ color: 'var(--mu)', margin: 0 }}>
            API REST para controle de rotinas de manutenção preventiva, estoque de insumos e ordens de serviço em tempo real.
          </p>
          <dl>
            <dt className="mono">Arquitetura &amp; Techs</dt>
            <dd>NestJS, TypeScript, PostgreSQL, TypeORM e Docker.</dd>
          </dl>
          <div className="tags">
            <span className="tag mono">TypeScript</span>
            <span className="tag mono">Node.js</span>
            <span className="tag mono">NestJS</span>
            <span className="tag mono">SQL</span>
          </div>
          <div className="links2">
            <a className="ghost" href="https://github.com/DevWCastle" target="_blank" rel="noopener noreferrer">
              Repositório ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
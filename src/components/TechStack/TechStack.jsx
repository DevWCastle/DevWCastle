import './TechStack.css';

export default function TechStack() {
  return (
    <section className="wrap" id="tecnologias">
      <p className="mono kick rv">Competências</p>
      <h2 className="rv">Stack <em>técnica</em></h2>

      <div className="cols rv">
        <div>
          <p>Conjunto de ferramentas e tecnologias que utilizo diariamente para construir aplicações escaláveis e de fácil manutenção.</p>
        </div>
        <div className="stack">
          <div><strong>Backend</strong> <span>Node.js, NestJS, Express, TypeScript</span></div>
          <div><strong>Bancos de Dados</strong> <span>PostgreSQL, MySQL, TypeORM, Prisma</span></div>
          <div><strong>Frontend</strong> <span>React, JavaScript (ES6+), HTML5/CSS3</span></div>
          <div><strong>Ferramentas &amp; DevOps</strong> <span>Docker, Git, GitHub, Linux, Postman</span></div>
        </div>
      </div>
    </section>
  );
}
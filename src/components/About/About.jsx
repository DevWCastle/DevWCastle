import './About.css';

export default function About() {
  return (
    <section className="wrap" id="sobre">
      <p className="mono about__kicker">Apresentação</p>
      <div className="about__card rv">
        
        <h2 className="about__title rv">
          Confiabilidade de <em>engenharia</em> no seu software.
        </h2>
        <div className="about__cols">
          <p>
            Minha trajetória começou no chão de fábrica e nos laboratórios de eletroeletrônica e manutenção industrial. Lá, aprendi que falhas custam caro e que sistemas precisam ser projetados para funcionar sob pressão com máxima previsibilidade.
          </p>
          <p>
            Trouxe essa mentalidade para o desenvolvimento de software. Hoje, aplico rigor na modelagem de bancos de dados SQL, criação de APIs REST performáticas com Node.js/NestJS e interfaces fluidas com React.
          </p>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import './About.css';

export default function About() {
  return (
    <section className="sheet hero-sheet-overlap" id="sobre">
      <div className="w">
        <div className="lbl">SOBRE</div>
        <p className="big">
          Da manutenção industrial ao backend: sistemas que precisam funcionar sob pressão, com máxima previsibilidade.
        </p>
        <div className="ab">
          <p className="sub">
            Minha trajetória começou no chão de fábrica e nos laboratórios de eletroeletrônica. Lá, aprendi que falhas custam caro. Trouxe essa mentalidade para APIs REST com Node.js/NestJS, modelagem SQL e interfaces em React.
          </p>
          <div className="nums">
            <div>
              <b>3</b>
              <span>repositórios no GitHub</span>
            </div>
            <div>
              <b>17</b>
              <span>tecnologias na stack</span>
            </div>
            <div>
              <b>2</b>
              <span>áreas: indústria e software</span>
            </div>
          </div>
        </div>
        <div className="path">
          <div>
            <b>CHÃO DE FÁBRICA</b>
            <span>Manutenção industrial.</span>
          </div>
          <div>
            <b>ELETROELETRÔNICA</b>
            <span>Laboratório e circuitos.</span>
          </div>
          <div>
            <b>SOFTWARE</b>
            <span>APIs, SQL e React.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
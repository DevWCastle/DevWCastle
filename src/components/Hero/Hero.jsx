import { useState, useEffect } from 'react';
import profileImg from '../../assets/profile.jpg';
import './Hero.css';

const roles = [
  "Desenvolvimento de soluções web práticas",
  "Automações Web",
  "APIs REST com Node.js e NestJS",
  "Aplicações Full Stack com React e Typescript"
];

export default function Hero() {
  const [text, setText] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIdx];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentRole.substring(0, charIdx + 1));
        setCharIdx(prev => prev + 1);

        if (charIdx + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(currentRole.substring(0, charIdx - 1));
        setCharIdx(prev => prev - 1);

        if (charIdx - 1 === 0) {
          setIsDeleting(false);
          setRoleIdx((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, roleIdx]);

  return (
    <main className="wrap" id="inicio">
      <div className="hero">
        <div>
          <p className="mono kick rv">Desenvolvedor de Software · Backend &amp; Full Stack</p>
          <h1 className="rv">Código que <em>fala</em> com o mundo real.</h1>
          <p className="role rv">
            <span className="sr">Modelagem SQL, APIs REST com Node.js e NestJS, aplicações full stack com React.</span>
            <span aria-hidden="true">{text}</span>
            <span className="cur" aria-hidden="true"></span>
          </p>
          <p className="lead rv">
            Desenvolvo APIs e aplicações web com TypeScript, Node.js e SQL. Venho da eletroeletrônica e da manutenção industrial, e levo esse olhar de confiabilidade para o software.
          </p>
          <div className="cta rv">
            <a className="pill" href="#projetos">Ver projetos ↓</a>
            <a className="ghost" href="https://github.com/DevWCastle" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
        <div className="ph rv">
          <img src={profileImg} alt="Desenvolvedor DevWCastle" />
          <span className="chip mono">◆ Disponível</span>
        </div>
      </div>
    </main>
  );
}
import { useState } from 'react';
import Preloader from './components/Preloader/Preloader';
import { shouldPlayIntro } from './components/Preloader/intro';
import Navbar from './components/Navbar/Navbar';
import HeroStage from './components/HeroStage/HeroStage';
import Projects from './components/Projects/Projects';
import TechStack from './components/TechStack/TechStack';
import TechMarquee from './components/TechMarquee/TechMarquee';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollLine from './components/ScrollLine/ScrollLine';
import { useScrollReveal } from './hooks/useScrollReveal';

/*
 * Ritmo das seções: hero (azul-noite) → projetos (papel) → stack (escura,
 * no meio, fechada pelo letreiro de tecnologias) → sobre (branco) →
 * contato (azul-noite).
 * O hero fica fixo dentro de .hero-pin enquanto Projetos sobe por cima dele.
 */
export default function App() {
  const [playIntro] = useState(shouldPlayIntro);
  const [introDone, setIntroDone] = useState(!playIntro);
  useScrollReveal();

  return (
    <>
      {playIntro && <Preloader onDone={() => setIntroDone(true)} />}
      <Navbar />
      <main className="site-main">
        <div className="hero-pin">
          <HeroStage ready={introDone} />
          <Projects />
        </div>
        <TechStack />
        <TechMarquee />
        <About />
        <Contact />
        <ScrollLine />
      </main>
      <Footer />
    </>
  );
}

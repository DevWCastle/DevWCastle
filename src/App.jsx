import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TechStrip from './components/TechStrip/TechStrip';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import TechStack from './components/TechStack/TechStack';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import HeroStage from './components/HeroStage/HeroStage';
import './App.css'

export default function App() {
  useScrollReveal();

  return (
    <>
        <Navbar />
        {/* <Hero /> */}
        <HeroStage/>
        <TechStrip />
        <Projects /> 
        <About /> 
        <TechStack /> 
        <Contact />
        <Footer />
    </>
  );
}
import { useState, useEffect } from 'react';
import './TypingImpact.css';

export default function TypingImpact() {
  const phrase = "impacto real";
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'glowing' | 'deleting' | 'waiting'

  useEffect(() => {
    let timer;

    if (phase === 'typing') {
      if (count < phrase.length) {
        // Digita letra por letra
        timer = setTimeout(() => setCount(c => c + 1), 90);
      } else {
        // Frase completa: entra na fase de brilho neon
        setPhase('glowing');
      }
    } else if (phase === 'glowing') {
      // Mantém o brilho neon ativado por 1.4 segundos antes de começar a apagar
      timer = setTimeout(() => {
        setPhase('deleting');
      }, 1400);
    } else if (phase === 'deleting') {
      if (count > 0) {
        // Remove letra por letra de forma fluida
        timer = setTimeout(() => setCount(c => c - 1), 60);
      } else {
        // Terminou de apagar: pausa breve e limpa antes de reiniciar
        setPhase('waiting');
      }
    } else if (phase === 'waiting') {
      timer = setTimeout(() => {
        setPhase('typing');
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [count, phase, phrase]);

  return (
    <span className={`typing-wrapper ${phase === 'glowing' ? 'glow-active' : ''}`}>
      {phrase.split('').map((char, index) => (
        <span
          key={index}
          className={`typing-letter ${index < count ? 'visible' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {/* <span className="typing-cursor" aria-hidden="true" />    */}
    </span>
  );
}
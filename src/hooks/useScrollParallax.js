import { useEffect } from 'react';

/**
 * Escreve --sy no elemento: posição do centro dele em relação ao centro da
 * tela, de -1 (acima) a 1 (abaixo). O CSS usa isso para mover camadas em
 * velocidades diferentes. Só escuta a rolagem enquanto o elemento está
 * visível; com prefers-reduced-motion não faz nada.
 */
export function useScrollParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const value = Math.max(-1, Math.min(1, (center - vh / 2) / vh));
      el.style.setProperty('--sy', value.toFixed(3));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        window.addEventListener('scroll', onScroll, { passive: true });
        listening = true;
        onScroll();
      } else if (!entry.isIntersecting && listening) {
        window.removeEventListener('scroll', onScroll);
        listening = false;
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

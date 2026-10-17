import { useEffect } from 'react';

/**
 * Adiciona a classe "in" aos elementos ".rv" de um contêiner quando eles entram
 * na tela, com atraso escalonado. O visual fica no CSS global (.js .rv / .rv.in).
 */
function useRevealOnScroll(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    root.querySelectorAll('.rv').forEach((element, index) => {
      element.style.setProperty('--d', `${Math.min(index, 4) * 90}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [rootRef]);
}

export default useRevealOnScroll;

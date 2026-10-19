import { useEffect } from 'react';

/**
 * Revela elementos .rv quando entram na tela,
 * com atraso escalonado para uma transição natural.
 */
function useRevealOnScroll(rootRef) {
  useEffect(() => {
    const root = rootRef.current;

    if (!root || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    root.querySelectorAll('.rv').forEach((element, index) => {
      // Intervalo de 130ms entre elementos, com limite de 650ms.
      const delay = Math.min(index, 5) * 130;

      element.style.setProperty('--d', `${delay}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [rootRef]);
}

export default useRevealOnScroll;
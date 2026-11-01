import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const root = document.documentElement;
    root.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.rv').forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove('js-reveal');
    };
  }, []);
}

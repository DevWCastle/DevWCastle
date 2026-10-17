import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
            }
          });
        },
        { threshold: 0.1 }
      );

      const elements = document.querySelectorAll('.rv');
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, []);
}
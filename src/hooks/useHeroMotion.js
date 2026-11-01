import { useEffect } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Movimento do hero, com custo baixo:
 *  - --mx / --my / --px / --py: posição do cursor (só com mouse; desligado em touch)
 *  - --p: progresso de rolagem do hero (0 a 1)
 *  - .is-tracking: o cursor está sobre o hero
 *  - .is-offscreen: o hero saiu da tela (CSS pausa as animações)
 * Tudo é escrito em variáveis CSS dentro de um único requestAnimationFrame.
 * Com prefers-reduced-motion, nenhum listener é registrado.
 */
export function useHeroMotion(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let visible = true;
    let frame = 0;
    const pending = {};

    const flush = () => {
      frame = 0;
      Object.keys(pending).forEach((name) => {
        el.style.setProperty(name, pending[name]);
        delete pending[name];
      });
    };

    const queue = (name, value) => {
      pending[name] = value;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onScroll = () => {
      if (!visible) return;
      const progress = clamp(window.scrollY / el.offsetHeight, 0, 1);
      queue('--p', progress.toFixed(3));
    };

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      queue('--mx', `${x.toFixed(1)}px`);
      queue('--my', `${y.toFixed(1)}px`);
      queue('--px', ((x / rect.width) * 2 - 1).toFixed(3));
      queue('--py', ((y / rect.height) * 2 - 1).toFixed(3));
      el.classList.add('is-tracking');
    };

    const onPointerLeave = () => el.classList.remove('is-tracking');

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      el.classList.toggle('is-offscreen', !visible);
    });
    observer.observe(el);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (finePointer) {
      el.addEventListener('pointermove', onPointerMove, { passive: true });
      el.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      el.classList.remove('is-tracking', 'is-offscreen');
    };
  }, [ref]);
}

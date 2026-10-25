
import { motion, useReducedMotion } from "motion/react";

export function HeroTitle() {
  const reduceMotion = useReducedMotion();

  const enter = (delay) => ({
    initial: {
      opacity: 0,
      y: reduceMotion ? 0 : 24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: reduceMotion ? 0 : 0.9,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  return (
    <h1 className="hero__title">
      <motion.span
        className="hero__title-main"
        {...enter(0.25)}
      >
        DO CÓDIGO AO
      </motion.span>

      <motion.span
        className="hero__title-sub"
        {...enter(0.55)}
      >
        IMPACTO REAL
      </motion.span>
    </h1>
  );
}

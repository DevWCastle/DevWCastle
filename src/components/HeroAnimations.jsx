
import { motion, useReducedMotion } from "motion/react";

export function HeroAnimations({ children }) {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: reduceMotion ? 0 : 22,
      filter: reduceMotion ? "none" : "blur(5px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
    transition: {
      duration: reduceMotion ? 0 : 0.85,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  return (
    <motion.div
      className="hero__content"
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

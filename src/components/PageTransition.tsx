import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const variants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.22, ease: 'easeIn' } },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
  <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

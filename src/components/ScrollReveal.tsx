import React, { useEffect, useRef, useState } from 'react';

type AnimationType = 'up' | 'fade' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;        // extra delay in ms
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps any children with scroll-triggered CSS reveal animations.
 * Usage: <ScrollReveal animation="up" delay={100}>…children…</ScrollReveal>
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -60px 0px',
  className = '',
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setIsVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const animClass = `reveal-${animation}`;
  const visClass = isVisible ? 'visible' : '';

  return React.createElement(
    Tag as string,
    {
      ref,
      className: `${animClass} ${visClass} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
};

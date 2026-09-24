import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;       // 0–1 percentage of element visible before triggering
  rootMargin?: string;      // extra margin offset, e.g. "0px 0px -80px 0px"
  once?: boolean;           // only animate once (default true)
}

/**
 * Returns a ref to attach to any element.
 * When the element scrolls into view, `isVisible` becomes true and
 * the element gets the CSS class that drives the reveal animation.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.12, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

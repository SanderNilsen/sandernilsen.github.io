import { useEffect } from 'react';

export function useReveal(containerRef, dependency = null) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const elements = Array.from(container.querySelectorAll('.reveal:not(.is-visible)'));
    const rowCounts = new Map();

    elements.forEach((element) => {
      if (element.dataset.revealRow === 'true') {
        const top = Math.round(element.offsetTop);
        const count = rowCounts.get(top) || 0;
        rowCounts.set(top, count + 1);
        element.style.setProperty('--reveal-delay', `${count * 90}ms`);
      }
    });

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.requestAnimationFrame(() => entry.target.classList.add('is-visible'));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -20%' },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [containerRef, dependency]);
}

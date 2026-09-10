import { useLayoutEffect } from 'react';

export function useReveal(containerRef, dependency = null) {
  useLayoutEffect(() => {
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

    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window) || motionPreference?.matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const finishReveal = (element) => {
      element.classList.add('is-visible');
      element.classList.remove('reveal-ready');
      observer.unobserve(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      // Trigger when the leading edge enters, including cards taller than the viewport.
      { threshold: 0, rootMargin: '0px 0px -32px 0px' },
    );

    const handleAnimationEnd = (event) => {
      if (event.animationName === 'reveal-in') finishReveal(event.target);
    };
    const handleFocus = (event) => {
      elements.forEach((element) => {
        if (element.contains(event.target)) finishReveal(element);
      });
    };
    const handleMotionChange = (event) => {
      if (event.matches) elements.forEach(finishReveal);
    };

    elements.forEach((element) => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
    container.addEventListener('animationend', handleAnimationEnd);
    container.addEventListener('focusin', handleFocus);
    motionPreference?.addEventListener?.('change', handleMotionChange);

    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove('reveal-ready'));
      container.removeEventListener('animationend', handleAnimationEnd);
      container.removeEventListener('focusin', handleFocus);
      motionPreference?.removeEventListener?.('change', handleMotionChange);
    };
  }, [containerRef, dependency]);
}

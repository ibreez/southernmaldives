import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const scrollToTarget = () => {
      const hash = location.hash;
      const id = hash ? hash.replace('#', '') : '';
      const target = id
        ? document.getElementById(id) || document.querySelector(`[name="${id}"]`)
        : null;

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    const scheduleScroll = () => {
      if (typeof window === 'undefined') return;
      window.setTimeout(scrollToTarget, 0);
    };

    scheduleScroll();

    const handlePopState = () => {
      scheduleScroll();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]);

  return null;
};

export default ScrollRestoration;

import { useEffect, useRef, useState } from 'react';

// Animates a number counting up/down to `value` whenever it changes.
// Keeps dashboards feeling alive when the queue updates every 5s,
// instead of numbers just snapping.
export default function useCountUp(value, duration = 500) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return display;
}
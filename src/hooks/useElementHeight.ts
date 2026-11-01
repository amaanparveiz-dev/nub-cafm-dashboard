import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Tracks an element's content height (0 until measured). */
export default function useElementHeight(ref: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const update = () => setHeight(element.clientHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return height;
}

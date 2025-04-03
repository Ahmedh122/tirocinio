import { useRef, useState } from 'react';
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts';

export function useContainerSize<T extends HTMLElement>(debounceTime = 200) {
  const ref = useRef<T>(null);

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const onResize = useDebounceCallback((size) => {
    setWidth(size.width);
    setHeight(size.height);
  }, debounceTime);

  useResizeObserver({
  
    ref,
    onResize,
  });

  return {
    ref,
    width,
    height,
  };
}
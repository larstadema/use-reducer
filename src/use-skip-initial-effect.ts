import { useEffect, useRef } from 'react';

export const useSkipInitialEffect: typeof useEffect = (effect, deps) => {
  const isInitial = useRef(true);

  if (isInitial.current) {
    isInitial.current = false;
  }

  useEffect(() => {
    if (!isInitial) {
      return effect();
    }
  }, deps);
};

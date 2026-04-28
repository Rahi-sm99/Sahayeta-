import { useEffect, useRef } from 'react';
import { localStore } from '../lib/store';

export function useSimulation(running: boolean) {
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!running) { if (ref.current) clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      localStore.simulateTick();
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
}

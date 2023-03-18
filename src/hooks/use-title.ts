import { useEffect } from 'react';

export const useTitle = (...args: (string | undefined)[]) => {
  useEffect(() => {
    if (args.length) {
      document.title = args.filter(Boolean).join(' | ');
    }
  }, [args]);
};

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T>(
  name: string,
  initialState: Partial<T>
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const storageValue = localStorage.getItem(name);

    if (storageValue) {
      return JSON.parse(storageValue);
    }

    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(state));
  }, [state, name]);

  return [state, setState];
}

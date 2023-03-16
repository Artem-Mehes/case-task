import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorageById<T>(
  initialState: Partial<T>,
  id: string,
  options: { name: string; skip?: boolean }
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const storageValue = localStorage.getItem(options.name);

    if (storageValue) {
      const valueById = JSON.parse(storageValue)[id];
      if (valueById) return valueById;
    }

    return initialState;
  });

  const { skip, name } = options;

  useEffect(() => {
    if (!skip) {
      const storageValue = localStorage.getItem(name);

      const parsed = storageValue && JSON.parse(storageValue);

      localStorage.setItem(
        name,
        JSON.stringify(parsed ? { ...parsed, [id]: state } : { [id]: state })
      );
    }
  }, [state, name, skip, id]);

  return [state, setState];
}

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type UseQuery = (
  name: string,
  initialValue?: string
) => [string, Dispatch<SetStateAction<string>>];

export const useSearchParams: UseQuery = (name, initialValue = '') => {
  const [query, setQuery] = useState(
    new URLSearchParams(window.location?.search).get(name) ?? initialValue
  );

  useEffect(() => {
    const hasQuery = query?.length > 0;
    const params = new URLSearchParams(window.location?.search || '');
    if (hasQuery) {
      params.set(name, query);
    } else {
      params.delete(name);
    }
    const search = params.toString();
    window.history.replaceState(
      null,
      '',
      search.length > 0
        ? `${window.location.pathname}?${params.toString()}`.replace(
            /%2C/g,
            ','
          )
        : window.location.pathname
    );
  }, [query, name]);

  return [query, setQuery];
};

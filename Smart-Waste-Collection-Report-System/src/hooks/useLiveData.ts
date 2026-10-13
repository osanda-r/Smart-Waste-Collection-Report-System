import { useEffect, useState } from "react";

export type Subscribe<T> = (next: (value: T) => void, onError: (error: Error) => void) => () => void;

/**
 * Subscribes to a Firestore listener for the lifetime of the component.
 * `key` identifies the subscription; change it when the query inputs change.
 */
export function useLiveData<T>(subscribe: Subscribe<T> | null, key: string) {
  const [state, setState] = useState<{ data: T | null; error: string | null }>({ data: null, error: null });

  useEffect(() => {
    if (!subscribe) return;
    return subscribe(
      (data) => setState({ data, error: null }),
      (err) => {
        console.error(err);
        setState({ data: null, error: err.message });
      },
    );
    // The subscription is keyed explicitly; callers pass a new key when inputs change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    data: state.data,
    error: state.error,
    loading: state.data === null && state.error === null,
  };
}

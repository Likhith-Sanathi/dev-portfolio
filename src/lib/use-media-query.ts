import { useCallback, useSyncExternalStore } from "react";

// Subscribes to a CSS media query. `serverValue` is used for the server render
// and hydration, then the real value takes over on the client.
export function useMediaQuery(query: string, serverValue: boolean) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

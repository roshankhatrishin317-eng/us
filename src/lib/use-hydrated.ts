import { useSyncExternalStore } from "react";
import { useAppStore } from "./store";

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useStoreHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribe = useAppStore.persist.onFinishHydration(onStoreChange);
      return () => unsubscribe();
    },
    () => useAppStore.persist.hasHydrated(),
    () => false
  );
}

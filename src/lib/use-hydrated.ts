"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "./store";

// Track hydration state outside React
let isHydrated = false;
const listeners = new Set<() => void>();

// Initialize hydration listener once
if (typeof window !== "undefined") {
  if (useAppStore.persist.hasHydrated()) {
    isHydrated = true;
  } else {
    useAppStore.persist.onFinishHydration(() => {
      isHydrated = true;
      listeners.forEach((listener) => listener());
    });
  }
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot() {
  return isHydrated;
}

function getServerSnapshot() {
  return false;
}

export function useStoreHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

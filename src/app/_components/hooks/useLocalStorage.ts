"use client";

import { useQueryState, type UseQueryStateOptions } from "nuqs";
import { useEffect, useState } from "react";

export function useQueryLocalStorage<T>(
  key: string,
  options: UseQueryStateOptions<T & {}>,
): [
  (T & {}) | null,
  (updateFunction: (prev: (T & {}) | null) => (T & {}) | null) => Promise<void>,
] {
  const [value, setValue] = useQueryState<T & {}>(key, options);

  useEffect(() => {
    console.log("useEffect", key);
    const item = window.localStorage.getItem(key);
    if (item && value === null) {
      console.log("setting value with key: " + key, item);
      void setValue(JSON.parse(item) as T & {});
    }
  }, [key, setValue, value]);

  async function storeValue(
    updateFunction: (prev: (T & {}) | null) => (T & {}) | null,
  ) {
    await setValue((prev) => {
      const newVal = updateFunction(prev);
      window.localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    });
  }

  return [value, storeValue];
}

// fallbackValue is the value to use if the key is not found in localStorage
export function useLocalStorage<T>(
  key: string,
  fallbackValue: T,
): [T, (updateFunction: (prev: T) => T) => void] {
  const [value, setValue] = useState<T>(fallbackValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      setValue(JSON.parse(item) as T);
    }
  }, [key]);

  function storeValue(updateFunction: (prev: T) => T) {
    setValue((prev) => {
      const newVal = updateFunction(prev);
      window.localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    });
  }

  return [value, storeValue];
}

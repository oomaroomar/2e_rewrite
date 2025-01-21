import { useEffect, useState } from "react";

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

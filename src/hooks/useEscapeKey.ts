import { useCallback, useEffect } from "react";

interface UseEscapeKeyProps {
  onEscape: () => void;
  onEscapeWithCondition?: () => void;
  condition?: boolean;
}

export function useEscapeKey({
  onEscape,
  onEscapeWithCondition,
  condition,
}: UseEscapeKeyProps) {
  const handleEscPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (condition) {
          onEscape();
        } else if (onEscapeWithCondition) {
          onEscapeWithCondition();
        }
      }
    },
    [onEscape, onEscapeWithCondition, condition],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscPress);
    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [handleEscPress]);
}

import { type RefObject, useEffect, useState } from "react";

interface useModalArgs {
  modalRef: RefObject<HTMLDivElement>;
  toggleKey?: string;
}

export default function useModal({
  modalRef,
  toggleKey,
}: useModalArgs): [boolean, (b: boolean) => void] {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const checkClickOutside = (e: MouseEvent) => {
      if (isOpen && !modalRef?.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", checkClickOutside);
    return () => {
      document.removeEventListener("mousedown", checkClickOutside);
    };
  }, [isOpen, setOpen, modalRef]);

  useEffect(() => {
    const controller = new AbortController();
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.ctrlKey && event.key === toggleKey) {
          event.preventDefault();
          setOpen(!isOpen);
        }
      },
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [isOpen, setOpen, toggleKey]);

  return [isOpen, setOpen];
}

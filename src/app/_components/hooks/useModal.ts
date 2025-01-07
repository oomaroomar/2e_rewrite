import { type RefObject, useEffect, useState } from "react";

interface useModalArgs {
  modalRef: RefObject<HTMLDivElement>;
}

export default function useModal({
  modalRef,
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

  return [isOpen, setOpen];
}

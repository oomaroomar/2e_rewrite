"use client";

import { useRef } from "react";
import useModal from "../hooks/useModal";
import { Button } from "~/components/ui/button";

export default function Dropdown({ children }: { children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useModal({
    modalRef: modalRef,
    toggleKey: "l",
  });
  return (
    <div ref={modalRef}>
      <Button onClick={() => setOpen(!isOpen)}>
        <span>Level filters</span>
      </Button>
      {isOpen && (
        <div className="absolute flex flex-col gap-y-2">{children}</div>
      )}
    </div>
  );
}

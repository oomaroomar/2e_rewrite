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
      <Button variant="outline" onClick={() => setOpen(!isOpen)}>
        <span>Level filters</span>
      </Button>
      {isOpen && (
        <div className="absolute z-20 flex w-28 flex-col rounded-md border border-pink-500 bg-white animate-in fade-in-0 slide-in-from-top-1">
          {children}
        </div>
      )}
    </div>
  );
}

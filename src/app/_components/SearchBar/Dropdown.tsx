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
        <div className="absolute z-20 flex w-24 flex-col gap-y-2 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

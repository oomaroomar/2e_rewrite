import { cn } from "~/utils";

export default function Placeholder({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full place-content-center place-items-center text-center text-6xl text-slate-300",
        className,
      )}
    >
      <div className="">{text}</div>
    </div>
  );
}

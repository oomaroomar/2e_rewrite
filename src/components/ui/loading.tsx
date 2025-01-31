import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <LoaderCircle className="animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

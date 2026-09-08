import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  className,
}: {
  value?: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-surface-2", className)}>
      <div
        className="h-full bg-primary transition-[width] duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: "default" | "outline" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-primary text-primary-fg",
        variant === "outline" && "border border-border text-muted",
        variant === "muted" && "bg-surface-2 text-muted",
        className,
      )}
      {...props}
    />
  );
}

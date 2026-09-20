import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PRODUCT } from "@/lib/product";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-bg px-4 py-8 text-fg">
      <p className="text-xs text-subtle">
        {PRODUCT.brand} · {PRODUCT.moduleName} · milomaps.org
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">{title}</h1>
      <div className="mt-6 flex flex-col gap-4 text-sm text-muted">{children}</div>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
      >
        Back to Civic Parks
      </Link>
    </div>
  );
}

// Simple rounded card primitive aligned with DESIGN.md.

import type { ReactNode } from "react";

export default function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-[18px] border border-[#E6E8EC] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}


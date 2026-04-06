// Pill-shaped button primitive aligned with DESIGN.md.

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-[#5C6AC4] text-white hover:bg-[#4F5FBA] active:scale-[0.97]",
    secondary:
      "bg-white text-[#5C6AC4] border border-[#5C6AC4] hover:bg-[#E0E7FF] active:scale-[0.97]",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] active:scale-[0.97]",
  };

  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-full px-6 h-[48px] text-[15px] font-semibold transition transform",
        "focus:outline-none focus:ring-2 focus:ring-[#7F8CFF]/60",
        variantClasses[variant],
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}


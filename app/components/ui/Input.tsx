// Rounded input primitive aligned with DESIGN.md.

import type { InputHTMLAttributes } from "react";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-[12px] border border-[#E6E8EC] bg-white px-4 h-[48px]",
        "text-[#1F2937] placeholder-[#6B7280] outline-none",
        "focus:ring-2 focus:ring-[#7F8CFF]/60 focus:border-[#7F8CFF]",
        className ?? "",
      ].join(" ")}
    />
  );
}


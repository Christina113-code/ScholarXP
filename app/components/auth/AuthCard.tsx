// Auth page container aligned with DESIGN.md (soft, centered, mobile-first).

import Card from "@/app/components/ui/Card";
import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <Card className="p-[20px]">
          <h1 className="text-[26px] font-semibold text-[#1F2937]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-[#6B7280] text-[14px]">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}


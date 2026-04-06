// Shared dashboard layout (sidebar + main area).

import type { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937]">
      <div className="flex">
        <aside className="w-[240px] bg-white border-r border-[#E6E8EC] p-[20px]">
          <div className="text-[20px] font-semibold mb-[18px]">ScholarXP</div>
          <nav className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="text-[14px] font-semibold text-[#5C6AC4] hover:underline"
            >
              Home
            </Link>
            <Link
              href="/dashboard/student"
              className="text-[14px] text-[#1F2937] hover:underline"
            >
              Student
            </Link>
            <Link
              href="/dashboard/teacher"
              className="text-[14px] text-[#1F2937] hover:underline"
            >
              Teacher
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-[20px]">{children}</main>
      </div>
    </div>
  );
}


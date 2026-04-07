// Simple class display card (used on student/teacher dashboards).

import type { ClassesRow } from "@/app/types/supabase";
import Card from "@/app/components/ui/Card";
import type { ReactNode } from "react";

export default function ClassCard({
  classRow,
  actions,
}: {
  classRow: ClassesRow;
  actions?: ReactNode;
}) {
  return (
    <Card className="p-[16px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[#1F2937] font-semibold text-[16px]">
            {classRow.name}
          </div>
          <div className="mt-2 text-[#6B7280] text-[13px]">
            Class code:{" "}
            <span className="font-semibold text-[#5C6AC4]">
              {classRow.join_code ?? "No code"}
            </span>
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </Card>
  );
}

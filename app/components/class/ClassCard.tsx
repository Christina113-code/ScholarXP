import { useState } from "react";
import Card from "@/app/components/ui/Card";
import { getAssignmentsForUserClass } from "@/app/lib/queries/assignments";
import { AssignmentsRow } from "@/app/types/supabase";
import AssignmentCard from "../assignment/AssignmentCard";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

export default function ClassCard({ classRow, actions, classId, supabase }) {
  const [open, setOpen] = useState(false);
  const [assignments, setAssignments] = useState<AssignmentsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function toggleOpen() {
    setOpen(!open);
    console.log("assignments", assignments);
    // Fetch only the first time it opens
    if (assignments.length < 1) {
      setLoading(true);
      const assignments = await getAssignmentsForUserClass(supabase, classId);
      if (!assignments) {
        setLoading(false);
        return;
      }
      setAssignments(assignments);
      setLoading(false);
    }
  }

  return (
    <Card className="p-[16px]">
      {/* Header */}
      <div
        className="flex items-start justify-between gap-4 cursor-pointer"
        onClick={toggleOpen}
      >
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

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Dropdown content */}
      {open && (
        <div className="mt-4 border-t border-gray-200 pt-3 space-y-2">
          {loading && (
            <div className="text-sm text-gray-500">Loading assignments…</div>
          )}

          {!loading && assignments?.length === 0 && (
            <div className="text-sm text-gray-500">No assignments yet</div>
          )}

          {!loading &&
            assignments?.map((a) => (
              <AssignmentCard
                a={a}
                key={a.id}
                actions={
                  <Button onClick={() => router.push(`/assignments/${a.id}`)}>
                    Start assignment
                  </Button>
                }
              />
            ))}
        </div>
      )}
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { getProblemsFromAssignmentId } from "@/app/lib/queries/assignments";
import { useParams } from "next/navigation";
export default function AssignmentPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: assignmentId } = useParams();
  useEffect(() => {
    if (!assignmentId) return;
    async function load() {
      setLoading(true);

      const problems = await getProblemsFromAssignmentId(
        supabase,
        assignmentId,
      );

      setProblems(problems);
      setLoading(false);
    }

    load();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="p-6 max-w-[420px] mx-auto text-[#6B7280]">
        Loading assignment…
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[420px] mx-auto space-y-4">
      <h1 className="text-[24px] font-semibold text-[#1F2937]">
        Assignment Problems
      </h1>

      {problems.length === 0 && (
        <div className="text-[#6B7280] text-[14px]">
          No problems found for this assignment.
        </div>
      )}

      {problems.map((p, i) => (
        <div
          key={p.id}
          className="
            bg-white 
            border border-[#E6E8EC]
            rounded-[16px]
            p-4
            shadow-sm
            space-y-2
          "
        >
          <div className="text-[14px] text-[#6B7280]">Problem {i + 1}</div>

          <div className="text-[16px] font-medium text-[#1F2937]">
            {p.prompt}
          </div>

          {p.choices && (
            <ul className="list-disc ml-5 text-[14px] text-[#1F2937]">
              {p.choices.map((choice, idx) => (
                <li key={idx}>{choice}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

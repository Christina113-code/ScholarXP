import { useState } from "react";

export default function NewSubmissionModal({
  classId,
  supabase,
  onClose,
  userId,
  assignmentId,
}) {
  const [assignmentId, setAssignmentId] = useState("");
  const [loading, setLoading] = useState(false);

  async function createSubmission() {
    setLoading(true);

    const { error } = await supabase.from("submissions").insert({
      student_id: userId,
      score: null,
      xp_earned: null,
    });

    setLoading(false);
    if (!error) onClose();
  }

  return (
    <div
      className="
      fixed inset-0 
      bg-black/30 
      backdrop-blur-sm 
      flex items-center justify-center
      z-50
    "
    >
      <div
        className="
        bg-white 
        rounded-[20px] 
        p-6 
        w-[90%] max-w-[420px]
        shadow-xl
        space-y-4
      "
      >
        {/* Header */}
        <div className="text-[20px] font-semibold text-[#1F2937]">
          New Submission
        </div>

        {/* Assignment ID */}
        <div className="space-y-1">
          <label className="text-[13px] text-[#6B7280]">Assignment ID</label>
          <input
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            className="
              w-full 
              rounded-[12px] 
              border border-[#E6E8EC] 
              p-3 
              text-[14px]
              focus:outline-none 
              focus:ring-2 focus:ring-[#7F8CFF]
              transition
            "
            placeholder="Enter assignment ID"
          />
        </div>

        {/* Student ID */}
        <div className="space-y-1">
          <label className="text-[13px] text-[#6B7280]">Student ID</label>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="
              w-full 
              rounded-[12px] 
              border border-[#E6E8EC] 
              p-3 
              text-[14px]
              focus:outline-none 
              focus:ring-2 focus:ring-[#7F8CFF]
              transition
            "
            placeholder="Enter student ID"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="
              px-4 py-2 
              rounded-full 
              border border-[#E6E8EC]
              text-[#1F2937]
              text-[14px]
              hover:bg-[#F7F8FA]
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={createSubmission}
            disabled={loading}
            className="
              px-5 py-2 
              rounded-full 
              bg-[#5C6AC4] 
              text-white 
              text-[14px]
              shadow-sm
              hover:shadow-md hover:-translate-y-[1px]
              active:scale-95
              transition-all
            "
          >
            {loading ? "Saving…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

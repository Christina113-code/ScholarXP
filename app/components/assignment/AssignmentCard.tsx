import React from "react";

const AssignmentCard = ({ a }) => {
  return (
    <div
      key={a.id}
      className="
        bg-white 
        border border-[#E6E8EC]
        rounded-[16px]
        p-4
        shadow-sm
        transition-all
        duration-200
        ease-out
        hover:shadow-md
        hover:-translate-y-[2px]
        space-y-2
      "
    >
      {/* Title */}
      <div className="text-[16px] font-semibold text-[#1F2937]">
        {a.title || "Untitled Assignment"}
      </div>

      {/* Status pill */}
      <div
        className="
          inline-block 
          px-3 py-1 
          rounded-full 
          text-[12px] 
          font-medium
          bg-[#E0E7FF]
          text-[#5C6AC4]
        "
      >
        {a.status ?? "draft"}
      </div>

      {/* Due date */}
      <div className="text-[13px] text-[#6B7280]">
        Due:{" "}
        <span className="font-medium text-[#1F2937]">
          {a.due_date
            ? new Date(a.due_date).toLocaleDateString()
            : "No due date"}
        </span>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-2 text-[12px] text-[#6B7280] pt-2">
        <div>
          <span className="font-semibold text-[#1F2937]">Created:</span>
          <br />
          {new Date(a.created_at).toLocaleDateString()}
        </div>

        <div>
          <span className="font-semibold text-[#1F2937]">Updated:</span>
          <br />
          {new Date(a.updated_at).toLocaleDateString()}
        </div>

        <div className="col-span-2">
          <span className="font-semibold text-[#1F2937]">ID:</span> {a.id}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;

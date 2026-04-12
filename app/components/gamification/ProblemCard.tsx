import React from "react";

const ProblemCard = () => {
  return (
    <div
      className="
      w-full 
      bg-white 
      border border-[#E6E8EC]
      rounded-[24px]
      p-8
      shadow-md
      space-y-6
    "
    >
      <div className="text-[22px] font-semibold text-[#1F2937]">
        Problem prompt goes here
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-[16px] bg-[#F7F8FA] border border-[#E6E8EC] text-[16px]">
          Choice A
        </div>
        <div className="p-4 rounded-[16px] bg-[#F7F8FA] border border-[#E6E8EC] text-[16px]">
          Choice B
        </div>
        <div className="p-4 rounded-[16px] bg-[#F7F8FA] border border-[#E6E8EC] text-[16px]">
          Choice C
        </div>
        <div className="p-4 rounded-[16px] bg-[#F7F8FA] border border-[#E6E8EC] text-[16px]">
          Choice D
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;

import React from "react";

const MapHeader = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="text-[16px] text-[#6B7280]">🔥 Streak: 0</div>

      <h1 className="text-[28px] font-semibold text-[#1F2937]">
        Assignment Title
      </h1>

      <div className="text-[16px] text-[#6B7280]">⭐ XP: 0</div>
    </div>
  );
};

export default MapHeader;

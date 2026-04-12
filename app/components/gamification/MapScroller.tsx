import React from "react";

const MapScroller = () => {
  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex items-center gap-10 px-2 min-w-max">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="
            w-14 h-14 rounded-full 
            bg-white 
            border-2 border-[#5C6AC4]
            shadow-sm
            flex items-center justify-center
            text-[18px] font-semibold text-[#1F2937]
          "
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapScroller;

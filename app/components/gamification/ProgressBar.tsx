import React from "react";

const ProgressBar = () => {
  return (
    <div className="w-full h-4 bg-[#E6E8EC] rounded-full overflow-hidden">
      <div className="h-full w-[40%] bg-gradient-to-r from-[#5C6AC4] to-[#7F8CFF] transition-all"></div>
    </div>
  );
};

export default ProgressBar;

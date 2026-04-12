import React from "react";

const ContinueButton = () => {
  return (
    <button
      className="
      w-full 
      h-[56px]
      rounded-full
      bg-[#5C6AC4]
      text-white
      text-[18px]
      font-medium
      shadow-sm
      hover:shadow-lg hover:-translate-y-[2px]
      active:scale-95
      transition-all
    "
    >
      Continue
    </button>
  );
};

export default ContinueButton;

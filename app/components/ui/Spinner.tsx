// Simple loading spinner.

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-[#E0E7FF] border-t-[#5C6AC4]"
        aria-label={label ?? "Loading"}
      />
      {label ? (
        <div className="text-[#6B7280] text-[13px]">{label}</div>
      ) : null}
    </div>
  );
}


// Student join form (class code -> create class_members row).

"use client";

import { useState } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { supabase } from "@/app/lib/supabase";
import { joinClassByCode } from "@/app/lib/queries/classes";

export default function JoinClassForm({
  userId,
  onJoined,
}: {
  userId: string;
  onJoined: () => void | Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setError(null);
    setLoading(true);
    try {
      const normalized = code.trim().toUpperCase();
      if (!normalized) {
        setError("Enter a class code.");
        return;
      }

      const joined = await joinClassByCode(supabase, {
        userId,
        code: normalized,
      });

      if (!joined) {
        setError("No class found for that code.");
        return;
      }

      setCode("");
      await onJoined();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to join class.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[#1F2937] font-semibold text-[15px]">
        Join a class
      </div>
      <div className="flex gap-3 items-center">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          disabled={loading}
        />
        <Button
          onClick={handleJoin}
          disabled={loading || code.trim().length === 0}
        >
          {loading ? "Joining..." : "Join"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
          {error}
        </div>
      ) : null}
    </div>
  );
}


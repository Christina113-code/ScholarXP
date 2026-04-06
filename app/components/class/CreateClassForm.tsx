// Teacher create-class form (name + code -> create classes row).

"use client";

import { useEffect, useState } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { supabase } from "@/app/lib/supabase";
import { createClass } from "@/app/lib/queries/classes";
import { generateClassCode } from "@/app/lib/code";

export default function CreateClassForm({
  teacherId,
  onCreated,
}: {
  teacherId: string;
  onCreated: () => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCode(generateClassCode());
  }, []);

  const handleCreate = async () => {
    setError(null);
    setLoading(true);
    try {
      const trimmedName = name.trim();
      const trimmedCode = code.trim().toUpperCase();

      if (!trimmedName) {
        setError("Class name is required.");
        return;
      }
      if (!trimmedCode) {
        setError("Class code is required.");
        return;
      }

      await createClass(supabase, {
        name: trimmedName,
        code: trimmedCode,
        createdBy: teacherId,
      });

      setName("");
      setCode(generateClassCode());
      await onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create class.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[#1F2937] font-semibold text-[15px]">
        Create a class
      </div>

      <div className="flex flex-col gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Class name"
          disabled={loading}
        />
        <div className="flex gap-3 items-center">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Class code"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            disabled={loading}
          />
          <Button
            variant="secondary"
            onClick={() => setCode(generateClassCode())}
            disabled={loading}
          >
            Generate
          </Button>
        </div>
      </div>

      <Button
        onClick={handleCreate}
        disabled={loading || !name.trim() || !code.trim()}
      >
        {loading ? "Creating..." : "Create class"}
      </Button>

      {error ? (
        <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
          {error}
        </div>
      ) : null}
    </div>
  );
}


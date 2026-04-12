"use client";

import { useState } from "react";

import Button from "../ui/Button";
import NewSubmissionModal from "./NewSubmissionModal";

export default function StudentActions({ classId, supabase, userId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="h-[36px] px-4 text-[13px]"
        onClick={() => setOpen(true)}
      >
        Start Assignment
      </Button>

      {open && (
        <NewSubmissionModal
          classId={classId}
          supabase={supabase}
          userId={userId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

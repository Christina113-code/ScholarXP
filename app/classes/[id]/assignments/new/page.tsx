// Multistep teacher flow: Upload -> Processing -> Review -> Create assignment.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Spinner from "@/app/components/ui/Spinner";
import { useAuthUser } from "@/app/hooks/useAuthUser";
import { useMyProfile } from "@/app/hooks/useMyProfile";
import { useAssignmentUpload } from "@/app/hooks/useAssignmentUpload";
import { useAssignmentPipeline } from "@/app/hooks/useAssignmentPipeline";
import { supabase } from "@/app/lib/supabase";
import {
  insertAssignmentProblems,
  updateAssignment,
  type NewAssignmentProblem,
} from "@/app/lib/queries/assignments";
import type { ParsedProblem } from "@/app/lib/pipeline/assignments";

type Step = "upload" | "processing" | "review" | "create";

function StepPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={[
        "px-3 h-9 rounded-full border text-[13px] font-semibold flex items-center",
        active
          ? "border-[#5C6AC4] bg-[#E0E7FF] text-[#5C6AC4]"
          : "border-[#E6E8EC] bg-white text-[#6B7280]",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const classId = params.id;

  const { user, loading: authLoading } = useAuthUser();
  const userId = user?.id ?? null;
  const { profile, loading: profileLoading } = useMyProfile(userId);

  const {
    upload,
    loading: uploading,
    error: uploadError,
  } = useAssignmentUpload();
  const {
    run: runPipeline,
    loading: processing,
    error: pipelineError,
  } = useAssignmentPipeline();
  useEffect(() => {
    console.log("DEBUG", {
      classId,
      authLoading,
      profileLoading,
      user,
      profile,
      role: profile?.role,
    });
    if (authLoading || profileLoading) return; //WAIT FOR AUTH AND PROFILE TO LOAD
    console.log("ClassId: ", classId);
    // No classId → bounce back safely
    if (!classId) {
      router.replace("/dashboard/teacher");
      return;
    }

    // Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // Profile not loaded yet
    if (profile === null) return;

    // Wrong role
    if (profile.role !== "teacher") {
      router.replace("/dashboard/student");
      return;
    }
  }, [authLoading, profileLoading, classId, user, profile, router]);
  const [step, setStep] = useState<Step>("upload");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);

  const [title, setTitle] = useState("New assignment");
  const [description, setDescription] = useState<string>("");
  const [problems, setProblems] = useState<ParsedProblem[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const canUse = useMemo(() => {
    if (authLoading || profileLoading)
      return { ok: false as const, state: "loading" as const };
    if (!userId) return { ok: false as const, state: "noauth" as const };
    if (!profile?.role) return { ok: false as const, state: "norole" as const };
    if (profile.role !== "teacher")
      return { ok: false as const, state: "notteacher" as const };
    return { ok: true as const, state: "ok" as const };
  }, [authLoading, profileLoading, userId, profile?.role]);

  if (canUse.state === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Spinner label="Loading..." />
      </div>
    );
  }
  if (canUse.state === "noauth") {
    router.replace("/login");
    return null;
  }
  if (canUse.state === "norole") {
    router.replace("/select-role");
    return null;
  }
  if (canUse.state === "notteacher") {
    router.replace("/dashboard/student");
    return null;
  }

  const startUpload = async () => {
    if (!userId) return;
    setCreateError(null);

    const pdfs = selectedFiles.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfs.length === 0) {
      alert("Please select at least one PDF.");
      return;
    }

    const { assignment, uploadedFiles } = await upload({
      classId,
      teacherId: userId,
      files: pdfs,
    });

    setAssignmentId(assignment.id);
    setStep("processing");

    const parsed = await runPipeline(uploadedFiles.map((x) => x.file));
    setProblems(parsed);
    setStep("review");
  };

  const finalize = async () => {
    if (!assignmentId) return;
    setCreating(true);
    setCreateError(null);
    try {
      const trimmedTitle = title.trim() || "Untitled assignment";
      await updateAssignment(supabase, {
        assignmentId,
        title: trimmedTitle,
        description: description.trim() ? description.trim() : null,
        status: "ready",
      });

      const rows: NewAssignmentProblem[] = problems.map((p, idx) => ({
        order_index: idx,
        type: p.type,
        prompt: p.prompt,
        choices: p.choices,
        answer: p.answer,
        metadata: p.metadata ?? null,
      }));

      await insertAssignmentProblems(supabase, {
        assignmentId,
        problems: rows,
      });
      setStep("create");

      router.replace("/dashboard/teacher");
    } catch (e) {
      setCreateError(
        e instanceof Error ? e.message : "Failed to create assignment.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4">
      <div className="max-w-[860px] mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[20px] font-semibold text-[#1F2937]">
            New assignment
          </div>
          <Button
            variant="secondary"
            className="h-[44px]"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <StepPill label="Upload" active={step === "upload"} />
          <StepPill label="Processing" active={step === "processing"} />
          <StepPill label="Review" active={step === "review"} />
          <StepPill label="Create" active={step === "create"} />
        </div>

        <Card className="p-[16px]">
          {step === "upload" ? (
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-[#1F2937] font-semibold">Upload PDFs</div>
                <div className="text-[#6B7280] text-[13px] mt-1">
                  Upload one or more worksheets. We’ll generate problems in the
                  next step.
                </div>
              </div>

              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={(e) =>
                  setSelectedFiles(Array.from(e.target.files ?? []))
                }
              />

              {selectedFiles.length > 0 ? (
                <div className="text-[13px] text-[#6B7280]">
                  Selected: {selectedFiles.map((f) => f.name).join(", ")}
                </div>
              ) : null}

              {uploadError ? (
                <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
                  {uploadError}
                </div>
              ) : null}

              <div className="flex gap-3">
                <Button
                  onClick={() => void startUpload()}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === "processing" ? (
            <div className="flex items-center justify-center py-10">
              <Spinner label="Processing PDFs..." />
            </div>
          ) : null}

          {step === "review" ? (
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-[#1F2937] font-semibold">
                  Review problems
                </div>
                <div className="text-[#6B7280] text-[13px] mt-1">
                  Quick edit before creating the assignment.
                </div>
              </div>

              {pipelineError ? (
                <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
                  {pipelineError}
                </div>
              ) : null}

              <div className="grid gap-3">
                {problems.map((p, idx) => (
                  <Card key={idx} className="p-[16px]">
                    <div className="text-[13px] font-semibold text-[#6B7280] mb-2">
                      Problem {idx + 1}
                    </div>
                    <Input
                      value={p.prompt}
                      onChange={(e) => {
                        const next = [...problems];
                        next[idx] = { ...p, prompt: e.target.value };
                        setProblems(next);
                      }}
                    />
                    <div className="mt-3 text-[13px] text-[#6B7280]">
                      Choices: {p.choices.join(" · ")} — Answer:{" "}
                      {p.choices[p.answer.choiceIndex] ?? "?"}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-[16px]">
                <div className="text-[#1F2937] font-semibold mb-3">
                  Assignment details
                </div>
                <div className="grid gap-3">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                </div>
              </Card>

              {createError ? (
                <div className="rounded-[14px] border border-[#EF4444] bg-[#EF4444]/10 p-3 text-[#EF4444] text-[13px]">
                  {createError}
                </div>
              ) : null}

              <div className="flex gap-3">
                <Button
                  onClick={() => void finalize()}
                  disabled={creating || processing || problems.length === 0}
                >
                  {creating ? "Creating..." : "Create assignment"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStep("upload");
                    setProblems([]);
                    setSelectedFiles([]);
                    setAssignmentId(null);
                  }}
                  disabled={creating}
                >
                  Start over
                </Button>
              </div>
            </div>
          ) : null}

          {step === "create" ? (
            <div className="flex items-center justify-center py-10">
              <Spinner label="Finalizing..." />
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

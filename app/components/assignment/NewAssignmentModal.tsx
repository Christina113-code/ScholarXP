"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { supabase } from "@/app/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { parseAssignmentFiles } from "@/app/lib/pipeline/assignments";
import { useAssignmentPipeline } from "@/app/hooks/useAssignmentPipeline";
import type { ParsedProblem } from "@/app/lib/pipeline/assignments";
export default function NewAssignmentModal({ classId, onClose }) {
  const [step, setStep] = useState(1);

  // Step 1: File upload
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Step 2: AI‑generated problems
  const [problems, setProblems] = useState<ParsedProblem[]>([]);

  const [scanning, setScanning] = useState(false);
  const {
    run,
    loading: parsing,
    error: parsingError,
  } = useAssignmentPipeline();
  // Step 3: User edits
  const updateProblem = (index, field, value) => {
    setProblems((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  // Step 4: Assignment metadata
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  // Step 5: Final creation
  const [creating, setCreating] = useState(false);

  const convertIndexToLetter = (num: number) => {
    return String.fromCharCode(65 + num);
  };
  const handleUpload = async () => {
    setUploading(true);
    try {
      // Upload files to Supabase storage
      const uploaded = [];

      for (const file of files) {
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage
          .from("assignments")
          .upload(path, file);

        if (error) console.log(error);

        uploaded.push({
          file_path: path,
          file_type: file.type,
        });
      }

      // Simulate AI scanning step
      setScanning(true);
      setStep(2);

      const parsedProblems = await run(files, description); // ParsedProblem[]
      console.log("parsed problems", parsedProblems);
      // 4. Push into your modal state
      setProblems(parsedProblems);
      setScanning(false);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAssignment = async () => {
    setCreating(true);
    try {
      // 1. Create assignment row
      const { data: assignment, error: aErr } = await supabase
        .from("assignments")
        .insert({
          class_id: classId,
          title,
          due_date: dueDate || null,
          status: "draft",
        })
        .select()
        .single();

      if (aErr) throw aErr;

      // // 2. Insert files
      // for (const f of files) {
      //   await supabase.from("assignment_files").insert({
      //     assignment_id: assignment.id,
      //     file_path: f.file_path,
      //     file_type: f.file_type,
      //   });
      // }

      // 3. Insert problems
      for (let i = 0; i < problems.length; i++) {
        const p = problems[i];
        await supabase.from("assignment_problems").insert({
          assignment_id: assignment.id,
          order_index: i,
          type: p.type,
          prompt: p.prompt,
          choices: p.choices ?? null,
          answer: p.answer ?? null,
          metadata: p.metadata ?? null,
        });
      }

      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };
  const BackButton = () => (
    <button
      onClick={() => setStep(step - 1)}
      className="text-[#6B7280] hover:text-[#1F2937] text-sm font-medium"
    >
      ← Back
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-semibold text-[#1F2937]">
            Create Assignment
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#1F2937]"
          >
            ✕
          </button>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-[14px] text-[#6B7280]">
                Upload worksheets or problem files. We’ll extract the problems
                automatically.
              </p>

              <Input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
              <p className="text-[14px] text-[#6B7280]">
                Describe the assignment topic in detail
              </p>
              <Input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
              >
                {uploading ? "Uploading…" : "Next"}
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 text-[#6B7280]"
            >
              <BackButton />
              Scanning files and generating problems…
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <BackButton />
              <h3 className="text-[16px] font-semibold text-[#1F2937]">
                Review & Edit Problems
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {problems.map((p, i) => (
                  <div
                    key={i}
                    className="bg-[#F7F8FA] rounded-xl p-4 border border-[#E6E8EC] space-y-3"
                  >
                    {/* Question Number */}
                    <div className="text-[14px] font-semibold text-[#1F2937]">
                      Question {i + 1}
                    </div>

                    {/* Prompt */}
                    <Input
                      value={p.prompt}
                      onChange={(e) =>
                        updateProblem(i, "prompt", e.target.value)
                      }
                      placeholder="Problem prompt"
                    />

                    {/* Multiple Choice */}
                    {p.choices && (
                      <div className="mt-2 space-y-2">
                        {p.choices.map((c, ci) => {
                          const label = String.fromCharCode(65 + ci); // A, B, C, D...

                          return (
                            <div key={ci} className="flex items-center gap-2">
                              <div className="w-6 text-[14px] font-medium text-[#6B7280]">
                                {label}.
                              </div>
                              <Input
                                value={c}
                                onChange={(e) => {
                                  const newChoices = [...p.choices];
                                  newChoices[ci] = e.target.value;
                                  updateProblem(i, "choices", newChoices);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Answer Label */}
                    <div className="text-[13px] text-[#6B7280] font-medium">
                      {p.answer.choiceIndex ? "Correct Answer" : "Answer"}
                    </div>

                    <Input
                      value={
                        p.type == "multiple_choice"
                          ? convertIndexToLetter(p.answer.choiceIndex)
                          : p.answer
                      }
                      onChange={(e) =>
                        updateProblem(i, "answer", e.target.value)
                      }
                      placeholder={
                        p.choices ? "Correct answer (e.g., B)" : "Answer"
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={() => setStep(4)}>Next</Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <BackButton />
              <h3 className="text-[16px] font-semibold text-[#1F2937]">
                Assignment Details
              </h3>

              <Input
                placeholder="Assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <Button onClick={() => setStep(5)}>Preview</Button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <BackButton />
              <h3 className="text-[16px] font-semibold text-[#1F2937]">
                Preview Assignment
              </h3>

              <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#E6E8EC] space-y-2 max-h-[250px] overflow-y-auto">
                <p className="font-semibold">{title}</p>
                <p className="text-[13px] text-[#6B7280]">
                  Due: {dueDate || "No due date"}
                </p>

                <hr className="my-2" />

                {problems.map((p, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-medium">{p.prompt}</p>

                    {p.choices && (
                      <ul className="list-disc ml-5 text-[14px]">
                        {p.choices.map((c, ci) => (
                          <li key={ci}>{c}</li>
                        ))}
                      </ul>
                    )}

                    <p className="text-[#22C55E] text-[14px]">
                      Answer:{" "}
                      {p.choices
                        ? String.fromCharCode(65 + p.answer.choiceIndex) // A/B/C/D
                        : p.answer}
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={handleCreateAssignment} disabled={creating}>
                {creating ? "Creating…" : "Create Assignment"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

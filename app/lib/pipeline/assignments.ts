// Local (client-side) placeholder pipeline.
// In the future this will parse PDFs and generate problems.

export type ParsedProblem = {
  type: "multiple_choice";
  prompt: string;
  choices: string[];
  answer: { choiceIndex: number };
  metadata?: Record<string, unknown>;
};

export async function parseAssignmentFiles(files: File[]): Promise<ParsedProblem[]> {
  // Minimal stub: generate a couple of demo problems per file.
  const out: ParsedProblem[] = [];
  for (const f of files) {
    out.push({
      type: "multiple_choice",
      prompt: `(${f.name}) What is 2 + 2?`,
      choices: ["3", "4", "5", "22"],
      answer: { choiceIndex: 1 },
      metadata: { sourceFile: f.name },
    });
    out.push({
      type: "multiple_choice",
      prompt: `(${f.name}) What is 5 × 3?`,
      choices: ["8", "15", "53", "10"],
      answer: { choiceIndex: 1 },
      metadata: { sourceFile: f.name },
    });
  }
  return out;
}


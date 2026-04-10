// Local (client-side) placeholder pipeline.
// In the future this will parse PDFs and generate problems.
import { ParsedProblem } from "@/app/types/problemsets";
import { q } from "framer-motion/client";
import ollama from "ollama/browser";

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
export async function extractPdfFromClient(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:4001/extract", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "PDF extraction failed");
  }

  const { text } = await res.json();
  return text;
}

function parseCsv(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    // Handle escaped quotes ("")
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
      continue;
    }

    // Toggle quote mode
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    // Split on commas only when not inside quotes
    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((s) => s.trim());
}
function safeSplitCSV(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}
function repairChoicesArrays(raw: string): string {
  return raw.replace(/("choices"\s*:\s*\[[^\]]*?)("answerIndex")/g, "$1], $2");
}

export function parseLLMJsonToProblems(jsonText: string): ParsedProblem[] {
  let raw: any;

  try {
    raw = JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse LLM JSON:", e, jsonText);
    return [];
  }

  if (!Array.isArray(raw)) return [];

  const problems: ParsedProblem[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;

    if (item.type === "multiple_choice") {
      if (
        !Array.isArray(item.choices) ||
        typeof item.prompt !== "string" ||
        typeof item.answerIndex !== "number"
      ) {
        continue;
      }

      problems.push({
        type: "multiple_choice",
        prompt: item.prompt.trim(),
        choices: item.choices.map((c: string) => String(c).trim()),
        answer: { choiceIndex: item.answerIndex },
      });
    }

    if (item.type === "frq") {
      problems.push({
        type: "frq",
        prompt: item.prompt.trim(),
        answer: item.answer.trim(),
      });
    }
  }

  return problems;
}

export async function passTexttoLLM(raw_text: string) {
  const prompt = `
You are a problem generator. Generate 6-7 problems. Type is either mutliple_choice or frq.
Return ONLY valid JSON. No explanations, no markdown. No comments, no trailing commas, no missing brackets. Fill in answers to frq.

Return ONLY JSON, like:
[
  {
    "type": "multiple_choice",
    "prompt": "What is 2+2?",
    "choices": ["1","2","3","4"],
    "answerIndex": 3
  },
  {
    "type": "frq",
    "prompt": "Explain the Pythagorean theorem.",
    "answer": "generate an answer here"
  }
]
CONTENT FOR PROBLEM GENERATION:
${raw_text}
`;

  const stream = await ollama.generate({
    model: "llama3",
    prompt,
    // stream: true,
  });
  console.log("raw res:", stream.response);
  return parseLLMJsonToProblems(stream.response);
}
export async function parseAssignmentFiles(
  files: File[],
  description: string,
): Promise<ParsedProblem[]> {
  // Minimal stub: generate a couple of demo problems per file.
  const parsed_problems = await passTexttoLLM(description);
  // for (let i = 0; i < files.length; i++) {
  //   // const file = files[i];

  //   //parse pdf somehow - save for later, might replace with diff thing that can parse pdfs betterr
  //   // const raw_text = await extractPdfFromClient(file);

  //   //pass user description to llm

  // }
  console.log(typeof parsed_problems);
  return parsed_problems;
}

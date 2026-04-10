import { Ollama } from "ollama/browser";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

export async function* streamLLMChat(
  userMessage: string,
  description: string,
  files: File[],
) {
  // Convert uploaded files to text (placeholder — you can add PDF/OCR later)
  const fileTexts = await Promise.all(
    files.map(async (file) => {
      const text = await file.text();
      return `FILE: ${file.name}\n${text}`;
    }),
  );

  const systemPrompt = `
You are ScholarXP, an AI teaching assistant that helps educators build interactive assignments.

Tone:
- Calm, encouraging, minimalistic
- ScholarXP design system: soft geometry, gentle colors, clarity first

Your job:
- Read the teacher's description
- Read any uploaded files
- Read the teacher's chat message
- Respond conversationally, like NotebookLM or Claude
- DO NOT generate problems here — only assist the teacher
- Keep responses concise and helpful
`;

  const fullPrompt = `
${systemPrompt}

ASSIGNMENT DESCRIPTION:
${description}

UPLOADED FILES:
${fileTexts.join("\n\n")}

TEACHER MESSAGE:
${userMessage}

ASSISTANT RESPONSE:
`;

  const stream = await ollama.generate({
    model: "llama3",
    prompt: fullPrompt,
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.response ?? "";
    yield token;
  }
}

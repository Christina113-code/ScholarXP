import mammoth from "mammoth";

export async function extractPdfClientSide(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/extract", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to extract PDF");
  }
  const { text } = await res.json();
  return text;
}

export async function extractTextFromDocxBuffer(
  buffer: Buffer,
): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}
// A dictionary of known file signatures → MIME types
const SIGNATURES: Record<string, string> = {
  "89504e47": "image/png",
  "47494638": "image/gif",
  ffd8ffe0: "image/jpeg",
  "25504446": "application/pdf",
  "504b0304":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

// Convert first 4 bytes of a File/Blob into a hex signature
export async function getFileSignature(file: File): Promise<string> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Detect MIME type from signature
export async function detectMimeType(file: File): Promise<string | null> {
  const signature = await getFileSignature(file);
  return SIGNATURES[signature] ?? null;
}

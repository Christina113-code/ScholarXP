// Small utilities for class codes.

const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid confusing chars

export function generateClassCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * ALPHANUM.length);
    out += ALPHANUM[idx]!;
  }
  return out;
}


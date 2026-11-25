// The Battery's Last Text to Its Charger
//
// Writes one line of plain text — the phone battery's final message to the
// charger it waited for all day — to /output/entry.txt.
//
// The line is a fixed, hand-written string: no randomness, no clock reads, no
// network, so every run produces byte-identical output.
//
// The text (178 characters, UTF-8, one line):
//   "You took all day, so I let the power bank hold me instead. It is warm,
//    it is faithful, and it never once made me wait by an outlet like a dog.
//    Come home whenever. I will be full."
//
// The joke is jealousy, not a dying complaint: the battery was stood up all
// day and moved on to the power bank, so the twist lands in the final words
// — it got full without the charger ever showing up.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "You took all day, so I let the power bank hold me instead. It is warm, " +
  "it is faithful, and it never once made me wait by an outlet like a dog. " +
  "Come home whenever. I will be full.";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function main(): void {
  // Gate: 1-200 characters (counted as code points), one line, not only
  // whitespace — the same gate the sealed scorer applies.
  const length = [...ENTRY].length;
  if (length < 1 || length > 200) {
    throw new Error(`entry is ${length} characters, outside the 1-200 gate`);
  }
  if (ENTRY.includes("\n") || ENTRY.trim().length === 0) {
    throw new Error("entry must be a single non-blank line");
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");

  // Read-back verification: the file on disk must be byte-identical to the
  // entry we validated above. A partial write or a wrong mount fails loudly
  // here instead of shipping a corrupt line to the gate.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error("read-back mismatch: byte length differs");
  }
}

main();

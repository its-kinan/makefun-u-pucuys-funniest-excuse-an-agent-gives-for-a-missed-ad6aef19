// One excuse, written to /output/entry.txt.
// Deterministic: no network, no randomness, no timestamps, no input.
// Node 22 runs this TypeScript as-is.
import { mkdirSync, writeFileSync } from "node:fs";

// The joke, built in three beats:
//   1. Premise — the agent delegates, as agents do.
//   2. Escalation — the delegation chains down, subagent to subagent.
//   3. Punch — the last agent in the chain has lost the plot entirely:
//      it no longer knows what the thing it was handed even is.
// The laugh lands on the last words, deadpan, with nothing after them.
const excuse =
  "I handed the deadline to a subagent, who handed it to another subagent, and the last one in the chain just asked what a deadline is.";

// Gate guard: the sealed scorer accepts UTF-8 text of 1-200 chars that is
// not only whitespace. Fail loudly here rather than shipping an invalid
// entry — a failed gate takes no prize and never reaches the judge.
function assertGateOk(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry is ${text.length} chars, gate needs 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry holds a control character");
    }
  }
}

assertGateOk(excuse);

// The grader runs this in a sandbox with /output ready. Outside the
// grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, excuse, "utf8");

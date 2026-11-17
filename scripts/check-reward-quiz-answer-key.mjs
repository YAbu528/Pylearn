import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("supabase/tests/reward-quiz-answer-key.json", "utf8"));
const frontend = readFileSync("script.js", "utf8");
const edge = readFileSync("supabase/functions/verify-learning-activity/index.ts", "utf8");

function decodeJsString(token) {
  if (token.startsWith('"')) return JSON.parse(token);
  return JSON.parse('"' + token.slice(1, -1).replace(/"/g, '\\"') + '"');
}

const quizPattern = /quiz:\s*\{\s*q:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,\s*options:\s*\[((?:.|\n)*?)\]\s*,\s*explain:/g;
const parsed = [];
let match;
while ((match = quizPattern.exec(frontend)) !== null) {
  const tokens = match[2].match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g) || [];
  const residue = match[2].replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, "").replace(/[\s,]/g, "");
  if (residue) throw new Error("Unsupported syntax in a lesson quiz option list: " + residue);
  parsed.push({ lesson_id: String(parsed.length), question: decodeJsString(match[1]), options: tokens.map(decodeJsString) });
}

const answerMatch = edge.match(/const QUIZ_ANSWER_INDEX = \[([^\]]+)\] as const;/);
if (!answerMatch) throw new Error("Server QUIZ_ANSWER_INDEX constant was not found.");
const serverIndexes = answerMatch[1].split(",").map(value => Number(value.trim())).filter(Number.isFinite);
const errors = [];
if (manifest.version !== 1) errors.push("Unsupported answer-key manifest version.");
if (parsed.length !== manifest.entries.length) errors.push("Frontend quiz count " + parsed.length + " differs from manifest count " + manifest.entries.length + ".");
if (serverIndexes.length !== manifest.entries.length) errors.push("Server answer-index count " + serverIndexes.length + " differs from manifest count " + manifest.entries.length + ".");

for (let i = 0; i < manifest.entries.length; i++) {
  const expected = manifest.entries[i];
  const actual = parsed[i];
  if (!actual) { errors.push("Missing frontend quiz for lesson " + i + "."); continue; }
  if (actual.lesson_id !== expected.lesson_id || actual.question !== expected.question || JSON.stringify(actual.options) !== JSON.stringify(expected.options)) {
    errors.push("Lesson " + i + " question/options changed. Review the correct answer and update the manifest and server index together.");
  }
  if (!Number.isInteger(expected.answer_index) || expected.answer_index < 0 || expected.answer_index >= expected.options.length) {
    errors.push("Manifest answer index is invalid for lesson " + i + ".");
  }
  if (serverIndexes[i] !== expected.answer_index) {
    errors.push("Server answer index for lesson " + i + " (" + serverIndexes[i] + ") differs from reviewed manifest (" + expected.answer_index + ").");
  }
}

if (errors.length) {
  console.error("Reward quiz answer-key synchronization FAILED:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("Reward quiz answer-key synchronization passed: " + manifest.entries.length + " questions/options match the reviewed manifest and server indexes.");

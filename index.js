import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

const parsed = JSON.parse(payloadRaw);
if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid input');
const { paths } = parsed;
if (!Array.isArray(paths)) throw new Error('Invalid input');

const counts = Object.create(null);
let total = 0;

for (const p of paths) {
  if (typeof p !== 'string') throw new Error('Invalid input');
  const lastSlash = p.lastIndexOf('/');
  const segment = lastSlash >= 0 ? p.slice(lastSlash + 1) : p;
  const dot = segment.lastIndexOf('.');
  const ext = dot > 0 ? segment.slice(dot) : '<none>';
  counts[ext] = (counts[ext] || 0) + 1;
  total++;
}

const extensions = Object.keys(counts).sort();
const sortedCounts = Object.create(null);
for (const ext of extensions) sortedCounts[ext] = counts[ext];

const result = { counts: sortedCounts, extensions, total };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const navigation = JSON.parse(
  fs.readFileSync(path.join(root, 'content', 'navigation.json'), 'utf8')
);

const countMatches = (text, regex) => (text.match(regex) || []).length;

let failures = 0;

for (const [part, chapters] of Object.entries(navigation.chapters)) {
  const dir = path.join(root, 'content', part);
  if (!fs.existsSync(dir)) {
    console.log(`MISSING DIR part ${part}`);
    failures += 1;
    continue;
  }
  const files = fs.readdirSync(dir);
  if (!files.includes('intro.md') && !files.some((f) => !/^[a-z]\.md$/.test(f))) {
    console.log(`MISSING intro for part ${part}`);
    failures += 1;
  }
  for (const [letter] of Object.entries(chapters)) {
    const candidates = [
      path.join(dir, `${letter}.md`),
      path.join(dir, `part${part}${letter}.md`),
    ];
    const file = candidates.find((candidate) => fs.existsSync(candidate));
    if (!file) {
      console.log(`MISSING part ${part}${letter}`);
      failures += 1;
      continue;
    }
    const raw = fs.readFileSync(file, 'utf8');
    const text = raw.replace(/```[\s\S]*?```/g, '');
    if (!/lang:\s*ar/.test(raw)) {
      console.log(`NOT ARABIC part ${part}${letter}`);
      failures += 1;
    }
    const fences = countMatches(text, /```/g);
    if (fences % 2 !== 0) {
      console.log(`UNBALANCED FENCES part ${part}${letter}: ${fences}`);
      failures += 1;
    }
    const openDivs = countMatches(text, /<div\b/g);
    const closeDivs = countMatches(text, /<\/div>/g);
    if (openDivs !== closeDivs) {
      console.log(
        `UNBALANCED DIVS part ${part}${letter}: ${openDivs}/${closeDivs}`
      );
      failures += 1;
    }
  }
}

console.log(failures === 0 ? 'ALL OK' : `${failures} problems`);
process.exit(failures === 0 ? 0 : 1);

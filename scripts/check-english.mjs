import fs from 'node:fs';
import path from 'node:path';

const root = '/home/zeyad/projects/fullstack-open-ar/content';

const strip = (text) =>
  text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/&[a-z]+;/g, ' ');

const commonEnglish = new Set([
  'the', 'and', 'this', 'that', 'with', 'you', 'for', 'are', 'have', 'not',
  'can', 'will', 'from', 'when', 'your', 'but', 'what', 'how', 'which',
  'there', 'about', 'into', 'more', 'than', 'then', 'them', 'they', 'also',
  'use', 'used', 'using', 'should', 'would', 'could', 'make', 'made', 'its',
  'it', 'is', 'of', 'to', 'in', 'on', 'as', 'at', 'be', 'by', 'or', 'an',
  'we', 'our', 'their', 'these', 'those', 'been', 'was', 'were', 'has',
]);

let issues = 0;

for (const part of fs.readdirSync(root)) {
  const dir = path.join(root, part);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const text = strip(fs.readFileSync(path.join(dir, file), 'utf8'));
    const words = text
      .toLowerCase()
      .match(/[a-z']{2,}/g) || [];
    const english = words.filter((w) => commonEnglish.has(w));
    if (english.length > 8) {
      console.log(`${part}/${file}: ${english.length} english stopwords`);
      issues += 1;
    }
  }
}

console.log(issues === 0 ? 'NO ENGLISH LEFTOVERS' : `${issues} files to review`);

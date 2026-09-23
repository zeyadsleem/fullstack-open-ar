import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcesDir = path.join(root, 'sources', 'mooc');
const outDir = path.join(root, 'content-src', 'en');
const imagesDir = path.join(root, 'static', 'images', 'mooc');

const BASE = 'https://courses.mooc.fi/api/v0/course-material';

const COURSES = [
  { part: 6, slug: 'full-stack-open-state-management' },
  { part: 7, slug: 'full-stack-open-extension' },
  { part: 8, slug: 'full-stack-open-graphql' },
  { part: 9, slug: 'full-stack-open-typescript' },
  { part: 10, slug: 'full-stack-open-react-native' },
  { part: 11, slug: 'full-stack-open-continuous-integration' },
  { part: 12, slug: 'full-stack-open-containers' },
  { part: 13, slug: 'full-stack-open-relational-databases' },
  { part: 14, slug: 'full-stack-open-nextjs' },
];

const exerciseCacheFile = path.join(root, 'sources', 'exercises.json');
const exerciseCache = fs.existsSync(exerciseCacheFile)
  ? JSON.parse(fs.readFileSync(exerciseCacheFile, 'utf8'))
  : {};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const fetchExerciseName = async (id) => {
  if (exerciseCache[id]) return exerciseCache[id];
  const data = await getJson(`${BASE}/exercises/${id}`);
  const name = data?.exercise?.name || null;
  exerciseCache[id] = name;
  await sleep(50);
  return name;
};

const downloadImage = async (url) => {
  const urlObj = new URL(url);
  const ext = path.extname(urlObj.pathname) || '.png';
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 12);
  const filename = `${hash}${ext}`;
  const target = path.join(imagesDir, filename);
  if (!fs.existsSync(target)) {
    const res = await fetch(url);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(target, buffer);
    }
  }
  return `/images/mooc/${filename}`;
};

const codeLanguage = (code) => {
  const trimmed = code.trim();
  if (/^\s*(npx|npm|pnpm|yarn|git|docker|kubectl|cd|mkdir|curl|sudo|\$)\b/m.test(trimmed))
    return 'bash';
  if (/^\s*(SELECT|INSERT|CREATE|ALTER|DROP|UPDATE)\b/im.test(trimmed)) return 'sql';
  if (/^\s*[{[]/.test(trimmed) && /":/.test(trimmed)) return 'json';
  if (/^\s*<(!DOCTYPE|html|div|p|h1|head|body)\b/i.test(trimmed)) return 'html';
  if (/\b(interface|type)\s+\w+\s*=/.test(trimmed) || /: (string|number|boolean)\b/.test(trimmed))
    return 'ts';
  if (/\b(import|export|const|let|function|return|=>|class)\b/.test(trimmed)) return 'js';
  return null;
};

const inline = (text) => (text || '').trim();

const convertBlocks = async (blocks, ctx) => {
  let md = '';
  for (const block of blocks || []) {
    const { name, attributes, innerBlocks } = block;
    switch (name) {
      case 'core/paragraph': {
        md += `\n${inline(attributes.content)}\n`;
        break;
      }
      case 'core/heading': {
        const level = Math.min(Math.max(attributes.level || 3, 2), 4);
        md += `\n${'#'.repeat(level)} ${inline(attributes.content)}\n`;
        break;
      }
      case 'core/list': {
        let i = 1;
        for (const item of innerBlocks || []) {
          const marker = attributes.ordered ? `${i}. ` : '- ';
          md += `${marker}${inline(item.attributes.content)}\n`;
          i += 1;
        }
        md += '\n';
        break;
      }
      case 'core/list-item': {
        md += `- ${inline(attributes.content)}\n`;
        break;
      }
      case 'core/quote': {
        const text = (innerBlocks || [])
          .map((b) => inline(b.attributes.content))
          .join('\n\n');
        md += `\n> ${text.replace(/\n\n/g, '\n>\n> ')}\n`;
        break;
      }
      case 'core/code': {
        const lang = codeLanguage(attributes.content || '') || '';
        md += `\n\`\`\`${lang}\n${attributes.content || ''}\n\`\`\`\n`;
        break;
      }
      case 'core/image': {
        const src = await downloadImage(attributes.url);
        const alt = attributes.alt && attributes.alt !== 'Add alt' ? attributes.alt : 'صورة توضيحية';
        md += `\n![${alt}](${src})\n`;
        break;
      }
      case 'core/separator': {
        md += '\n---\n';
        break;
      }
      case 'moocfi/exercise': {
        const exerciseName = await fetchExerciseName(attributes.id);
        const label = exerciseName ? `**${exerciseName}**` : '**تمرين**';
        md += `\n<div class="tasks">\n\n${label}\n\n</div>\n`;
        break;
      }
      case 'moocfi/aside': {
        const inner = await convertBlocks(innerBlocks, ctx);
        md += `\n<div class="note">\n${inner}\n</div>\n`;
        break;
      }
      case 'moocfi/hero-section':
      case 'moocfi/lock-chapter':
      case 'moocfi/exercises-in-chapter':
      case 'moocfi/pages-in-chapter': {
        break;
      }
      default: {
        const inner = await convertBlocks(innerBlocks, ctx);
        md += inner;
      }
    }
  }
  return md;
};

const cleanMarkdown = (md) =>
  md
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();

const run = async () => {
  fs.mkdirSync(imagesDir, { recursive: true });

  for (const { part, slug } of COURSES) {
    const data = JSON.parse(
      fs.readFileSync(path.join(sourcesDir, `${slug}.json`), 'utf8')
    );
    const partDir = path.join(outDir, `part-${part}`);
    fs.mkdirSync(partDir, { recursive: true });

    const sorted = [...data.pages].sort(
      (a, b) => (a.chapter || 0) - (b.chapter || 0)
    );

    let index = 0;
    for (const page of sorted) {
      const letter = String.fromCharCode(97 + index);
      const body = cleanMarkdown(await convertBlocks(page.content, { part }));
      const frontmatter = [
        '---',
        `part: ${part}`,
        `letter: ${letter}`,
        `title: ${JSON.stringify(page.title || page.chapterName || '')}`,
        `mainImage: /images/part-${part}.svg`,
        'lang: en',
        '---',
        '',
      ].join('\n');
      fs.writeFileSync(
        path.join(partDir, `${letter}.md`),
        `${frontmatter}${body}\n`
      );
      index += 1;
    }

    const chapterList = sorted
      .map((p, i) => {
        const letter = String.fromCharCode(97 + i);
        return `${letter}. ${p.title}`;
      })
      .join('\n');
    fs.writeFileSync(
      path.join(partDir, 'intro.md'),
      `---\npart: ${part}\nmainImage: /images/part-${part}.svg\nlang: en\n---\n\n<div class="intro">\n\n${chapterList}\n\n</div>\n`
    );

    console.log(`part ${part}: ${sorted.length} chapters imported`);
  }

  fs.writeFileSync(
    exerciseCacheFile,
    JSON.stringify(exerciseCache, null, 1)
  );
  console.log('done');
};

run();

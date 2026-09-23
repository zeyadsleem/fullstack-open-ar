import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');
const generatedDir = path.join(root, 'src', 'lib', 'generated');

const navigation = JSON.parse(
  fs.readFileSync(path.join(contentDir, 'navigation.json'), 'utf8')
);

const markdown = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true })
          .value;
      } catch (e) {
        return '';
      }
    }
    return '';
  },
});

const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slugifyHeading = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const normalizeLinks = (html) => {
  return html
    .replace(/(src|href)="(?:\.\.\/){1,3}images\//g, '$1="/images/content/')
    .replace(/(src|href)="(?:\.\.\/){1,3}assets\//g, '$1="/assets/')
    .replace(
      /(src|href)="https:\/\/fullstackopen\.com\/images\//g,
      '$1="/images/content/'
    );
};

const addHeadingIds = (html) => {
  return html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gs,
    (match, level, attrs, inner) => {
      if (/id=/.test(attrs)) return match;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      const id = slugifyHeading(text);
      if (!id) return match;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );
};

const extractHeadings = (html) => {
  const headings = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gs;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      depth: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').trim(),
    });
  }
  return headings;
};

const stripHtml = (html) =>
  html
    .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeText = (text) =>
  text.replace(/[\u064B-\u065F\u0670]/g, '').toLowerCase();

const run = () => {
  fs.rmSync(generatedDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(generatedDir, 'content'), { recursive: true });

  const manifest = { parts: [], chapters: {} };
  const searchIndex = [];

  const partNumbers = Object.keys(navigation.chapters)
    .map(Number)
    .sort((a, b) => a - b);

  for (const part of partNumbers) {
    const partKey = String(part);
    const partDir = path.join(contentDir, partKey);
    const partInfo = navigation.parts[partKey] || {};
    const chaptersNav = navigation.chapters[partKey] || {};

    if (!fs.existsSync(partDir)) continue;

    const files = fs.readdirSync(partDir).filter((f) => f.endsWith('.md'));
    const partChapters = [];
    let intro = null;

    for (const file of files) {
      const raw = fs.readFileSync(path.join(partDir, file), 'utf8');
      const { data, content } = matter(raw);
      const letter = data.letter ? String(data.letter) : null;

      let html = markdown.render(content);
      html = normalizeLinks(html);
      html = addHeadingIds(html);

      const chapterNav = letter ? chaptersNav[letter] : null;
      const entry = {
        part,
        letter,
        file,
        title: chapterNav ? chapterNav.title : partInfo.title || `الجزء ${part}`,
        slug: chapterNav ? chapterNav.slug : null,
        mainImage: data.mainImage
          ? data.mainImage.replace(/^(\.\.\/)+images\//, '/images/')
          : `/images/part-${part}.svg`,
        headings: extractHeadings(html),
        html,
      };

      if (!letter) {
        intro = entry;
        continue;
      }

      const outDir = path.join(generatedDir, 'content', partKey);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(
        path.join(outDir, `${letter}.json`),
        JSON.stringify(entry)
      );

      partChapters.push({
        letter,
        title: entry.title,
        slug: entry.slug,
        mainImage: entry.mainImage,
      });

      searchIndex.push({
        part,
        letter,
        title: entry.title,
        slug: entry.slug,
        partTitle: partInfo.title || `الجزء ${part}`,
        text: normalizeText(stripHtml(html)).slice(0, 3000),
      });
    }

    if (intro) {
      fs.writeFileSync(
        path.join(generatedDir, 'content', partKey, 'intro.json'),
        JSON.stringify(intro)
      );
    }

    if (partChapters.length > 0) {
      manifest.parts.push({
        part,
        title: partInfo.title || `الجزء ${part}`,
        description: partInfo.description || '',
        color: partInfo.color || '#5555ff',
        chapters: partChapters,
      });
    }
  }

  fs.writeFileSync(
    path.join(generatedDir, 'manifest.json'),
    JSON.stringify({ parts: manifest.parts })
  );
  fs.writeFileSync(
    path.join(generatedDir, 'search-index.json'),
    JSON.stringify({ chapters: searchIndex })
  );

  console.log(
    `Generated ${manifest.parts.length} parts, ${searchIndex.length} chapters`
  );
};

run();

import manifest from './generated/manifest.json';
import { withBasePath } from './html.js';

/**
 * @typedef {{ letter: string, slug: string, title: string }} Chapter
 * @typedef {{ part: number, title: string, description: string, color: string, chapters: Chapter[] }} Part
 * @typedef {{ id: string, text: string, depth: number }} Heading
 * @typedef {{ part: number, letter: string, slug: string, title: string, headings: Heading[], html: string }} Content
 * @typedef {{ part: number, chapter: Chapter } | null} ChapterLink
 * @typedef {{ prev: ChapterLink, next: ChapterLink }} ChapterNeighbours
 */

/** @type {Part[]} */
export const parts = manifest.parts;

const contentModules = import.meta.glob('/src/lib/generated/content/*/*.json');

/**
 * @param {unknown} value
 * @returns {value is { default: Content }}
 */
const isContentModule = (value) =>
  typeof value === 'object' && value !== null && 'default' in value;

/**
 * @param {string} key
 * @returns {Promise<Content | null>}
 */
const loadContent = async (key) => {
  const loader = contentModules[key];
  if (!loader) return null;
  const mod = await loader();
  return isContentModule(mod) ? mod.default : null;
};

/**
 * @param {string | number} part
 * @returns {Part | null}
 */
export const getPart = (part) =>
  parts.find((p) => p.part === Number(part)) || null;

/**
 * @param {string | number} part
 * @param {Chapter} chapter
 * @returns {string}
 */
export const chapterPath = (part, chapter) =>
  withBasePath(`/part${part}/${chapter.slug}`);

/**
 * @param {string | number} part
 * @returns {string}
 */
export const partPath = (part) => withBasePath(`/part${part}`);

/**
 * @param {string | number} part
 * @param {string} letter
 * @returns {Chapter | null}
 */
export const getChapter = (part, letter) => {
  const partData = getPart(part);
  if (!partData) return null;
  return partData.chapters.find((c) => c.letter === letter) || null;
};

/**
 * @param {string | number} part
 * @param {string} letter
 * @returns {Promise<Content | null>}
 */
export const loadChapterContent = async (part, letter) =>
  loadContent(`/src/lib/generated/content/${part}/${letter}.json`);

/**
 * @param {string | number} part
 * @returns {Promise<Content | null>}
 */
export const loadPartIntro = async (part) =>
  loadContent(`/src/lib/generated/content/${part}/intro.json`);

/**
 * @param {string | number} part
 * @param {string} letter
 * @returns {ChapterNeighbours}
 */
export const getPrevNext = (part, letter) => {
  const partData = getPart(part);
  if (!partData) return { prev: null, next: null };
  const index = partData.chapters.findIndex((c) => c.letter === letter);
  const prev =
    index > 0
      ? { part: Number(part), chapter: partData.chapters[index - 1] }
      : null;
  const next =
    index >= 0 && index < partData.chapters.length - 1
      ? { part: Number(part), chapter: partData.chapters[index + 1] }
      : null;
  return { prev, next };
};

/**
 * @param {string | number} part
 * @returns {{ prevPart: Part | null, nextPart: Part | null }}
 */
export const getPrevNextPart = (part) => {
  const index = parts.findIndex((p) => p.part === Number(part));
  return {
    prevPart: index > 0 ? parts[index - 1] : null,
    nextPart: index >= 0 && index < parts.length - 1 ? parts[index + 1] : null,
  };
};

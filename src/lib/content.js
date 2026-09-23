import manifest from './generated/manifest.json';
import { withBasePath } from './html.js';

export const parts = manifest.parts;

const contentModules = import.meta.glob('/src/lib/generated/content/*/*.json');

export const getPart = (part) =>
  parts.find((p) => p.part === Number(part)) || null;

export const chapterPath = (part, chapter) =>
  withBasePath(`/part${part}/${chapter.slug}`);

export const partPath = (part) => withBasePath(`/part${part}`);

export const getChapter = (part, letter) => {
  const partData = getPart(part);
  if (!partData) return null;
  return partData.chapters.find((c) => c.letter === letter) || null;
};

export const loadChapterContent = async (part, letter) => {
  const key = `/src/lib/generated/content/${part}/${letter}.json`;
  const loader = contentModules[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
};

export const loadPartIntro = async (part) => {
  const key = `/src/lib/generated/content/${part}/intro.json`;
  const loader = contentModules[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
};

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

export const getPrevNextPart = (part) => {
  const index = parts.findIndex((p) => p.part === Number(part));
  return {
    prevPart: index > 0 ? parts[index - 1] : null,
    nextPart: index >= 0 && index < parts.length - 1 ? parts[index + 1] : null,
  };
};

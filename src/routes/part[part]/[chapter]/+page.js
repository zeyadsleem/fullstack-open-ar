import { error } from '@sveltejs/kit';
import {
  getPart,
  getPrevNext,
  loadChapterContent,
  parts,
} from '$lib/content.js';

export const entries = () =>
  parts.flatMap((p) =>
    p.chapters.map((c) => ({ part: String(p.part), chapter: c.slug }))
  );

export async function load({ params }) {
  const part = getPart(params.part);
  if (!part) {
    throw error(404, 'الجزء غير موجود');
  }
  const chapter = part.chapters.find((c) => c.slug === params.chapter);
  if (!chapter) {
    throw error(404, 'الفصل غير موجود');
  }
  const content = await loadChapterContent(part.part, chapter.letter);
  const { prev, next } = getPrevNext(part.part, chapter.letter);

  return { part, chapter, content, prev, next };
}

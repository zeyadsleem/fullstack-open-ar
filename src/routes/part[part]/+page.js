import { error } from '@sveltejs/kit';
import { getPart, getPrevNextPart, parts } from '$lib/content.js';

export const entries = () => parts.map((p) => ({ part: String(p.part) }));

export async function load({ params }) {
  const part = getPart(params.part);
  if (!part) {
    throw error(404, 'الجزء غير موجود');
  }
  const { prevPart, nextPart } = getPrevNextPart(params.part);
  return { part, prevPart, nextPart };
}

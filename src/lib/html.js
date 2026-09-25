import { base } from '$app/paths';

/**
 * @param {string} path
 * @returns {string}
 */
export const withBasePath = (path) => (base ? `${base}${path}` : path);

/**
 * @param {string | null | undefined} html
 * @returns {string | null | undefined}
 */
export const withBase = (html) => {
  if (!html || !base) return html;
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${base}/`);
};

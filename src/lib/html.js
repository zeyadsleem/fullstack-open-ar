import { base } from '$app/paths';

export const withBasePath = (path) => (base ? `${base}${path}` : path);

export const withBase = (html) => {
  if (!html || !base) return html;
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${base}/`);
};

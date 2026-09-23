import adapter from '@sveltejs/adapter-static';

const base = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    paths: {
      base,
      relative: true,
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true,
    }),
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'ignore',
      handleInvalidUrl: 'ignore',
    },
  },
};

export default config;

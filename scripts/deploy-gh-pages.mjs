import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');

const run = (command, args, options = {}) =>
  execFileSync(command, args, { encoding: 'utf8', ...options });

const remote = run('git', ['remote', 'get-url', 'origin'], { cwd: root }).trim();
const match = remote.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
if (!match) {
  console.error(`تعذّر استخراج اسم المستودع من: ${remote}`);
  process.exit(1);
}
const owner = match[1];
const repo = match[2];
const repoUrl = `git@github.com:${owner}/${repo}.git`;

console.log(`بناء الموقع للمسار /${repo} ...`);
run('node', ['scripts/build-content.mjs'], { cwd: root, stdio: 'inherit' });
run('node', ['node_modules/vite/bin/vite.js', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, BASE_PATH: `/${repo}` },
});

if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
  console.error('لم يُنتج البناء ملف index.html — توقف النشر.');
  process.exit(1);
}

let branchExists = false;
try {
  const heads = run('git', ['ls-remote', '--heads', repoUrl, 'gh-pages']);
  branchExists = heads.trim().length > 0;
} catch (error) {
  console.error(`تعذّر الاتصال بالمستودع: ${error.message}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${repo}-gh-pages-`));
try {
  if (branchExists) {
    console.log('جلب فرع gh-pages من المستودع...');
    run(
      'git',
      ['clone', '--depth', '1', '--branch', 'gh-pages', repoUrl, tmp],
      { stdio: 'pipe' }
    );
  } else {
    console.log('فرع gh-pages غير موجود — سيُنشأ فرع جديد.');
    run('git', ['init', '-b', 'gh-pages'], { cwd: tmp });
    run('git', ['remote', 'add', 'origin', repoUrl], { cwd: tmp });
  }

  for (const entry of fs.readdirSync(tmp)) {
    if (entry !== '.git') {
      fs.rmSync(path.join(tmp, entry), { recursive: true, force: true });
    }
  }

  const copy = (source, target) => {
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      const from = path.join(source, entry.name);
      const to = path.join(target, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(to, { recursive: true });
        copy(from, to);
      } else if (entry.isFile()) {
        fs.copyFileSync(from, to);
      }
    }
  };
  copy(buildDir, tmp);

  run('git', ['add', '-A'], { cwd: tmp });
  run('git', ['commit', '-m', `deploy: ${new Date().toISOString()}`, '--allow-empty'], {
    cwd: tmp,
    stdio: 'inherit',
  });
  run('git', ['push', 'origin', 'gh-pages'], { cwd: tmp, stdio: 'inherit' });
  console.log(`تم النشر: https://${owner}.github.io/${repo}/`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

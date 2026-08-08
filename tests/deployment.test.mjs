import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('GitHub Actions validates and deploys the public guide', async () => {
  const workflow = await read('.github/workflows/validate-and-deploy.yml');

  assert.match(workflow, /npm test/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path:\s*dist/);
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /pull_request:/);
});

test('generated and local files stay out of version control', async () => {
  const gitignore = await read('.gitignore');

  assert.match(gitignore, /^dist\/$/m);
  assert.match(gitignore, /^node_modules\/$/m);
  assert.match(gitignore, /^dogfood-output\/$/m);
});

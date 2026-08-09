import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('repository publishes clear metadata and validation scripts', async () => {
  const packageJson = JSON.parse(await read('package.json'));

  assert.equal(packageJson.name, 'fde-insight');
  assert.equal(packageJson.private, false);
  assert.equal(packageJson.scripts.test, 'node --test tests/*.test.mjs');
  assert.equal(packageJson.repository.url, 'https://github.com/Wishyouerehere9610/fde-insight.git');
  assert.equal(packageJson.homepage, 'https://wishyouerehere9610.github.io/fde-insight/');
});

test('README documents Skill installation and GitHub Pages', async () => {
  const readme = await read('README.md');

  assert.match(readme, /npx skills add Wishyouerehere9610\/fde-insight/);
  assert.match(readme, /--skill fde-insight/);
  assert.match(readme, /^# FDE Insight$/mu);
  assert.match(readme, /GitHub Pages/);
  assert.match(readme, /FDE 不是传统驻场外包/);
  assert.match(readme, /^## 安装 Skill$/mu);
  assert.match(readme, /^## 项目结构$/mu);
  assert.doesNotMatch(readme, /^## (Use|Browse|Repository|Evidence|Development|License)/mu);
});

test('source and licensing boundaries are explicit', async () => {
  const [notice, softwareLicense, contentLicense] = await Promise.all([
    read('NOTICE.md'),
    read('LICENSE'),
    read('CONTENT-LICENSE'),
  ]);

  assert.match(notice, /不在本仓库分发原始 PDF/);
  assert.match(notice, /腾讯研究院/);
  assert.match(softwareLicense, /MIT License/);
  assert.match(contentLicense, /Creative Commons Attribution 4\.0/);
});

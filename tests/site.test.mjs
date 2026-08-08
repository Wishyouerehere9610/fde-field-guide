import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('site has semantic structure and useful metadata', async () => {
  const html = await read('index.html');

  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /name="description"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<header/);
  assert.match(html, /<nav/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /<footer/);
  assert.match(html, /aria-live="polite"/);
});

test('site exposes the ontology and Skill installation', async () => {
  const html = await read('index.html');

  assert.match(html, /id="ontology-graph"/);
  assert.match(html, /data-ontology-filter="role"/);
  assert.match(html, /data-ontology-filter="stage"/);
  assert.match(html, /data-ontology-filter="asset"/);
  assert.match(html, /data-ontology-filter="risk"/);
  assert.match(html, /npx skills add Wishyouerehere9610\/fde-field-guide/);
  assert.match(html, /--skill fde-insight/);
  assert.match(html, /<title>FDE Insight<\/title>/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="app\.js"/);
});

test('styles support responsive layout, focus, themes, and reduced motion', async () => {
  const css = await read('styles.css');

  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.doesNotMatch(css, /#[0-9a-f]{6}[^\n]*#[0-9a-f]{6}[^\n]*#[0-9a-f]{6}[^\n]*#[0-9a-f]{6}/i);
});

test('ontology explorer loads shared data and handles failure', async () => {
  const script = await read('app.js');

  assert.match(script, /knowledge\/fde-ontology\.json/);
  assert.match(script, /data-ontology-filter/);
  assert.match(script, /aria-pressed/);
  assert.match(script, /catch\s*\(/);
  assert.match(script, /createElementNS/);
  assert.doesNotMatch(script, /window\.addEventListener\(['"]scroll/);
});

test('public copy avoids common AI writing tells', async () => {
  const [html, css, script] = await Promise.all([
    read('index.html'),
    read('styles.css'),
    read('app.js'),
  ]);
  const publicText = `${html}\n${css}\n${script}`;

  assert.doesNotMatch(publicText, /[—–]/u);
  assert.doesNotMatch(publicText, /seamless|revolutionize|next-gen|unlock the power|elevate your/i);
  assert.doesNotMatch(publicText, /Scroll to explore|Quietly trusted|From the field/i);
});

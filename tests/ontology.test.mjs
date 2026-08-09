import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const allowedNodeTypes = new Set([
  'role',
  'stage',
  'mechanism',
  'capability',
  'deliverable',
  'metric',
  'risk',
  'asset',
  'system',
  'principle',
  'market',
  'job-profile',
  'compensation',
]);
const allowedRelationTypes = new Set([
  'owns',
  'produces',
  'measured_by',
  'mitigates',
  'depends_on',
  'feeds_back_to',
  'reused_in',
  'precedes',
  'enables',
  'governs',
  'observed_in',
  'requires',
  'compared_with',
]);

async function loadOntology() {
  const content = await readFile(new URL('knowledge/fde-insight.graph.json', root), 'utf8');
  return JSON.parse(content);
}

test('ontology has broad, typed coverage', async () => {
  const ontology = await loadOntology();
  const seenTypes = new Set(ontology.nodes.map((node) => node.type));

  assert.equal(ontology.meta.version, '2.1.0');
  assert.equal(ontology.meta.schemaVersion, '1.0.0');
  assert.ok(ontology.nodes.length >= 95, 'expected at least 95 knowledge nodes');
  assert.deepEqual(seenTypes, allowedNodeTypes);
});

test('ontology nodes are unique, sourced, and defined', async () => {
  const ontology = await loadOntology();
  const ids = ontology.nodes.map((node) => node.id);

  assert.equal(new Set(ids).size, ids.length, 'node IDs must be unique');
  for (const node of ontology.nodes) {
    assert.ok(allowedNodeTypes.has(node.type), `unknown type: ${node.type}`);
    assert.match(node.id, /^[a-z0-9-]+$/);
    assert.ok(node.name.length >= 2, `missing name: ${node.id}`);
    assert.ok(node.definition.length >= 24, `thin definition: ${node.id}`);
    assert.ok(node.sourceRefs.length > 0, `missing source: ${node.id}`);
  }
});

test('relations use valid endpoints and explicit verbs', async () => {
  const ontology = await loadOntology();
  const ids = new Set(ontology.nodes.map((node) => node.id));

  assert.ok(ontology.relations.length >= 120, 'expected a connected graph');
  for (const relation of ontology.relations) {
    assert.ok(ids.has(relation.from), `missing relation source: ${relation.from}`);
    assert.ok(ids.has(relation.to), `missing relation target: ${relation.to}`);
    assert.ok(allowedRelationTypes.has(relation.type), `unknown relation: ${relation.type}`);
  }
});

test('core FDE operating loop is represented', async () => {
  const ontology = await loadOntology();
  const ids = new Set(ontology.nodes.map((node) => node.id));
  const required = [
    'principle-frontline-learning',
    'principle-sedimentation-first',
    'role-fde',
    'role-echo',
    'role-delta',
    'stage-discovery',
    'stage-production',
    'stage-reuse',
    'deliverable-runnable-demo',
    'deliverable-evaluation-set',
    'asset-skill',
    'asset-connector',
    'metric-adoption-rate',
    'metric-reuse-rate',
    'risk-demo-trap',
    'risk-outsourcing-drift',
    'principle-dual-distillation',
    'role-fdpm',
    'mechanism-ontology-feedback-form',
    'mechanism-internal-settlement',
    'mechanism-privacy-isolation',
    'stage-ontology-maturity',
    'system-ontology-layer',
  ];

  for (const id of required) assert.ok(ids.has(id), `missing core node: ${id}`);
});

test('domain schema and ALE provenance are published', async () => {
  const [schema, analysis] = await Promise.all([
    readFile(new URL('knowledge/fde-insight.schema.json', root), 'utf8').then(JSON.parse),
    readFile(new URL('knowledge/report-analysis.json', root), 'utf8').then(JSON.parse),
  ]);

  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.ok(schema.$defs.nodeType.enum.includes('mechanism'));
  assert.equal(analysis.extraction.tool, 'ALE CLI');
  assert.equal(analysis.extraction.status, 'success');
  assert.equal(analysis.extraction.verifiedPages, 83);
  assert.equal(analysis.extraction.elements.headings, 196);
  assert.equal(analysis.extraction.elements.tables, 54);
  assert.equal(analysis.extraction.elements.images, 41);
  assert.equal(analysis.source.redistributed, false);
  assert.equal(analysis.publicKnowledge.pageIndex, 'knowledge/report-page-index.json');
});

test('public page index covers every report page without reproducing the report', async () => {
  const index = JSON.parse(await readFile(new URL('knowledge/report-page-index.json', root), 'utf8'));
  const pages = index.pages.map((page) => page.page);

  assert.deepEqual(pages, Array.from({ length: 83 }, (_, index) => index + 1));
  assert.equal(new Set(pages).size, 83);
  for (const page of index.pages) {
    assert.ok(page.kind.length >= 2, `missing kind for page ${page.page}`);
    assert.ok(page.section.length >= 2, `missing section for page ${page.page}`);
    assert.ok(page.summary.length >= 12, `thin summary for page ${page.page}`);
    assert.match(page.sourceRef, new RegExp(`^report:p${page.page}$`));
    assert.equal(page.fullTextPublished, false);
  }
});

test('ontology includes sourced market, job, and compensation knowledge', async () => {
  const ontology = await loadOntology();
  const ids = new Set(ontology.nodes.map((node) => node.id));
  const required = [
    'market-overseas-fde-2026',
    'market-china-fde-2026',
    'job-profile-fde-core',
    'compensation-overseas-fde-2026',
    'compensation-china-fde-tiers-2026',
  ];

  for (const id of required) assert.ok(ids.has(id), `missing market knowledge: ${id}`);
  for (const node of ontology.nodes.filter((node) => required.includes(node.id))) {
    assert.ok(node.sourceRefs.some((ref) => ref.startsWith('report:p')));
    assert.ok(node.sourceRefs.includes('needs-verification'));
  }
});

test('source map states page evidence and publication limits', async () => {
  const sourceMap = await readFile(new URL('knowledge/source-map.md', root), 'utf8');

  assert.match(sourceMap, /第 8-17 页/);
  assert.match(sourceMap, /第 28-40 页/);
  assert.match(sourceMap, /第 47-60 页/);
  assert.match(sourceMap, /不分发原始 PDF/);
  assert.match(sourceMap, /ALE CLI/);
  assert.match(sourceMap, /196 个标题/);
  assert.match(sourceMap, /必须重新核验/);
});

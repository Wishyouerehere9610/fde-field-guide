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
]);

async function loadOntology() {
  const content = await readFile(new URL('knowledge/fde-insight.graph.json', root), 'utf8');
  return JSON.parse(content);
}

test('ontology has broad, typed coverage', async () => {
  const ontology = await loadOntology();
  const seenTypes = new Set(ontology.nodes.map((node) => node.type));

  assert.equal(ontology.meta.version, '2.0.0');
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
});

test('source map states page evidence and publication limits', async () => {
  const sourceMap = await readFile(new URL('knowledge/source-map.md', root), 'utf8');

  assert.match(sourceMap, /Pages 8-17/);
  assert.match(sourceMap, /Pages 28-40/);
  assert.match(sourceMap, /Pages 47-60/);
  assert.match(sourceMap, /not redistributed/i);
  assert.match(sourceMap, /ALE CLI/);
  assert.match(sourceMap, /196 headings/);
  assert.match(sourceMap, /Needs current verification/);
});

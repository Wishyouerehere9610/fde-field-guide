import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const allowedNodeTypes = new Set([
  'role',
  'stage',
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
  const content = await readFile(new URL('knowledge/fde-ontology.json', root), 'utf8');
  return JSON.parse(content);
}

test('ontology has broad, typed coverage', async () => {
  const ontology = await loadOntology();
  const seenTypes = new Set(ontology.nodes.map((node) => node.type));

  assert.equal(ontology.meta.version, '1.0.0');
  assert.ok(ontology.nodes.length >= 45, 'expected at least 45 knowledge nodes');
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

  assert.ok(ontology.relations.length >= 50, 'expected a connected graph');
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
  ];

  for (const id of required) assert.ok(ids.has(id), `missing core node: ${id}`);
});

test('source map states page evidence and publication limits', async () => {
  const sourceMap = await readFile(new URL('knowledge/source-map.md', root), 'utf8');

  assert.match(sourceMap, /Pages 8-17/);
  assert.match(sourceMap, /Pages 28-40/);
  assert.match(sourceMap, /Pages 47-60/);
  assert.match(sourceMap, /not redistributed/i);
  assert.match(sourceMap, /Needs current verification/);
});

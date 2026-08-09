import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('Skill metadata is discoverable without summarizing the workflow', async () => {
  const skill = await read('SKILL.md');
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
  const description = frontmatter.match(/^description:\s*(.+)$/mu)?.[1] ?? '';

  assert.match(frontmatter, /^name: fde-insight$/mu);
  assert.match(description, /^Use when /);
  assert.match(description, /FDE|Forward Deployed Engineer/);
  assert.match(description, /training|interview|delivery|customer/i);
  assert.ok(description.length <= 500, 'description should remain concise');
  assert.doesNotMatch(description, /first|then|workflow|load the ontology/i);
});

test('Skill routes questions into shared knowledge and playbooks', async () => {
  const skill = await read('SKILL.md');
  const requiredReferences = [
    'knowledge/fde-insight.schema.json',
    'knowledge/fde-insight.graph.json',
    'knowledge/report-analysis.json',
    'knowledge/concepts.md',
    'knowledge/lifecycle.md',
    'knowledge/roles-and-operating-model.md',
    'knowledge/metrics-and-risks.md',
    'knowledge/source-map.md',
    'playbooks/answer-protocol.md',
    'playbooks/training.md',
    'playbooks/project-diagnosis.md',
    'playbooks/interview-and-career.md',
  ];

  for (const reference of requiredReferences) assert.match(skill, new RegExp(reference.replaceAll('.', '\\.') ));
});

test('Skill enforces evidence labels and direct answers', async () => {
  const skill = await read('SKILL.md');

  assert.match(skill, /Direct answer first/);
  assert.match(skill, /Source finding/);
  assert.match(skill, /Engineering judgment/);
  assert.match(skill, /Needs verification/);
  assert.match(skill, /Do not invent metrics/i);
  assert.match(skill, /not staff augmentation/i);
});

test('production answers cover the full Agent operating surface', async () => {
  const protocol = await read('playbooks/answer-protocol.md');
  const requiredTerms = [
    'tools',
    'state',
    'permissions',
    'failure recovery',
    'evaluation',
    'trace',
    'cost',
    'release gate',
    'rollback',
  ];

  for (const term of requiredTerms) assert.match(protocol.toLowerCase(), new RegExp(term));
});

test('pressure scenarios cover practical FDE questions', async () => {
  const scenarios = JSON.parse(await read('tests/scenarios.json'));
  const intents = new Set(scenarios.map((scenario) => scenario.intent));

  assert.ok(scenarios.length >= 10);
  for (const intent of ['definition', 'project', 'training', 'interview', 'career', 'metrics', 'organization', 'production']) {
    assert.ok(intents.has(intent), `missing scenario intent: ${intent}`);
  }
  for (const scenario of scenarios) {
    assert.ok(scenario.prompt.length >= 8);
    assert.ok(scenario.mustInclude.length > 0);
    assert.ok(scenario.mustAvoid.length > 0);
  }
});

test('Skill remains concise and contains no banned dash characters', async () => {
  const skill = await read('SKILL.md');
  const wordCount = skill.split(/\s+/u).filter(Boolean).length;

  assert.ok(wordCount <= 650, `SKILL.md is too long: ${wordCount} words`);
  assert.doesNotMatch(skill, /[—–]/u);
});

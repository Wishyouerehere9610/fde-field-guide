import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('Skill metadata is Chinese and discoverable without summarizing the workflow', async () => {
  const skill = await read('SKILL.md');
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
  const description = frontmatter.match(/^description:\s*(.+)$/mu)?.[1] ?? '';

  assert.match(frontmatter, /^name: fde-insight$/mu);
  assert.match(description, /^当用户/);
  assert.match(description, /FDE|Forward Deployed Engineer/);
  assert.match(description, /培训|面试|交付|客户/);
  assert.ok(description.length <= 500, 'description should remain concise');
  assert.doesNotMatch(description, /首先|然后|工作流|加载本体/);
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
    'knowledge/report-page-index.json',
    'knowledge/jobs-and-compensation.md',
    'knowledge/industry-and-market.md',
    'knowledge/compensation-market.md',
    'knowledge/compensation-market.json',
    'playbooks/answer-protocol.md',
    'playbooks/training.md',
    'playbooks/project-diagnosis.md',
    'playbooks/interview-and-career.md',
  ];

  for (const reference of requiredReferences) assert.match(skill, new RegExp(reference.replaceAll('.', '\\.') ));
});

test('Skill enforces evidence labels and direct answers', async () => {
  const skill = await read('SKILL.md');

  assert.match(skill, /先给结论/);
  assert.match(skill, /报告结论/);
  assert.match(skill, /工程判断/);
  assert.match(skill, /待核验事实/);
  assert.match(skill, /不得编造指标/);
  assert.match(skill, /不是传统驻场外包/);
  assert.match(skill, /薪酬|待遇/);
  assert.match(skill, /行业现状|招聘趋势/);
  assert.match(skill, /采集窗口/);
});

test('career knowledge preserves salary samples and their limits', async () => {
  const content = await read('knowledge/jobs-and-compensation.md');
  for (const term of ['273 条', '153 条', '196,489', '187,500', '8-25K', '60-85K', '2026 年 4-7 月']) {
    assert.match(content, new RegExp(term.replaceAll('-', '\\-')));
  }
  assert.match(content, /不能作为当前 Offer/);
  assert.match(content, /重新核验/);
});

test('industry knowledge covers market structure and trend questions', async () => {
  const content = await read('knowledge/industry-and-market.md');
  for (const term of ['岗位名称显性化', '招聘主体扩散', '强 FDE', '中美差异', '30 条以上']) {
    assert.match(content, new RegExp(term));
  }
  assert.match(content, /report:p64-79/);
  assert.match(content, /待核验事实/);
});

test('production answers cover the full Agent operating surface', async () => {
  const protocol = await read('playbooks/answer-protocol.md');
  const requiredTerms = ['工具', '状态', '权限', '故障恢复', '评测', '链路追踪', '成本', '发布门禁', '回滚'];

  for (const term of requiredTerms) assert.match(protocol, new RegExp(term));
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

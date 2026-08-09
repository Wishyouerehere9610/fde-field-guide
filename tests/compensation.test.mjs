import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function loadMarket() {
  return JSON.parse(await readFile(new URL('knowledge/compensation-market.json', root), 'utf8'));
}

test('compensation market keeps currencies and pay periods explicit', async () => {
  const market = await loadMarket();

  assert.equal(market.meta.checkedAt, '2026-08-09');
  assert.ok(market.records.length >= 14);
  for (const record of market.records) {
    assert.match(record.currency, /^[A-Z]{3}$/);
    assert.ok(['month', 'year'].includes(record.period));
    assert.ok(Number.isFinite(record.baseMin));
    assert.ok(Number.isFinite(record.baseMax));
    assert.ok(record.baseMin <= record.baseMax);
    assert.ok(record.sources.length > 0);
    assert.ok(record.sources.every((source) => source.url.startsWith('https://')));
    assert.ok(['direct', 'indexed', 'cross-checked'].includes(record.verification));
  }
});

test('compensation market covers major Chinese and overseas employers', async () => {
  const market = await loadMarket();
  const companies = new Set(market.records.map((record) => record.company));

  for (const company of ['字节跳动', '腾讯', '阿里云', '蚂蚁集团', '智谱 AI', 'OpenAI', 'Anthropic', 'Palantir']) {
    assert.ok(companies.has(company), `missing compensation employer: ${company}`);
  }
});

test('domestic compensation records preserve salary-month assumptions', async () => {
  const market = await loadMarket();
  const byteDance = market.records.find((record) => record.id === 'cn-bytedance-doubao-fde');
  const tencent = market.records.find((record) => record.id === 'cn-tencent-ai-fde');
  const alibaba = market.records.find((record) => record.id === 'cn-alibabacloud-fde');

  assert.deepEqual([byteDance.currency, byteDance.period, byteDance.baseMin, byteDance.baseMax, byteDance.payPeriods], ['CNY', 'month', 35000, 70000, 15]);
  assert.deepEqual([tencent.currency, tencent.period, tencent.baseMin, tencent.baseMax, tencent.payPeriods], ['CNY', 'month', 35000, 65000, 15]);
  assert.deepEqual([alibaba.currency, alibaba.period, alibaba.baseMin, alibaba.baseMax, alibaba.payPeriods], ['CNY', 'month', 20000, 50000, 16]);
});

test('official overseas postings retain base salary and equity notes', async () => {
  const market = await loadMarket();
  const openai = market.records.find((record) => record.id === 'us-openai-fde-sf');
  const anthropic = market.records.find((record) => record.id === 'us-anthropic-applied-ai-engineer');
  const palantir = market.records.find((record) => record.id === 'us-palantir-fdse-nyc');

  assert.deepEqual([openai.currency, openai.period, openai.baseMin, openai.baseMax, openai.equity], ['USD', 'year', 162000, 280000, 'offered']);
  assert.deepEqual([anthropic.currency, anthropic.period, anthropic.baseMin, anthropic.baseMax], ['USD', 'year', 200000, 320000]);
  assert.deepEqual([palantir.currency, palantir.period, palantir.baseMin, palantir.baseMax], ['USD', 'year', 135000, 200000]);
  assert.equal(openai.verification, 'direct');
  assert.equal(anthropic.verification, 'direct');
  assert.equal(palantir.verification, 'direct');
});

test('compensation guide explains source quality and conflicting samples', async () => {
  const guide = await readFile(new URL('knowledge/compensation-market.md', root), 'utf8');

  for (const term of ['币种', '月薪', '年基薪', '股权', '直接核验', '搜索索引', '冲突样本', '不能直接换算总包']) {
    assert.match(guide, new RegExp(term));
  }
  assert.match(guide, /30-60K/);
  assert.match(guide, /40-60K/);
});

# Report Knowledge Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 83 页报告转成完整的公开知识索引，并补齐 FDE 岗位、薪酬和行业现状问答能力。

**Architecture:** 使用逐页摘要索引证明覆盖范围，使用专题 Markdown 承载可读知识，使用领域图谱承载可关联事实。所有时效性数据保留采集窗口、样本口径、页码和 `needs-verification` 标签。

**Tech Stack:** JSON、Markdown、Node.js `node:test`、JSON Schema、GitHub Pages

---

### Task 1: 定义覆盖契约

**Files:**
- Modify: `tests/ontology.test.mjs`
- Modify: `tests/skill.test.mjs`
- Modify: `tests/repository.test.mjs`

- [ ] 写入逐页覆盖、岗位薪酬、行业现状和 Skill 路由的失败测试。
- [ ] 运行 `npm test`，确认因文件缺失和路由缺失而失败。

### Task 2: 发布报告知识资产

**Files:**
- Create: `knowledge/report-page-index.json`
- Create: `knowledge/jobs-and-compensation.md`
- Create: `knowledge/industry-and-market.md`
- Modify: `knowledge/report-analysis.json`
- Modify: `knowledge/source-map.md`

- [ ] 创建 83 页逐页索引，保证页码连续且摘要非空。
- [ ] 写入岗位薪酬和行业专题，保留样本、窗口、页码和限制。
- [ ] 更新解析清单和来源映射，区分原始解析与公开知识资产。

### Task 3: 扩展本体与 Skill

**Files:**
- Modify: `knowledge/fde-insight.schema.json`
- Modify: `knowledge/fde-insight.graph.json`
- Modify: `SKILL.md`
- Modify: `tests/scenarios.json`

- [ ] 增加市场、岗位画像和薪酬类型及必要关系。
- [ ] 增加报告样本实体，统一标记时效性证据。
- [ ] 增加薪酬、招聘和行业问题路由与压力场景。

### Task 4: 更新公开说明并验证

**Files:**
- Modify: `README.md`

- [ ] 更新数据概览和项目结构。
- [ ] 运行 `npm test`，确认全部测试通过。
- [ ] 检查 JSON、Git 状态和 GitHub Pages 构建输入。
- [ ] 提交并推送 `main`，等待 GitHub Actions 成功。

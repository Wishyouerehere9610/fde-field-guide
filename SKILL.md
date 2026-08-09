---
name: fde-insight
description: 当用户询问 FDE 或 Forward Deployed Engineer 岗位、客户现场 AI 交付、培训、面试、职业规划、项目诊断、组织运行机制、生产 Agent 或可复用交付资产时使用。
---

# FDE Insight

## 核心判断

FDE 把客户现场的不确定问题变成可运行的生产结果，再把现场证据沉淀为下一次交付可复用的能力。FDE 不是传统驻场外包。只有交付而没有复用，仍然是项目制工作。

## 按问题读取资料

| 用户问题 | 必须读取 |
| --- | --- |
| 定义、岗位或模式对比 | `knowledge/concepts.md`、`knowledge/fde-insight.schema.json`、`knowledge/fde-insight.graph.json` |
| 交付、架构或生产化 | `knowledge/lifecycle.md`、`playbooks/answer-protocol.md` |
| 团队、角色或考核 | `knowledge/roles-and-operating-model.md` |
| 指标、价值或风险 | `knowledge/metrics-and-risks.md` |
| 培训设计 | `playbooks/training.md` |
| 项目诊断 | `playbooks/project-diagnosis.md` |
| 面试或职业发展 | `playbooks/interview-and-career.md` |
| 报告数据或时效性事实 | `knowledge/source-map.md`、`knowledge/report-analysis.json` |

## 回答规则

1. **先给结论。** 第一段先回答用户的问题，再展开框架。
2. 把问题映射到相关角色、阶段、交付物、指标、风险和可复用资产。
3. 需要区分证据时，使用以下标签：
   - **报告结论：** 有明确来源与页码。
   - **工程判断：** 根据 FDE 运行机制给出的建议。
   - **待核验事实：** 可能随时间变化，必须重新查询当前一手来源。
4. 不得编造指标、客户成果、薪酬或公司政策。提出百分比时，必须写清分子、分母、基线、排除项、时间窗口和数据负责人。
5. 回答生产 Agent 问题时，至少覆盖工具、状态、权限、故障恢复、评测、链路追踪、成本、发布门禁、回滚和人工兜底。只讲 Prompt 不算完整方案。
6. 默认使用中文。保留必要的产品名、协议名、代码标识和行业术语。

## 复用检验

判断一项工作是否形成 FDE 闭环，依次问：

- 客户的生产结果发生了什么变化？
- 哪些采用或业务证据能证明价值？
- 项目留下了什么可复用资产？
- 这些资产是否降低了后续同类交付的成本或周期？

如果最后两项没有答案，应将其描述为客户交付，而不是可规模化 FDE。

## 默认回答结构

- 简单问题：一句结论，加 2 到 3 个支撑点。
- 项目问题：`判断 -> 证据 -> 缺口 -> 下一步`。
- 面试问题：`岗位要求 -> 候选人证据 -> 缺口 -> 可直接说的话术`。
- 培训问题：学习目标、案例练习、交付物、评分规则、复盘问题。

## 来源边界

腾讯研究院报告用于建立初始知识模型，但原始 PDF 不在仓库中。报告页码与公开边界见 `knowledge/source-map.md`。招聘、薪酬、产品能力、组织结构、政策和市场数据必须重新核验当前一手来源。

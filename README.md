# FDE Insight

FDE Insight 是一套的开源 Skill 与学习站点，用于回答前线部署工程（FDE）相关问题。内容覆盖岗位理解、客户交付、生产化、组织采用、指标设计、职业准备和可复用资产建设。

判断一项工作是否形成 FDE 闭环，要看客户是否拿到生产结果，以及项目结束后是否留下能被下一次交付直接复用的 Skill、连接器、评测集、模板、本体或产品能力。

## 可视化讲解

Skill 共用的领域 Schema 和知识图谱：<https://wishyouerehere9610.github.io/fde-insight/>

## 安装 Skill

```bash
npx skills add Wishyouerehere9610/fde-insight --list --full-depth
```

Skill 适用于以下问题：

- FDE 岗位、职责、能力模型和职业发展
- 客户项目诊断、场景选择与生产化方案
- 培训课程、案例练习和评分标准设计
- 交付指标、采用率、复用率和业务价值衡量
- Agent 工程、系统集成、权限、评测与发布治理
- Skill、连接器、本体、评测集和行业模板沉淀

## 项目结构

- `SKILL.md`：触发条件、资料路由和回答规则
- `knowledge/fde-insight.schema.json`：领域类型、关系词表和证据约束
- `knowledge/fde-insight.graph.json`：103 个实体与 128 条语义关系
- `knowledge/report-analysis.json`：经过脱敏的 ALE 解析清单与证据分区
- `knowledge/`：核心概念、交付阶段、角色、指标与来源映射
- `playbooks/`：问答、培训、项目诊断和面试准备方法
- `tests/`：结构、内容、来源边界和展示层校验
- `index.html`、`styles.css`、`app.js`：公开展示页

## 证据规则

回答中的内容分为三类：

- **报告结论**：有明确的报告页码来源
- **工程判断**：根据运行机制形成的建议，需要说明前提和取舍
- **待核验事实**：招聘、薪酬、产品能力、组织结构和政策等可能变化的信息

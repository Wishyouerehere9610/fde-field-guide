# FDE 岗位薪酬市场

本模块记录可追溯的招聘薪酬样本，不给出“行业统一价”。同一公司、城市、职级和岗位方向都可能出现不同区间，正式待遇只能以书面 Offer 为准。结构化数据见 [`compensation-market.json`](./compensation-market.json)。

## 先统一口径

- **币种**：使用 CNY、USD 等 ISO 4217 代码，不把不同币种直接并排比较。
- **月薪**：国内招聘页面常见口径，例如 `35-70K·15 薪`。年现金估算为月薪乘薪数。
- **年基薪**：美国招聘官网通常披露 base salary，不等于总包。
- **股权与奖金**：单独记录。签字费、绩效奖金、股票、退休金、保险、房补和搬迁支持不能直接并入基础薪资。
- **总包比较**：只有币种、计薪周期、职级、地点、奖金目标和股权估值口径一致时才有意义。月薪与年基薪不能直接换算总包。

## 来源等级

| 等级 | 含义 | 使用方式 |
| --- | --- | --- |
| 直接核验 | 企业招聘官网或官方 ATS 页面可直接读取 | 可引用页面上的岗位和年基薪，但仍保留核验日期 |
| 搜索索引 | 招聘平台搜索结果可见，详情页对自动化读取有限制 | 作为市场样本，不写成企业统一薪档 |
| 交叉核验 | 两个公开来源或招聘截图相互印证 | 说明来源差异，不替代正式 Offer |

## 国内样本

| 公司 | 岗位样本 | 发布口径 | 年现金估算 | 证据状态 |
| --- | --- | ---: | ---: | --- |
| 字节跳动 | 豆包大模型 FDE | CNY 35-70K/月，15 薪 | CNY 52.5-105 万 | 交叉核验 |
| 腾讯 | AI FDE | CNY 35-65K/月，15 薪 | CNY 52.5-97.5 万 | 交叉核验 |
| 阿里云 | FDE / AI 客户工程 | CNY 20-50K/月，16 薪 | CNY 32-80 万 | 岗位直接核验，薪资来自搜索索引 |
| 蚂蚁集团 | 大模型 FDE | CNY 30-60K/月，15 薪 | CNY 45-90 万 | 搜索索引 |
| 智谱 AI | FDE / 大模型交付 | CNY 60-80K/月 | 不计算 | 未披露薪数 |

### 冲突样本怎么处理

蚂蚁同类岗位出现 `30-60K·15 薪` 与 `40-60K·15 薪` 两个公开区间。这里保留两个记录，并标记为**冲突样本**。可能原因包括职级、城市、发布时间、职位编号或转载误差。缺少原始岗位页和职级映射时，不应把较高下限当成企业标准。

## 海外样本

| 公司 | 岗位样本 | 地点 | 官网年基薪 |
| --- | --- | --- | ---: |
| OpenAI | Forward Deployed Engineer | 旧金山 / 纽约 | USD 162K-280K |
| OpenAI | Forward Deployed Software Engineer | 旧金山 | USD 185K-325K |
| OpenAI | FDE Manager | 旧金山 | USD 280K-335K |
| Anthropic | Applied AI Engineer, Enterprise Tech | 旧金山 / 纽约 | USD 200K-320K |
| Anthropic | Applied AI Architect, Industries | 旧金山 / 纽约 | USD 240K-315K |
| Palantir | Forward Deployed Software Engineer | 纽约 | USD 135K-200K |
| Palantir | Forward Deployed AI Engineer | 纽约 | USD 135K-200K |

OpenAI 页面明确写有股权，但表中只列年基薪。Anthropic 用 Applied AI Engineer / Architect 命名相邻岗位。Palantir 还存在 Enablement、Infrastructure 和 New Grad 等分支，职责边界不同，不能只按标题中的 Forward Deployed 合并统计。

## 使用边界

本次采集窗口截至 **2026-08-09**。招聘页面会下线或改价，回答当前待遇问题时要重新打开原始来源。谈 Offer 时至少分开确认：固定月薪或年基薪、发薪月数、目标奖金、股权授予、归属期、签字费、房补、搬迁费、出差补贴和调薪周期。

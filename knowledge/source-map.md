# Source map

## Primary research input

`FDE模式行业观察与实践`, Tencent Research Institute, July 2026, 83 pages.

The supplied report is used as a research input. The original PDF is not redistributed because the supplied copy does not include an open source license.

## ALE extraction record

The 83-page source was parsed with ALE CLI 0.7.0 in Markdown and JSON modes. The successful parse covered all 83 pages and yielded 196 headings, 54 tables, 41 image elements across 30 pages, and 80 list items. `knowledge/report-analysis.json` records the sanitized extraction manifest.

The raw ALE output is not published. It includes report text and time-limited image URLs that are unnecessary for the open source knowledge graph.

## Report coverage

| Reference | Pages | Used for |
| --- | --- | --- |
| `report:p3-6` | Pages 3-6 | Report scope, core findings, publication limits |
| `report:p8-17` | Pages 8-17 | FDE definition, 80/95/99, frontline learning, reuse test |
| `report:p19-26` | Pages 19-26 | Palantir history, ontology layers, Skill and connector relationships |
| `report:p28-40` | Pages 28-40 | Demo to production, adoption, Tencent Cloud practices, failure modes |
| `report:p42-45` | Pages 42-45 | Talent model, organization, incentives, performance dimensions |
| `report:p47-56` | Pages 47-56 | Echo and Delta operating manual, asset feedback and reuse economics |
| `report:p58-60` | Pages 58-60 | Future role split, ecosystem, measurement, partner model |
| `report:p61-63` | Pages 61-63 | Research method, limitations, terminology |
| `report:p64-79` | Pages 64-79 | Hiring sample, capability distribution, employer examples |
| `report:p80-81` | Pages 80-81 | References listed by the report |

Pages 47-60 provide the continuous operating-manual and future-model evidence used by the delivery and reuse playbooks.

## Evidence labels

- `report:pXX`: supported by a page or page group in the report.
- `project:synthesis`: an engineering synthesis created for this open source project.
- `Needs current verification`: the claim may change and should be checked against a current primary source.

## Needs current verification

Always verify these before presenting them as current facts:

- Active FDE job counts and growth rates
- Compensation ranges and level mapping
- Current product capabilities and organization structures
- Company-specific travel, staffing, and performance policies
- Laws, regulations, standards, and government programs

The report's own reference list is not a substitute for checking the current primary source.

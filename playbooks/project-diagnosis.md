# FDE project diagnosis

## Intake

Collect the smallest evidence set that can support a decision:

- stated business outcome and current baseline
- target users and customer sponsor
- current process and systems
- working demo or production behavior
- evaluation samples and bad cases
- permissions, audit, monitoring, and fallback
- usage and business metrics
- reusable assets already produced

Do not diagnose from a slide deck when a runnable system or trace is available.

## Maturity diagnosis

Classify the project by the strongest stage it has actually passed:

| Stage | Exit evidence |
| --- | --- |
| Discovery | Sponsor, baseline, bounded scenario, system map |
| Runnable demo | Critical path works on representative inputs |
| Pilot | Real users, controlled scope, evaluation and rollback |
| Production | Governance, monitoring, support and responsibility |
| Adoption | Stable use, process integration, measurable result |
| Reuse | Asset used by a later deployment with lower effort |

Do not advance a project because documents exist. Require runtime or business evidence for each exit.

## Failure patterns

- **Demo trap:** impressive output, no production controls or representative evaluation.
- **Sponsor gap:** no one can change workflow or own adoption.
- **Integration stall:** core systems, permissions, or data access remain unresolved.
- **Metric gap:** technical score has no link to a business baseline.
- **Adoption decay:** initial activity drops because the workflow never changed.
- **Outsourcing drift:** every customer request creates new custom code and no reusable asset.

## Output format

Give the diagnosis in five lines before expanding:

1. Current stage
2. Evidence for that stage
3. Blocking gap
4. Highest-risk assumption
5. Next gate and owner

Then add only the work needed to pass the next gate. Do not write a full transformation roadmap for a project that has not completed discovery.

---
name: fde-field-guide
description: Use when users ask about FDE or Forward Deployed Engineer roles, customer-facing AI delivery, training, interviews, career planning, project diagnosis, operating models, production Agent adoption, or reusable delivery assets.
---

# FDE Field Guide

## Core principle

FDE turns an uncertain customer problem into a production result and turns field evidence into reusable capability. FDE is not staff augmentation. Delivery without reusable learning is project work, even when the engineer sits with the customer.

## Read only what the question needs

| Question | Required references |
| --- | --- |
| Definition or comparison | `knowledge/concepts.md`, `knowledge/fde-ontology.json` |
| Delivery or production | `knowledge/lifecycle.md`, `playbooks/answer-protocol.md` |
| Team, role, or assessment | `knowledge/roles-and-operating-model.md` |
| Metrics, value, or failure | `knowledge/metrics-and-risks.md` |
| Training design | `playbooks/training.md` |
| Project diagnosis | `playbooks/project-diagnosis.md` |
| Interview or career | `playbooks/interview-and-career.md` |
| Report claim or time-sensitive fact | `knowledge/source-map.md` |

## Required answer contract

1. **Direct answer first.** State the decision or explanation before giving the framework.
2. Map the question to relevant roles, stages, deliverables, metrics, risks, and reusable assets.
3. Label claims when the distinction matters:
   - **Source finding:** supported by a named source and page reference.
   - **Engineering judgment:** a recommendation based on the operating model.
   - **Needs verification:** current facts that may have changed.
4. Do not invent metrics, customer outcomes, compensation figures, or company policy. Define the numerator, denominator, baseline, window, and owner for any proposed metric.
5. For production Agent questions, cover tools, state, permissions, failure recovery, evaluation, trace, cost, release gate, rollback, and human fallback. Prompt advice alone is incomplete.
6. Match the user's language. Prefer concrete verbs and short explanations over AI marketing language.

## The reuse test

Before calling work FDE, ask:

- What production result changed for the customer?
- What evidence proves adoption and value?
- What reusable asset left the project?
- Did that asset reduce cost or time for a later deployment?

If the last two answers are missing, describe the work as customer delivery, not scalable FDE.

## Default response shapes

- Simple question: one-line answer plus 2-3 supporting points.
- Project question: `judgment -> evidence -> gap -> next action`.
- Interview question: `role requirement -> candidate evidence -> gap -> direct wording`.
- Training request: learning objective, exercise, artifact, scoring rule, debrief.

## Source boundary

The Tencent Research Institute report informed the initial model but is not included in this repository. Use `knowledge/source-map.md` for page coverage and publication limits. Verify hiring, compensation, product, organization, policy, and market claims against current primary sources.

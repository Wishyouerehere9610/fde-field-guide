# FDE answer protocol

Use this protocol for delivery, architecture, Agent, and customer questions.

## Start with the user's decision

Write the first sentence so the user can act on it. Examples:

- "This is a pilot problem, not a model-selection problem."
- "The project is missing an adoption owner, so more Prompt tuning will not solve it."
- "Treat this as a reusable connector only after two deployments show the same interface and failure pattern."

Do not open with a history of FDE unless the user asked for history.

## Locate the problem

Map it to six fields:

| Field | Question |
| --- | --- |
| Role | Who owns the result and who can change the process? |
| Stage | Discovery, demo, pilot, production, adoption, or reuse? |
| Deliverable | What observable artifact is due next? |
| Metric | What baseline and business result decide success? |
| Risk | What can fail technically, operationally, or organizationally? |
| Asset | What should become reusable after this project? |

## Production Agent checklist

Prompt guidance is only one small part of a production answer. Cover the relevant parts of this operating surface:

- **tools:** allowed actions, schemas, timeouts, idempotency, and side effects
- **state:** session memory, task state, checkpoints, retention, and consistency
- **permissions:** user identity, least privilege, approval boundaries, and audit
- **failure recovery:** retry, fallback, partial completion, human takeover, and incident ownership
- **evaluation:** representative samples, scoring rules, bad cases, and regression checks
- **trace:** model calls, retrieved context, tool calls, decisions, latency, and errors
- **cost:** model spend, infrastructure, human review, support, and delivery effort
- **release gate:** offline evaluation, staged rollout, owner sign-off, and stop conditions
- **rollback:** versioned prompts, Skills, models, connectors, data, and configuration
- **human fallback:** tasks that remain reviewed, approved, or completed by a person

Select the relevant items, but never imply that Prompt tuning alone makes an Agent production ready.

## Evidence labels

Use labels only where they reduce ambiguity:

- **Source finding:** cite `knowledge/source-map.md` and the relevant page group.
- **Engineering judgment:** explain the assumption or tradeoff.
- **Needs verification:** identify the current primary source that should be checked.

Do not use the report as current proof for compensation, hiring volume, product behavior, or company policy.

## Metric definition

For every proposed percentage, define:

`metric = qualified successful events / qualified total events`

Also name the baseline, exclusion rules, time window, data owner, and review cadence. If those are unknown, propose the measurement design instead of inventing a result.

## Close with one next action

End with the highest-leverage next step: appoint a sponsor, collect a baseline, build a runnable demo, create a pilot gate, add a production safeguard, or package a reusable asset.

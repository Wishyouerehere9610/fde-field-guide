# FDE Insight design

## Purpose

Build an open source Agent Skill and public learning site for questions about Forward Deployed Engineering. The project serves training, career preparation, customer conversations, delivery diagnosis, and organizational design.

The Tencent Research Institute report `FDE模式行业观察与实践` is a research input. The repository will not redistribute the original PDF because the report does not include an open source license. Public content must be rewritten, source-bounded, and clear about whether a statement is a report finding, a public fact, or an engineering judgment.

## Repository shape

- `SKILL.md` contains the trigger conditions, answer contract, routing rules, and non-negotiable evidence boundaries.
- `knowledge/fde-insight.schema.json` defines the domain contract and `knowledge/fde-insight.graph.json` is the canonical machine-readable knowledge graph.
- `knowledge/*.md` contains concise human-readable references for concepts, lifecycle, roles, metrics, risks, and sources.
- `playbooks/*.md` contains reusable response patterns for training, project diagnosis, interviews, and customer questions.
- `tests/*.test.mjs` validates the ontology, Skill contract, source coverage, and public site.
- `index.html`, `styles.css`, and `app.js` form a dependency-free GitHub Pages site.
- `.github/workflows/validate-and-deploy.yml` validates every push and deploys the main branch to GitHub Pages.

## Ontology

The ontology uses nine node types:

1. `role`: FDE, Echo, Delta, customer sponsor, platform team, ecosystem partner.
2. `stage`: discovery, runnable demo, pilot, production, adoption, reuse.
3. `capability`: business discovery, full-stack delivery, evaluation, integration, change management.
4. `deliverable`: scenario map, demo, production runbook, evaluation set, Skill, connector, industry template.
5. `metric`: adoption, task success, cycle time, quality, expansion, reuse.
6. `risk`: demo trap, custom-development trap, missing sponsor, unsafe automation, weak feedback loop.
7. `asset`: ontology, Skill, connector, test set, template, product capability.
8. `system`: Agent platform, enterprise system, model, observability, identity and permission system.
9. `principle`: frontline learning, 80/95/99, sedimentation first, human fallback, platform-partner-customer collaboration.

Relations use explicit verbs such as `owns`, `produces`, `measured_by`, `mitigates`, `depends_on`, `feeds_back_to`, and `reused_in`.

## Answer contract

Every FDE answer follows this sequence:

1. Identify the user's scenario and intended decision.
2. Load only the relevant ontology nodes and reference files.
3. Give the direct answer first.
4. Separate sourced findings, reasoned recommendations, and facts that still need verification.
5. Cover delivery, adoption, measurement, risk, and reusable asset when the question concerns production work.
6. Use concrete language and avoid generic AI marketing phrases.

The default answer is compact. Training or design requests may expand into a framework, exercise, checklist, or role-play.

## Public site

The site is a compact technical field guide, not a marketing landing page.

- Design dials: variance 5, motion 4, density 5.
- Visual language: cool neutral surfaces, electric blue accent, system sans typography, 8px radii.
- Hero: left-aligned proposition with a functional ontology explorer as the primary visual.
- Content: definition, lifecycle, operating model, deliverables, metrics, failure modes, and installation.
- Motion: small entry transitions and direct filter feedback only. All motion respects reduced-motion settings.
- Theme: system light/dark preference with consistent semantic tokens.
- Accessibility: semantic landmarks, keyboard controls, visible focus, AA contrast, and a text fallback for the graph.

## Verification

- Node tests validate IDs, node types, relations, and source references.
- Skill tests validate trigger coverage, required answer boundaries, and referenced files.
- Site tests validate metadata, accessibility landmarks, asset links, and forbidden copy patterns.
- Browser checks cover desktop and mobile layouts, both color schemes, keyboard focus, and interactive ontology filtering.
- GitHub Pages is considered delivered only after the deployment reports success and the public URL returns HTTP 200.

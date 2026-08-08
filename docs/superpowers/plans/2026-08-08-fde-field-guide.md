# FDE Field Guide implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an open source FDE Agent Skill, source-bounded knowledge base, test suite, and GitHub Pages learning site.

**Architecture:** Keep `SKILL.md` concise and route detailed questions into machine-readable ontology data and focused Markdown references. Use a dependency-free static site that reads the same ontology JSON, so the Agent and public interface share one source of truth.

**Tech Stack:** Agent Skills Markdown, JSON, Node.js built-in test runner, semantic HTML, modern CSS, vanilla JavaScript, GitHub Actions, GitHub Pages.

---

### Task 1: Define repository contracts

**Files:**
- Create: `package.json`
- Create: `tests/repository.test.mjs`
- Create: `README.md`
- Create: `NOTICE.md`
- Create: `LICENSE`
- Create: `CONTENT-LICENSE`

- [ ] Write a failing test that requires project metadata, licenses, source boundary language, and installation documentation.
- [ ] Run `npm test` and confirm it fails because the repository files are missing.
- [ ] Add the minimal repository files and scripts.
- [ ] Run `npm test` and confirm the repository contract passes.

### Task 2: Build the ontology and references

**Files:**
- Create: `tests/ontology.test.mjs`
- Create: `knowledge/fde-ontology.json`
- Create: `knowledge/concepts.md`
- Create: `knowledge/lifecycle.md`
- Create: `knowledge/roles-and-operating-model.md`
- Create: `knowledge/metrics-and-risks.md`
- Create: `knowledge/source-map.md`

- [ ] Write failing tests for allowed node types, unique IDs, valid relation endpoints, source references, and minimum coverage.
- [ ] Run `npm test` and confirm ontology tests fail because the knowledge graph is missing.
- [ ] Add the ontology and concise references derived from the report.
- [ ] Run `npm test` and confirm all ontology tests pass.

### Task 3: Author and pressure-test the Skill

**Files:**
- Create: `tests/skill.test.mjs`
- Create: `SKILL.md`
- Create: `playbooks/answer-protocol.md`
- Create: `playbooks/training.md`
- Create: `playbooks/project-diagnosis.md`
- Create: `playbooks/interview-and-career.md`
- Create: `tests/scenarios.json`

- [ ] Write failing tests for FDE triggers, direct-answer-first behavior, evidence labels, production safeguards, and playbook routing.
- [ ] Run `npm test` and confirm Skill tests fail because `SKILL.md` is missing.
- [ ] Add the minimal Skill and detailed playbooks.
- [ ] Run `npm test` and confirm Skill contract tests pass.
- [ ] Run scenario checks and record whether each expected behavior is covered.

### Task 4: Build the public learning site

**Files:**
- Create: `tests/site.test.mjs`
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `.nojekyll`

- [ ] Write failing tests for semantic landmarks, responsive metadata, ontology loading, keyboard controls, theme support, and copy quality.
- [ ] Run `npm test` and confirm site tests fail because the public files are missing.
- [ ] Implement the page structure, functional ontology explorer, filters, install command, and responsive styles.
- [ ] Run `npm test` and confirm the full suite passes.
- [ ] Start a local static server and verify desktop, mobile, light, dark, reduced motion, and keyboard interaction in a browser.

### Task 5: Automate and publish

**Files:**
- Create: `.github/workflows/validate-and-deploy.yml`
- Create: `.gitignore`

- [ ] Add a workflow that runs `npm test`, uploads the repository as a Pages artifact, and deploys only from `main`.
- [ ] Run local tests and inspect the final diff.
- [ ] Commit the repository, create `Wishyouerehere9610/fde-field-guide` as public, and push `main`.
- [ ] Enable GitHub Pages with GitHub Actions.
- [ ] Verify the Actions run succeeds and the public site returns HTTP 200.
- [ ] Verify `npx skills add Wishyouerehere9610/fde-field-guide --list --full-depth` discovers `fde-field-guide`.

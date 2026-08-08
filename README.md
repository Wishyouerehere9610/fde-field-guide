# FDE Insight

FDE Insight is an open source Agent Skill and learning site for Forward Deployed Engineering. It helps people answer practical questions about the role, delivery model, operating system, metrics, career path, and the line between FDE and conventional project delivery.

FDE is not staff augmentation. The useful test is what remains after a project: a production result for the customer, plus a reusable Skill, connector, evaluation set, template, ontology update, or product capability for the next deployment.

## Use the Skill

List the Skill before installing it:

```bash
npx skills add Wishyouerehere9610/fde-field-guide --list --full-depth
```

Install it for Codex:

```bash
npx skills add Wishyouerehere9610/fde-field-guide \
  --skill fde-insight \
  --agent codex \
  --global \
  --yes \
  --full-depth
```

The Skill activates for FDE role questions, project diagnosis, training design, interviews, operating-model decisions, delivery metrics, Agent productionization, and reusable asset design.

## Browse the guide

The public GitHub Pages site presents the same ontology used by the Skill:

<https://wishyouerehere9610.github.io/fde-field-guide/>

## Repository map

- `SKILL.md`: trigger conditions and answer contract
- `knowledge/`: ontology and source-bounded reference material
- `playbooks/`: training, diagnosis, interview, and response patterns
- `tests/`: structural and editorial validation
- `index.html`, `styles.css`, `app.js`: public learning site

## Evidence policy

Answers separate three kinds of statements:

- **Source finding:** supported by a named source in `knowledge/source-map.md`
- **Engineering judgment:** a recommendation derived from the operating model
- **Needs verification:** a time-sensitive or organization-specific claim that should not be presented as settled fact

The report `FDE模式行业观察与实践` by Tencent Research Institute informed the initial knowledge model. The repository does not include the original PDF. See `NOTICE.md` for the source boundary.

## Development

```bash
npm test
python3 -m http.server 4173
```

Open <http://127.0.0.1:4173/> after starting the server.

## License

Software is available under the MIT License. Original text and ontology content in this repository are available under CC BY 4.0. Third-party source materials remain under their original terms.

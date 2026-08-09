document.documentElement.classList.add('js');

const svgNamespace = 'http://www.w3.org/2000/svg';
const graph = document.querySelector('#ontology-graph');
const graphStatus = document.querySelector('#graph-status');
const detail = document.querySelector('#ontology-detail');
const filterButtons = [...document.querySelectorAll('[data-ontology-filter]')];

const typeLabels = {
  role: '角色',
  stage: '阶段',
  mechanism: '机制',
  capability: '能力',
  deliverable: '交付物',
  metric: '指标',
  risk: '风险',
  asset: '资产',
  system: '系统',
  principle: '原则',
};

const curatedOverview = [
  'role-fde',
  'principle-frontline-learning',
  'principle-dual-distillation',
  'stage-discovery',
  'stage-runnable-demo',
  'stage-production',
  'stage-reuse',
  'deliverable-production-solution',
  'metric-adoption-rate',
  'metric-reuse-rate',
  'asset-skill',
  'asset-connector',
  'risk-demo-trap',
  'risk-outsourcing-drift',
];

let ontology = null;
let activeFilter = 'all';
let activeNodeId = 'role-fde';

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

function setDetail(node) {
  detail.replaceChildren();

  const type = document.createElement('p');
  type.className = 'detail-type';
  type.textContent = typeLabels[node.type] ?? node.type;

  const heading = document.createElement('h3');
  heading.textContent = node.name;

  const definition = document.createElement('p');
  definition.textContent = node.definition;

  const source = document.createElement('p');
  source.className = 'detail-source';
  source.textContent = `来源：${node.sourceRefs.join('，')}`;

  detail.append(type, heading, definition, source);
}

function getVisibleNodes() {
  if (activeFilter === 'all') {
    const byId = new Map(ontology.nodes.map((node) => [node.id, node]));
    return curatedOverview.map((id) => byId.get(id)).filter(Boolean);
  }

  return ontology.nodes.filter((node) => node.type === activeFilter).slice(0, 14);
}

function getPositions(nodes) {
  const centerX = 380;
  const centerY = 260;
  const positions = new Map();
  const startIndex = activeFilter === 'all' ? 1 : 0;

  if (activeFilter === 'all' && nodes.length > 0) {
    positions.set(nodes[0].id, { x: centerX, y: centerY });
  }

  const ringNodes = nodes.slice(startIndex);
  ringNodes.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / ringNodes.length - Math.PI / 2;
    const radiusX = ringNodes.length > 10 ? 290 : 250;
    const radiusY = ringNodes.length > 10 ? 190 : 170;
    positions.set(node.id, {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
    });
  });

  return positions;
}

function addNodeLabel(group, node, x, y) {
  const label = createSvgElement('text', { x, y: y + 5 });
  const characters = [...node.name];

  if (characters.length <= 7) {
    label.textContent = node.name;
  } else {
    const splitAt = Math.ceil(characters.length / 2);
    const firstLine = createSvgElement('tspan', { x, dy: -6 });
    const secondLine = createSvgElement('tspan', { x, dy: 16 });
    firstLine.textContent = characters.slice(0, splitAt).join('');
    secondLine.textContent = characters.slice(splitAt).join('');
    label.append(firstLine, secondLine);
  }

  group.append(label);
}

function renderGraph() {
  const nodes = getVisibleNodes();
  const nodeIds = new Set(nodes.map((node) => node.id));
  const positions = getPositions(nodes);
  const description = graph.querySelector('desc')?.textContent ?? '';
  const title = graph.querySelector('title')?.textContent ?? '';

  graph.replaceChildren();
  const graphTitle = createSvgElement('title', { id: 'graph-title' });
  graphTitle.textContent = title;
  const graphDescription = createSvgElement('desc', { id: 'graph-description' });
  graphDescription.textContent = description;
  graph.append(graphTitle, graphDescription);

  const related = ontology.relations.filter(
    (relation) => nodeIds.has(relation.from) && nodeIds.has(relation.to),
  );

  for (const relation of related) {
    const from = positions.get(relation.from);
    const to = positions.get(relation.to);
    graph.append(
      createSvgElement('line', {
        class: 'graph-edge',
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
      }),
    );
  }

  for (const node of nodes) {
    const position = positions.get(node.id);
    const group = createSvgElement('g', {
      class: `graph-node${node.id === activeNodeId ? ' is-selected' : ''}`,
      tabindex: 0,
      role: 'button',
      'aria-label': `${typeLabels[node.type]}：${node.name}`,
      'data-node-id': node.id,
    });

    group.append(createSvgElement('circle', { cx: position.x, cy: position.y, r: 42 }));
    addNodeLabel(group, node, position.x, position.y);

    const selectNode = () => {
      activeNodeId = node.id;
      setDetail(node);
      graph.querySelectorAll('.graph-node').forEach((element) => {
        element.classList.toggle('is-selected', element.dataset.nodeId === activeNodeId);
      });
      graphStatus.textContent = `已选择：${node.name}`;
    };

    group.addEventListener('click', selectNode);
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectNode();
      }
    });
    graph.append(group);
  }

  const selected = nodes.find((node) => node.id === activeNodeId) ?? nodes[0];
  activeNodeId = selected.id;
  setDetail(selected);
  graphStatus.textContent = `${typeLabels[activeFilter] ?? '全景'}：${nodes.length} 个节点`;
}

async function loadOntology() {
  const response = await fetch('knowledge/fde-insight.graph.json');
  if (!response.ok) throw new Error(`Ontology request failed: ${response.status}`);
  ontology = await response.json();
  renderGraph();
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.ontologyFilter;
    filterButtons.forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    const preferred = activeFilter === 'all'
      ? 'role-fde'
      : ontology.nodes.find((node) => node.type === activeFilter)?.id;
    activeNodeId = preferred ?? activeNodeId;
    renderGraph();
  });
}

loadOntology().catch((error) => {
  graphStatus.textContent = '知识图谱加载失败';
  detail.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = '暂时无法读取本体';
  const message = document.createElement('p');
  message.textContent = '请刷新页面，或直接在 GitHub 查看 knowledge/fde-insight.graph.json。';
  detail.append(heading, message);
  console.error(error);
});

const copyButton = document.querySelector('#copy-install');
const copyStatus = document.querySelector('#copy-status');

copyButton?.addEventListener('click', async () => {
  const target = document.querySelector(`#${copyButton.dataset.copyTarget}`);
  try {
    await navigator.clipboard.writeText(target.textContent);
    copyStatus.textContent = '安装命令已复制';
    copyButton.textContent = '已复制';
  } catch (error) {
    copyStatus.textContent = '浏览器未允许复制，请手动选择命令';
    console.error(error);
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = [...document.querySelectorAll('.reveal')];

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => observer.observe(element));
}

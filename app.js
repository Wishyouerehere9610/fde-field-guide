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

const relationLabels = {
  owns: '负责',
  produces: '产出',
  measured_by: '由此衡量',
  mitigates: '缓解',
  depends_on: '依赖',
  feeds_back_to: '反馈至',
  reused_in: '复用于',
  precedes: '先于',
  enables: '支持',
  governs: '约束',
};

const overviewLanes = [
  { label: '角色', types: ['role'] },
  { label: '原则', types: ['principle'] },
  { label: '交付阶段', types: ['stage'] },
  { label: '资产与交付物', types: ['asset', 'deliverable'] },
  { label: '指标与风险', types: ['metric', 'risk'] },
];

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

function formatSourceRef(sourceRef) {
  if (sourceRef.startsWith('report:p')) {
    return `报告第 ${sourceRef.replace('report:p', '')} 页`;
  }
  if (sourceRef === 'project:synthesis') return '工程归纳';
  if (sourceRef === 'needs-verification') return '需重新核验';
  return sourceRef;
}

function setDetail(node) {
  detail.replaceChildren();

  const summary = document.createElement('div');
  summary.className = 'detail-summary';

  const type = document.createElement('p');
  type.className = 'detail-type';
  type.textContent = typeLabels[node.type] ?? node.type;

  const heading = document.createElement('h3');
  heading.textContent = node.name;

  const definition = document.createElement('p');
  definition.textContent = node.definition;

  const source = document.createElement('p');
  source.className = 'detail-source';
  source.textContent = `来源：${node.sourceRefs.map(formatSourceRef).join('，')}`;

  summary.append(type, heading, definition, source);

  const relationPanel = document.createElement('div');
  relationPanel.className = 'detail-relations';
  const relations = ontology.relations.filter(
    (relation) => relation.from === node.id || relation.to === node.id,
  );

  const relationHeading = document.createElement('h4');
  relationHeading.textContent = `关联关系 ${relations.length}`;
  const relationList = document.createElement('ul');
  const nodeById = new Map(ontology.nodes.map((item) => [item.id, item]));

  for (const relation of relations) {
    const outgoing = relation.from === node.id;
    const relatedNode = nodeById.get(outgoing ? relation.to : relation.from);
    if (!relatedNode) continue;

    const item = document.createElement('li');
    const direction = document.createElement('span');
    direction.textContent = outgoing ? '→' : '←';
    const relationText = document.createElement('p');
    relationText.textContent = outgoing
      ? `${relationLabels[relation.type] ?? relation.type} · ${relatedNode.name}`
      : `${relatedNode.name} · ${relationLabels[relation.type] ?? relation.type}`;
    item.append(direction, relationText);
    relationList.append(item);
  }

  relationPanel.append(relationHeading, relationList);

  detail.append(summary, relationPanel);
}

function getVisibleNodes() {
  if (activeFilter === 'all') {
    const byId = new Map(ontology.nodes.map((node) => [node.id, node]));
    return curatedOverview.map((id) => byId.get(id)).filter(Boolean);
  }

  return ontology.nodes.filter((node) => node.type === activeFilter).slice(0, 14);
}

function getPositions(nodes) {
  const positions = new Map();

  if (activeFilter === 'all') {
    overviewLanes.forEach((lane, laneIndex) => {
      const laneNodes = nodes.filter((node) => lane.types.includes(node.type));
      const gap = 300 / Math.max(laneNodes.length, 1);
      laneNodes.forEach((node, nodeIndex) => {
        positions.set(node.id, {
          x: 76 + laneIndex * 152,
          y: 65 + gap / 2 + nodeIndex * gap,
        });
      });
    });
    return positions;
  }

  const columns = 4;
  const rowCount = Math.ceil(nodes.length / columns);
  for (let row = 0; row < rowCount; row += 1) {
    const rowNodes = nodes.slice(row * columns, (row + 1) * columns);
    const startX = 380 - ((rowNodes.length - 1) * 190) / 2;
    rowNodes.forEach((node, column) => {
      positions.set(node.id, {
        x: startX + column * 190,
        y: 74 + row * 98,
      });
    });
  }
  return positions;
}

function splitLabel(label) {
  const characters = [...label];
  if (characters.length <= 8) return [label];

  const words = label.split(' ');
  if (words.length > 1) {
    let bestSplit = 1;
    let smallestDifference = Number.POSITIVE_INFINITY;
    for (let index = 1; index < words.length; index += 1) {
      const firstLength = [...words.slice(0, index).join(' ')].length;
      const secondLength = [...words.slice(index).join(' ')].length;
      const difference = Math.abs(firstLength - secondLength);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        bestSplit = index;
      }
    }
    return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')];
  }

  const splitAt = Math.ceil(characters.length / 2);
  return [characters.slice(0, splitAt).join(''), characters.slice(splitAt).join('')];
}

function addNodeLabel(group, node, x, y) {
  const label = createSvgElement('text', { x, y: y + 5 });
  const lines = splitLabel(node.name);

  if (lines.length === 1) {
    label.textContent = lines[0];
  } else {
    const firstLine = createSvgElement('tspan', { x, dy: -7 });
    const secondLine = createSvgElement('tspan', { x, dy: 15 });
    firstLine.textContent = lines[0];
    secondLine.textContent = lines[1];
    label.append(firstLine, secondLine);
  }

  group.append(label);
}

function renderGraph() {
  const nodes = getVisibleNodes();
  const nodeIds = new Set(nodes.map((node) => node.id));
  const positions = getPositions(nodes);
  const nodeWidth = activeFilter === 'all' ? 132 : 166;
  const nodeHeight = 48;
  const graphHeight = activeFilter === 'all'
    ? 430
    : Math.max(230, 126 + (Math.ceil(nodes.length / 4) - 1) * 98);
  const description = graph.querySelector('desc')?.textContent ?? '';
  const title = graph.querySelector('title')?.textContent ?? '';

  graph.replaceChildren();
  graph.setAttribute('viewBox', `0 0 760 ${graphHeight}`);
  graph.style.aspectRatio = `760 / ${graphHeight}`;
  const graphTitle = createSvgElement('title', { id: 'graph-title' });
  graphTitle.textContent = title;
  const graphDescription = createSvgElement('desc', { id: 'graph-description' });
  graphDescription.textContent = description;
  graph.append(graphTitle, graphDescription);

  if (activeFilter === 'all') {
    overviewLanes.forEach((lane, index) => {
      const label = createSvgElement('text', {
        class: 'graph-lane-label',
        x: 76 + index * 152,
        y: 28,
      });
      label.textContent = lane.label;
      graph.append(label);
    });
  }

  const related = ontology.relations.filter(
    (relation) => (
      nodeIds.has(relation.from)
      && nodeIds.has(relation.to)
      && (relation.from === activeNodeId || relation.to === activeNodeId)
    ),
  );

  for (const relation of related) {
    const from = positions.get(relation.from);
    const to = positions.get(relation.to);
    graph.append(
      createSvgElement('line', {
        class: 'graph-edge is-connected',
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
      }),
    );
  }

  for (const node of nodes) {
    const position = positions.get(node.id);
    const isRelated = related.some(
      (relation) => relation.from === node.id || relation.to === node.id,
    );
    const group = createSvgElement('g', {
      class: `graph-node${node.id === activeNodeId ? ' is-selected' : ''}${isRelated ? ' is-related' : ''}`,
      tabindex: 0,
      role: 'button',
      'aria-label': `${typeLabels[node.type]}：${node.name}`,
      'data-node-id': node.id,
    });

    group.append(createSvgElement('rect', {
      x: position.x - nodeWidth / 2,
      y: position.y - nodeHeight / 2,
      width: nodeWidth,
      height: nodeHeight,
      rx: 6,
    }));
    addNodeLabel(group, node, position.x, position.y);

    const selectNode = () => {
      activeNodeId = node.id;
      renderGraph();
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
  const relationCount = ontology.relations.filter(
    (relation) => relation.from === selected.id || relation.to === selected.id,
  ).length;
  graphStatus.textContent = `${typeLabels[activeFilter] ?? '全景'} · ${nodes.length} 个节点 · ${relationCount} 条关联`;
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
  const summary = document.createElement('div');
  summary.className = 'detail-summary';
  summary.append(heading, message);
  detail.append(summary);
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

import './ProjectDiagram.css';

// posições (x, y) dos quatro nós no viewBox 420 x 250
const POSITIONS = [[20, 30], [230, 30], [230, 158], [20, 158]];
const NODE_WIDTH = 170;
const NODE_HEIGHT = 62;

const centerOf = ([x, y]) => [x + NODE_WIDTH / 2, y + NODE_HEIGHT / 2];

/**
 * Diagrama de arquitetura: `nodes` são rótulos, `edges` são pares de índices
 * e `dashed` (opcional) é o índice do nó desenhado com borda tracejada.
 */
function ProjectDiagram({ nodes, edges, dashed = -1, label }) {
  return (
    <svg className="project-diagram" viewBox="0 0 420 250" role="img" aria-label={label}>
      {edges.map(([from, to]) => {
        const [x1, y1] = centerOf(POSITIONS[from]);
        const [x2, y2] = centerOf(POSITIONS[to]);
        return <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}

      {nodes.map((node, index) => {
        const [x, y] = POSITIONS[index];
        const isDashed = index === dashed;
        return (
          <g key={node}>
            <rect className="project-diagram__bg" x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT} rx="12" />
            <rect
              className={`project-diagram__node${isDashed ? ' is-dashed' : ''}`}
              x={x}
              y={y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx="12"
            />
            <text x={x + NODE_WIDTH / 2} y={y + 36}>{node}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default ProjectDiagram;

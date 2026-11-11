import { EDGES, VERTICES, VIEWBOX } from '../data/graph';

type GraphViewProps = {
  activeVertex?: string | null;
  activeEdge?: [string, string] | null;
  doneVertices?: string[];
  vertexBadges?: Record<string, string | number>;
};

const R = 22;
const BADGE_R = 10;

const COLORS = {
  vertexFill: '#ffffff',
  vertexStroke: '#9ca3af',
  vertexText: '#1f2937',
  activeFill: '#fdba74',
  activeStroke: '#ea580c',
  doneFill: '#e5e7eb',
  doneStroke: '#d1d5db',
  doneText: '#9ca3af',
  edge: '#cbd5e1',
  edgeActive: '#1f2937',
  badgeFill: '#2563eb',
  badgeText: '#ffffff',
};

const POS = Object.fromEntries(VERTICES.map((v) => [v.id, v]));

// 두 원의 중심을 잇는 선분을 양 끝에서 각각 반지름만큼 줄인다.
function shortenedLine(from: string, to: string) {
  const a = POS[from];
  const b = POS[to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a.x + ux * R,
    y1: a.y + uy * R,
    x2: b.x - ux * R,
    y2: b.y - uy * R,
  };
}

export default function GraphView({
  activeVertex = null,
  activeEdge = null,
  doneVertices = [],
  vertexBadges,
}: GraphViewProps) {
  const done = new Set(doneVertices);

  return (
    <svg
      viewBox={VIEWBOX}
      width="100%"
      role="img"
      aria-label="방향 그래프"
      style={{ display: 'block', maxWidth: 680, margin: '0 auto' }}
    >
      <defs>
        {/* refX를 화살촉 끝에 맞춰, 줄인 선의 끝점이 곧 화살촉 끝이 되게 한다 */}
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.edge} />
        </marker>
        <marker
          id="arrow-active"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="11"
          markerHeight="11"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.edgeActive} />
        </marker>
      </defs>

      <g>
        {EDGES.map(([from, to]) => {
          const isActive = activeEdge !== null && activeEdge[0] === from && activeEdge[1] === to;
          const { x1, y1, x2, y2 } = shortenedLine(from, to);
          return (
            <line
              key={`${from}-${to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isActive ? COLORS.edgeActive : COLORS.edge}
              strokeWidth={isActive ? 3 : 1.75}
              markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
            />
          );
        })}
      </g>

      <g>
        {VERTICES.map(({ id, x, y }) => {
          const isActive = id === activeVertex;
          const isDone = !isActive && done.has(id);
          const fill = isActive ? COLORS.activeFill : isDone ? COLORS.doneFill : COLORS.vertexFill;
          const stroke = isActive
            ? COLORS.activeStroke
            : isDone
              ? COLORS.doneStroke
              : COLORS.vertexStroke;
          const textColor = isDone ? COLORS.doneText : COLORS.vertexText;
          const badge = vertexBadges?.[id];

          return (
            <g key={id}>
              <circle cx={x} cy={y} r={R} fill={fill} stroke={stroke} strokeWidth={2} />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fontWeight={600}
                fill={textColor}
              >
                {id}
              </text>
              {badge !== undefined && (
                <g>
                  <circle
                    cx={x + R * 0.8}
                    cy={y - R * 0.8}
                    r={BADGE_R}
                    fill={COLORS.badgeFill}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                  <text
                    x={x + R * 0.8}
                    y={y - R * 0.8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={700}
                    fill={COLORS.badgeText}
                  >
                    {badge}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

import { useId } from 'react';
import { EDGES, VERTICES, VIEWBOX, edgeKey } from '../data/graph';

type VertexColor = 'white' | 'gray' | 'black';

// 간선 표시 상태
//  default  : 기본
//  active   : 지금 따라가는 간선 (activeEdge)
//  path     : DFS 현재 호출 경로
//  removing : Kahn에서 이번 단계에 지우는 간선
//  removed  : Kahn에서 이미 지운 간선
//  skipped  : DFS에서 이미 종료된 이웃이라 건너뛴 간선
export type EdgeStyle = 'default' | 'active' | 'path' | 'removing' | 'removed' | 'skipped';

type GraphViewProps = {
  activeVertex?: string | null;
  activeEdge?: [string, string] | null;
  doneVertices?: string[];
  vertexBadges?: Record<string, string | number>;
  vertexColors?: Record<string, VertexColor>;
  waitingVertices?: string[]; // 대기 상태 (Kahn의 큐)
  edgeStyles?: Record<string, EdgeStyle>; // key: "A->B"
};

const R = 22;
const BADGE_R = 10;

// 위에 그려질수록 큰 값
const EDGE_ORDER: Record<EdgeStyle, number> = {
  removed: 0,
  default: 1,
  path: 2,
  skipped: 3,
  removing: 4,
  active: 5,
};
const MARKER_STYLES: EdgeStyle[] = ['default', 'active', 'path', 'removing', 'removed', 'skipped'];

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
  vertexColors,
  waitingVertices = [],
  edgeStyles,
}: GraphViewProps) {
  // 한 페이지에 그래프가 두 개 있으므로 marker id가 겹치지 않게 한다
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const markerId = (s: EdgeStyle) => `arrow-${s}-${uid}`;

  const done = new Set(doneVertices);
  const waiting = new Set(waitingVertices);

  const vertexState = (id: string): 'idle' | 'waiting' | 'done' => {
    if (vertexColors) {
      const c = vertexColors[id] ?? 'white';
      return c === 'gray' ? 'waiting' : c === 'black' ? 'done' : 'idle';
    }
    if (done.has(id)) return 'done';
    if (waiting.has(id)) return 'waiting';
    return 'idle';
  };

  const edges = EDGES.map(([from, to]) => {
    const isActive = activeEdge !== null && activeEdge[0] === from && activeEdge[1] === to;
    const style: EdgeStyle = isActive ? 'active' : (edgeStyles?.[edgeKey(from, to)] ?? 'default');
    return { from, to, style };
  }).sort((a, b) => EDGE_ORDER[a.style] - EDGE_ORDER[b.style]);

  return (
    <svg className="graph" viewBox={VIEWBOX} width="100%" role="img" aria-label="방향 그래프">
      <defs>
        {/* refX를 화살촉 끝에 맞춰, 줄인 선의 끝점이 곧 화살촉 끝이 되게 한다 */}
        {MARKER_STYLES.map((s) => (
          <marker
            key={s}
            id={markerId(s)}
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth={s === 'active' ? 11 : 9}
            markerHeight={s === 'active' ? 11 : 9}
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className={`arrowhead arrowhead-${s}`} />
          </marker>
        ))}
      </defs>

      <g>
        {edges.map(({ from, to, style }) => (
          <line
            key={edgeKey(from, to)}
            {...shortenedLine(from, to)}
            className={`edge edge-${style}`}
            markerEnd={`url(#${markerId(style)})`}
          />
        ))}
      </g>

      <g>
        {VERTICES.map(({ id, x, y }) => {
          const state = vertexState(id);
          const isActive = id === activeVertex;
          const badge = vertexBadges?.[id];
          const showBadge = badge !== undefined && state !== 'done';

          return (
            <g key={id} className={`vertex vertex-${state}${isActive ? ' vertex-current' : ''}`}>
              {isActive && <circle className="vertex-halo" cx={x} cy={y} r={R + 8} />}
              <circle className="vertex-body" cx={x} cy={y} r={R} />
              <text className="vertex-label" x={x} y={y} textAnchor="middle" dominantBaseline="central">
                {id}
              </text>
              {showBadge && (
                <g className={`badge${badge === 0 ? ' badge-zero' : ''}`}>
                  <circle cx={x + R * 0.8} cy={y - R * 0.8} r={BADGE_R} />
                  <text
                    x={x + R * 0.8}
                    y={y - R * 0.8}
                    textAnchor="middle"
                    dominantBaseline="central"
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

export type VertexId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type Vertex = {
  id: VertexId;
  x: number;
  y: number;
};

export const VERTICES: Vertex[] = [
  { id: 'A', x: 60, y: 160 },
  { id: 'B', x: 200, y: 80 },
  { id: 'C', x: 200, y: 240 },
  { id: 'D', x: 340, y: 100 },
  { id: 'E', x: 340, y: 260 },
  { id: 'F', x: 480, y: 180 },
  { id: 'G', x: 620, y: 180 },
];

export const EDGES: [VertexId, VertexId][] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['C', 'D'],
  ['C', 'E'],
  ['D', 'F'],
  ['E', 'F'],
  ['F', 'G'],
];

// 각 정점에서 나가는 정점 목록. 알고리즘의 방문 순서가 이 순서에 의존하므로
// 인접 정점은 반드시 알파벳 오름차순으로 정렬해 둔다.
export const ADJ: Record<VertexId, VertexId[]> = (() => {
  const adj = Object.fromEntries(VERTICES.map((v) => [v.id, [] as VertexId[]])) as Record<
    VertexId,
    VertexId[]
  >;
  for (const [from, to] of EDGES) adj[from].push(to);
  for (const id of Object.keys(adj) as VertexId[]) adj[id].sort();
  return adj;
})();

export const VIEWBOX = '0 0 680 340';

// 간선을 식별하는 키 ("A->B")
export const edgeKey = (from: string, to: string) => `${from}->${to}`;

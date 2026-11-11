export type VertexColor = 'white' | 'gray' | 'black';

export type Step = {
  result: string[]; // 현재까지 확정된 위상 순서
  active: string | null; // 지금 처리 중인 정점
  activeEdge: [string, string] | null;
  doneVertices: string[]; // 결과에 들어간 정점들
  headline?: string; // 이 단계에서 한 일을 한 줄로 요약
  caption: string; // 이 단계에서 무엇을 했고 왜 그렇게 했는지
  indegree?: Record<string, number>; // Kahn 전용
  queue?: string[]; // Kahn 전용
  color?: Record<string, VertexColor>; // DFS 전용: 미방문 / 탐색중 / 종료
  callStack?: string[]; // DFS 전용: 현재 재귀 호출 스택 (왼쪽이 바닥)
  finishStack?: string[]; // DFS 전용: 종료된 순서대로 쌓인 스택
  skippedEdges?: [string, string][]; // DFS 전용: 이 단계에서 이미 종료된 이웃이라 건너뛴 간선
};

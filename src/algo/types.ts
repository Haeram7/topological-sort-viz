export type Step = {
  result: string[]; // 현재까지 확정된 위상 순서
  active: string | null; // 지금 처리 중인 정점
  activeEdge: [string, string] | null;
  doneVertices: string[]; // 결과에 들어간 정점들
  caption: string; // 이 단계에서 무엇을 했고 왜 그렇게 했는지
  indegree?: Record<string, number>; // Kahn 전용
  queue?: string[]; // Kahn 전용
};

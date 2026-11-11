import { ADJ, EDGES, VERTICES, type VertexId } from '../data/graph';
import type { Step } from './types';

// 각 정점으로 들어오는 정점 목록 (캡션에서 "남은 선행 조건"을 설명하기 위해 사용)
const PREDS: Record<VertexId, VertexId[]> = (() => {
  const preds = Object.fromEntries(VERTICES.map((v) => [v.id, [] as VertexId[]])) as Record<
    VertexId,
    VertexId[]
  >;
  for (const [from, to] of EDGES) preds[to].push(from);
  for (const id of Object.keys(preds) as VertexId[]) preds[id].sort();
  return preds;
})();

const join = (ids: string[]) => ids.join(', ');

export function buildKahnSteps(): Step[] {
  const steps: Step[] = [];
  const ids = VERTICES.map((v) => v.id);

  // 0. 입력 그래프
  steps.push({
    result: [],
    active: null,
    activeEdge: null,
    doneVertices: [],
    headline: '입력 그래프',
    caption: '입력 그래프. 아직 아무 것도 처리하지 않은 상태',
  });

  // 1. 진입차수 계산
  const indegree = Object.fromEntries(ids.map((id) => [id, 0])) as Record<VertexId, number>;
  for (const [, to] of EDGES) indegree[to] += 1;

  const queue: VertexId[] = ids.filter((id) => indegree[id] === 0);
  const result: VertexId[] = [];

  const summary = ids.map((id) => `${id}=${indegree[id]}`).join(' ');
  steps.push({
    result: [],
    active: null,
    activeEdge: null,
    doneVertices: [],
    indegree: { ...indegree },
    queue: [...queue],
    headline: `진입차수 계산 → 진입차수 0인 ${join(queue)}를 큐에 넣음`,
    caption:
      `모든 간선을 훑어 각 정점의 진입차수(들어오는 간선 수)를 계산했다: ${summary}. ` +
      `진입차수가 0인 정점은 ${join(queue)}뿐이다. ` +
      `${join(queue)}보다 먼저 와야 하는 정점이 하나도 없으므로 지금 바로 순서의 맨 앞에 둘 수 있고, ` +
      `그래서 ${join(queue)}만 큐에 넣고 시작한다.`,
  });

  // 2. 큐에서 하나씩 꺼내 처리
  while (queue.length > 0) {
    const u = queue.shift()!;
    result.push(u);

    const parts: string[] = [];
    const newlyReady: VertexId[] = [];

    for (const v of ADJ[u]) {
      const before = indegree[v];
      indegree[v] -= 1;
      const after = indegree[v];

      if (after === 0) {
        newlyReady.push(v);
        queue.push(v);
        if (PREDS[v].length > 1) {
          parts.push(
            `${v}: ${before}→${after}. ${v}는 ${join(PREDS[v])} 양쪽이 모두 끝나야 처리할 수 있는데, ` +
              `${u}까지 끝나서 남은 선행 조건이 사라졌으므로 큐에 넣는다.`,
          );
        } else {
          parts.push(
            `${v}: ${before}→${after}. 유일한 선행 정점 ${u}가 끝났으므로 큐에 넣는다.`,
          );
        }
      } else {
        const remaining = PREDS[v].filter((p) => !result.includes(p));
        parts.push(
          `${v}: ${before}→${after}. 하지만 아직 ${join(remaining)}라는 선행 조건이 남아 있어 ` +
            `${v}를 지금 꺼내면 ${join(remaining)}보다 앞에 놓이게 되므로 큐에 넣지 않는다.`,
        );
      }
    }

    let caption = `큐의 맨 앞에서 ${u}를 꺼내 결과에 추가했다 (진입차수 0 = 남은 선행 정점 없음). `;
    if (ADJ[u].length === 0) {
      caption += `${u}에서 나가는 간선이 없으므로 진입차수를 바꿀 정점이 없다.`;
    } else {
      caption += `${u}에서 나가는 간선을 지우며 이웃의 진입차수를 1씩 줄인다. ` + parts.join(' ');
      if (newlyReady.length > 1) {
        caption += ` ${join(newlyReady)}의 진입차수가 동시에 0이 되어 함께 큐에 들어간다.`;
      }
    }

    steps.push({
      result: [...result],
      active: u,
      activeEdge: null,
      doneVertices: [...result],
      indegree: { ...indegree },
      queue: [...queue],
      headline:
        `${u}를 꺼내 결과에 추가` +
        (newlyReady.length > 0 ? ` → ${join(newlyReady)} 큐에 들어감` : ''),
      caption,
    });
  }

  // 3. 종료 확인
  const ok = result.length === ids.length;
  steps.push({
    result: [...result],
    active: null,
    activeEdge: null,
    doneVertices: [...result],
    indegree: { ...indegree },
    queue: [],
    headline: ok ? `완료: ${result.join(' ')}` : '사이클 발견',
    caption: ok
      ? `큐가 비었고 결과에 ${result.length}개 정점이 모두 들어갔다 (result.length === ${ids.length}). ` +
        `사이클 없이 모든 정점이 처리되었으므로 ${result.join(' ')}는 올바른 위상 순서다.`
      : `큐가 비었지만 결과에 ${result.length}개 정점만 들어갔다. 남은 정점들 사이에 사이클이 있다.`,
  });

  return steps;
}

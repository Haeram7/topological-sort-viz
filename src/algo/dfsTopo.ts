import { ADJ, VERTICES, type VertexId } from '../data/graph';
import type { Step, VertexColor } from './types';

const join = (ids: string[]) => ids.join(', ');

export function buildDfsSteps(): Step[] {
  const steps: Step[] = [];
  const ids = VERTICES.map((v) => v.id);

  const color = Object.fromEntries(ids.map((id) => [id, 'white'])) as Record<VertexId, VertexColor>;
  const callStack: VertexId[] = [];
  const finishStack: VertexId[] = [];

  const snapshot = (
    active: string | null,
    activeEdge: [string, string] | null,
    caption: string,
  ): Step => ({
    result: [],
    active,
    activeEdge,
    doneVertices: [...finishStack],
    caption,
    color: { ...color },
    callStack: [...callStack],
    finishStack: [...finishStack],
  });

  // 0. 입력 그래프 (Kahn과 동일)
  steps.push({
    result: [],
    active: null,
    activeEdge: null,
    doneVertices: [],
    caption: '입력 그래프. 아직 아무 것도 처리하지 않은 상태',
  });

  // 이미 종료된 이웃을 건너뛴 이유 (다음 단계 캡션에 붙인다)
  const skipNote = (u: VertexId, skipped: VertexId[]) =>
    skipped.length === 0
      ? ''
      : `${u}의 이웃 ${join(skipped)}는 이미 종료(black)되어 다시 방문하지 않는다. ` +
        `${join(skipped)}와 그 뒤에 와야 할 정점들은 이미 종료 스택에 들어가 있어, ` +
        `뒤집었을 때 ${u}보다 뒤에 오는 것이 이미 보장되기 때문이다. `;

  function visit(u: VertexId, parent: VertexId | null, parentSkipped: VertexId[]) {
    color[u] = 'gray';
    callStack.push(u);

    let caption: string;
    if (parent === null) {
      caption =
        `알파벳 순으로 첫 미방문 정점인 ${u}에서 DFS를 시작한다. ${u}를 gray(탐색 중)로 칠하고 호출 스택에 넣는다. ` +
        `하강하는 동안에는 아무 정점도 결과에 확정하지 않는다. ` +
        `${u} 뒤에 와야 할 정점들이 모두 끝났는지 아직 모르기 때문이다.`;
    } else {
      caption =
        skipNote(parent, parentSkipped) +
        `${parent}의 이웃 중 알파벳 순으로 첫 미방문 정점인 ${u}로 내려간다. ` +
        `${u}를 gray로 칠하고 호출 스택에 넣는다 (스택 깊이 ${callStack.length}). ` +
        `아직 ${u}에서 갈 수 있는 정점들이 끝나지 않았으므로 결과는 여전히 비어 있다.`;
    }
    steps.push(snapshot(u, parent ? [parent, u] : null, caption));

    let skipped: VertexId[] = [];
    for (const v of ADJ[u]) {
      if (color[v] === 'white') {
        visit(v, u, skipped);
        skipped = [];
      } else {
        skipped.push(v);
      }
    }

    // 종료
    color[u] = 'black';
    callStack.pop();
    finishStack.push(u);

    let finishCaption = skipNote(u, skipped);
    if (ADJ[u].length === 0) {
      finishCaption +=
        `${u}는 나가는 간선이 없다. 즉 ${u} 뒤에 와야 할 정점이 하나도 없으므로 맨 뒤에 놓아도 안전하다. ` +
        `${u}를 black(종료)으로 칠하고 호출 스택에서 꺼내 종료 스택에 쌓는다.`;
    } else if (callStack.length === 0 && finishStack.length === ids.length) {
      finishCaption +=
        `${u}가 마지막으로 종료된다. ${u}의 호출은 ${u}에서 갈 수 있는 모든 정점이 끝난 뒤에야 끝나므로 ` +
        `종료 스택의 맨 위에 쌓이고, 뒤집으면 결과의 맨 앞에 온다. ` +
        `${u}는 다른 모든 정점보다 먼저 와야 하는 정점이므로 이것이 맞는 위치다.`;
    } else {
      finishCaption +=
        `${u}의 이웃 ${join(ADJ[u])}가 ${ADJ[u].length > 1 ? '모두 ' : ''}종료되었으므로 ` +
        `${u} 뒤에 와야 할 정점은 전부 종료 스택에 있다. ` +
        `${u}를 black으로 칠하고 호출 스택에서 꺼내 종료 스택에 쌓는다. ` +
        `나중에 뒤집으면 ${u}는 그 정점들보다 앞에 온다.`;
    }
    steps.push(snapshot(u, null, finishCaption));
  }

  for (const id of ids) {
    if (color[id] === 'white') visit(id, null, []);
  }

  // 마지막: 종료 스택을 뒤집어 결과 생성
  const result = [...finishStack].reverse();
  steps.push({
    ...snapshot(null, null, ''),
    result,
    doneVertices: [...result],
    caption:
      `모든 정점이 종료되었다. 종료 순서 ${finishStack.join(' ')}를 뒤집으면 ${result.join(' ')}가 된다. ` +
      `각 정점은 자기 뒤에 와야 할 정점들이 모두 종료된 뒤에 종료되므로, 역순은 올바른 위상 순서다.`,
  });

  return steps;
}

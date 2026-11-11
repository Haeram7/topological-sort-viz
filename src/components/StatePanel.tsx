import type { Step, VertexColor } from '../algo/types';

// 이 알고리즘에 어떤 상태 항목이 있는지 (단계마다 레이아웃이 흔들리지 않게 자리를 미리 잡아 둔다)
export type StateLayout = {
  indegree: boolean;
  queue: boolean;
  color: boolean;
  callStack: boolean;
  finishStack: boolean;
  maxCallDepth: number;
};

type StatePanelProps = {
  step: Step;
  layout: StateLayout;
};

const COLOR_LABEL: Record<VertexColor, string> = {
  white: '미방문',
  gray: '탐색 중',
  black: '종료',
};

// 해당 단계에 값이 없으면 자리만 차지하고 보이지 않게 한다
const rowClass = (present: boolean, extra = '') =>
  `state-row${extra ? ` ${extra}` : ''}${present ? '' : ' is-hidden'}`;

export default function StatePanel({ step, layout }: StatePanelProps) {
  const { indegree, queue, color, callStack, finishStack, result, doneVertices } = step;
  const done = new Set(doneVertices);

  return (
    <div className="state-panel">
      {layout.indegree && (
        <div className={rowClass(!!indegree)}>
          <div className="state-label">진입차수</div>
          <table className="state-table">
            <thead>
              <tr>
                {Object.keys(indegree ?? {}).map((id) => (
                  <th key={id}>{id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(indegree ?? {}).map(([id, deg]) => (
                  <td
                    key={id}
                    className={done.has(id) ? 'is-done' : deg === 0 ? 'is-zero' : undefined}
                  >
                    {deg}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {layout.queue && (
        <div className={rowClass(!!queue)}>
          <div className="state-label">큐</div>
          <div className="seq">
            <span className="seq-end">front</span>
            {queue?.length ? (
              queue.map((id) => (
                <span key={id} className="chip chip-waiting">
                  {id}
                </span>
              ))
            ) : (
              <span className="empty">비어 있음</span>
            )}
            <span className="seq-end">back</span>
          </div>
        </div>
      )}

      {layout.color && (
        <div className={rowClass(!!color)}>
          <div className="state-label">색</div>
          <table className="state-table">
            <thead>
              <tr>
                {Object.keys(color ?? {}).map((id) => (
                  <th key={id}>{id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(color ?? {}).map(([id, c]) => (
                  <td key={id} className={`color-${c}`} title={COLOR_LABEL[c]}>
                    {c}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {(layout.callStack || layout.finishStack) && (
        <div className={rowClass(!!(callStack || finishStack), 'stacks')}>
          {layout.callStack && (
            <div className="stack-box">
              <div className="state-label">호출 스택</div>
              {/* column-reverse: 배열의 첫 원소(바닥)가 아래, 마지막 원소(top)가 위 */}
              <div
                className="call-stack"
                style={{ minHeight: `calc(${layout.maxCallDepth} * var(--chip-h) + ${layout.maxCallDepth - 1} * 4px + 16px)` }}
              >
                {callStack?.length ? (
                  callStack.map((id, i) => (
                    <span
                      key={id}
                      className={`chip chip-waiting${i === callStack.length - 1 ? ' chip-top' : ''}`}
                    >
                      {id}
                    </span>
                  ))
                ) : (
                  <span className="empty">비어 있음</span>
                )}
              </div>
            </div>
          )}
          {layout.finishStack && (
            <div className="stack-box grow">
              <div className="state-label">종료 스택 (먼저 종료된 순)</div>
              <div className="seq">
                {finishStack?.length ? (
                  finishStack.map((id) => (
                    <span key={id} className="chip chip-done">
                      {id}
                    </span>
                  ))
                ) : (
                  <span className="empty">비어 있음</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="state-row">
        <div className="state-label">결과</div>
        <div className="seq">
          {result.length === 0 ? (
            <span className="empty">아직 없음</span>
          ) : (
            result.map((id, i) => (
              <span key={id} className="seq-item">
                {i > 0 && <span className="arrow">→</span>}
                <span className="chip chip-done">{id}</span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

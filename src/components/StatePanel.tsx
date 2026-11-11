import type { Step, VertexColor } from '../algo/types';

type StatePanelProps = {
  step: Step;
};

const COLOR_LABEL: Record<VertexColor, string> = {
  white: '미방문',
  gray: '탐색 중',
  black: '종료',
};

export default function StatePanel({ step }: StatePanelProps) {
  const { indegree, queue, color, callStack, finishStack, result } = step;

  return (
    <div className="state-panel">
      {indegree && (
        <div className="state-row">
          <div className="state-label">진입차수</div>
          <table className="state-table">
            <thead>
              <tr>
                {Object.keys(indegree).map((id) => (
                  <th key={id}>{id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(indegree).map(([id, deg]) => (
                  <td key={id} className={deg === 0 ? 'zero' : undefined}>
                    {deg}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {queue && (
        <div className="state-row">
          <div className="state-label">큐</div>
          <div className="queue">
            <span className="queue-end">front →</span>
            {queue.length === 0 ? (
              <span className="empty">(비어 있음)</span>
            ) : (
              queue.map((id) => (
                <span key={id} className="chip">
                  {id}
                </span>
              ))
            )}
            <span className="queue-end">← back</span>
          </div>
        </div>
      )}

      {color && (
        <div className="state-row">
          <div className="state-label">색</div>
          <table className="state-table">
            <thead>
              <tr>
                {Object.keys(color).map((id) => (
                  <th key={id}>{id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(color).map(([id, c]) => (
                  <td key={id} className={`color-${c}`} title={COLOR_LABEL[c]}>
                    {c}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {(callStack || finishStack) && (
        <div className="state-row stacks">
          {callStack && (
            <div className="stack-box">
              <div className="state-label">호출 스택</div>
              {/* column-reverse: 배열의 첫 원소(바닥)가 아래, 마지막 원소(top)가 위 */}
              <div className="call-stack">
                <span className="stack-floor">바닥</span>
                {callStack.map((id, i) => (
                  <span
                    key={id}
                    className={`chip${i === callStack.length - 1 ? ' top' : ''}`}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
          {finishStack && (
            <div className="stack-box">
              <div className="state-label">종료 스택</div>
              <div className="queue">
                <span className="queue-end">먼저 종료 →</span>
                {finishStack.length === 0 ? (
                  <span className="empty">(비어 있음)</span>
                ) : (
                  finishStack.map((id) => (
                    <span key={id} className="chip chip-black">
                      {id}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="state-row">
        <div className="state-label">결과</div>
        <div className="result">
          {result.length === 0 ? (
            <span className="empty">(아직 없음)</span>
          ) : (
            result.map((id, i) => (
              <span key={id} className="result-item">
                {i > 0 && <span className="arrow">→</span>}
                <span className="chip">{id}</span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

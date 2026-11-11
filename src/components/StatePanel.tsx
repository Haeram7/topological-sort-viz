import type { Step } from '../algo/types';

type StatePanelProps = {
  step: Step;
};

export default function StatePanel({ step }: StatePanelProps) {
  const { indegree, queue, result } = step;

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

import { useState } from 'react';
import { EDGES } from '../data/graph';

type FinalComparisonProps = {
  results: { name: string; order: string[] }[];
};

export default function FinalComparison({ results }: FinalComparisonProps) {
  const [open, setOpen] = useState(false);
  // 결과마다 같은 위치에 다른 정점이 오는 칸을 강조
  const differs = (i: number) => results.some((r) => r.order[i] !== results[0].order[i]);

  return (
    <>
      <div className="final-toggle-wrap">
        <button
          type="button"
          className="final-toggle"
          aria-expanded={open}
          aria-controls="final-results"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '최종 결과 비교 접기' : '최종 결과 비교 보기'}
          <span className="chevron" aria-hidden="true">
            ▼
          </span>
        </button>
      </div>

      {open && (
        <section id="final-results" className="final-results">
          <h2>최종 결과 비교</h2>

          <div className="final-orders">
            {results.map(({ name, order }) => (
              <div key={name} className="final-row">
                <span className="final-label">{name}</span>
                <div className="seq">
                  {order.map((id, i) => (
                    <span key={id} className="seq-item">
                      {i > 0 && <span className="arrow">→</span>}
                      <span className={`chip chip-lg${differs(i) ? ' chip-diff' : ''}`}>{id}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="final-note">
            두 결과는 다르지만, 모든 간선 u→v에 대해 u가 v보다 앞에 있으므로{' '}
            <strong>둘 다 올바른 위상 순서</strong>다.
            <span className="final-hint"> 강조된 칸은 두 결과에서 순서가 갈리는 위치.</span>
          </p>

          <div className="edge-check-wrap">
            <table className="edge-check">
              <thead>
                <tr>
                  <th>간선</th>
                  {EDGES.map(([from, to]) => (
                    <th key={`${from}${to}`}>
                      {from}→{to}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(({ name, order }) => (
                  <tr key={name}>
                    <th>{name}</th>
                    {EDGES.map(([from, to]) => {
                      const a = order.indexOf(from) + 1;
                      const b = order.indexOf(to) + 1;
                      const ok = a < b;
                      return (
                        <td key={`${from}${to}`} className={ok ? 'ok' : 'ng'}>
                          {a}&lt;{b} {ok ? '✓' : '✗'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

import { useMemo, useState } from 'react';
import { buildDfsSteps } from './algo/dfsTopo';
import { buildKahnSteps } from './algo/kahn';
import AlgoPanel from './components/AlgoPanel';
import StepControls from './components/StepControls';

// 최종 결과 확인용 (모듈 로드 시 한 번만 출력)
// 기대값 — Kahn: A B C D E F G / DFS: A C E B D F G (종료 순서 G F D B E C A)
{
  const kahnLast = buildKahnSteps().at(-1);
  const dfsLast = buildDfsSteps().at(-1);
  console.log('[Kahn] 최종 결과:', kahnLast?.result.join(' '));
  console.log('[DFS] 종료 순서:', dfsLast?.finishStack?.join(' '));
  console.log('[DFS] 최종 결과:', dfsLast?.result.join(' '));
}

function App() {
  const kahnSteps = useMemo(() => buildKahnSteps(), []);
  const dfsSteps = useMemo(() => buildDfsSteps(), []);

  // 두 알고리즘의 단계 수가 다르므로 인덱스를 따로 관리한다
  const [kahnIndex, setKahnIndex] = useState(0);
  const [dfsIndex, setDfsIndex] = useState(0);

  const kahnResult = kahnSteps[kahnSteps.length - 1].result;
  const dfsResult = dfsSteps[dfsSteps.length - 1].result;

  return (
    <div className="container wide">
      <h1>위상 정렬 시각화</h1>

      <div className="compare">
        <div className="compare-col">
          <AlgoPanel title="Kahn 알고리즘 (진입차수 + 큐)" steps={kahnSteps} stepIndex={kahnIndex} />
          <StepControls stepIndex={kahnIndex} total={kahnSteps.length} onChange={setKahnIndex} />
        </div>
        <div className="compare-col">
          <AlgoPanel title="DFS 기반 (종료 순서의 역순)" steps={dfsSteps} stepIndex={dfsIndex} />
          <StepControls stepIndex={dfsIndex} total={dfsSteps.length} onChange={setDfsIndex} />
        </div>
      </div>

      <section className="final-results">
        <h2>최종 결과 비교</h2>
        <div className="final-row">
          <span className="final-label">Kahn</span>
          <span className="final-order">{kahnResult.join(' ')}</span>
        </div>
        <div className="final-row">
          <span className="final-label">DFS</span>
          <span className="final-order">{dfsResult.join(' ')}</span>
        </div>
        <p className="final-note">
          두 결과는 다르지만, 모든 간선 u→v에 대해 u가 v보다 앞에 있으므로 둘 다 올바른 위상 순서다.
        </p>
      </section>
    </div>
  );
}

export default App;

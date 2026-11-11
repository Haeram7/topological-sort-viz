import { useMemo, useState } from 'react';
import { buildDfsSteps } from './algo/dfsTopo';
import { buildKahnSteps } from './algo/kahn';
import AlgoPanel from './components/AlgoPanel';
import FinalComparison from './components/FinalComparison';
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

// ?kahn=5&dfs=6 처럼 시작 단계를 지정할 수 있다 (1부터 셈, 문서용 스크린샷 재현용)
function initialIndex(key: string, total: number) {
  const n = Number(new URLSearchParams(window.location.search).get(key));
  return Number.isInteger(n) && n >= 1 && n <= total ? n - 1 : 0;
}

function App() {
  const kahnSteps = useMemo(() => buildKahnSteps(), []);
  const dfsSteps = useMemo(() => buildDfsSteps(), []);

  // 두 알고리즘의 단계 수가 다르므로 인덱스를 따로 관리한다
  const [kahnIndex, setKahnIndex] = useState(() => initialIndex('kahn', kahnSteps.length));
  const [dfsIndex, setDfsIndex] = useState(() => initialIndex('dfs', dfsSteps.length));

  const kahnResult = kahnSteps[kahnSteps.length - 1].result;
  const dfsResult = dfsSteps[dfsSteps.length - 1].result;

  return (
    <div className="container">
      <header className="page-header">
        <h1>위상 정렬 시각화</h1>
        <p className="subtitle">
          같은 방향 그래프에 Kahn 알고리즘과 DFS 기반 알고리즘을 적용해 단계별로 비교한다.
        </p>
      </header>

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

      <FinalComparison
        results={[
          { name: 'Kahn', order: kahnResult },
          { name: 'DFS', order: dfsResult },
        ]}
      />
    </div>
  );
}

export default App;

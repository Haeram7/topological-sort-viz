import { useMemo, useState } from 'react';
import { buildKahnSteps } from './algo/kahn';
import AlgoPanel from './components/AlgoPanel';

// 최종 결과가 A B C D E F G인지 확인용 (모듈 로드 시 한 번만 출력)
console.log('[Kahn] 최종 결과:', buildKahnSteps().at(-1)?.result.join(' '));

function App() {
  const steps = useMemo(() => buildKahnSteps(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const last = steps.length - 1;

  return (
    <div className="container">
      <h1>위상 정렬 시각화</h1>

      <AlgoPanel title="Kahn 알고리즘 (진입차수 + 큐)" steps={steps} stepIndex={stepIndex} />

      <div className="controls">
        <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}>
          ◀ 이전
        </button>
        <input
          type="range"
          min={0}
          max={last}
          value={stepIndex}
          onChange={(e) => setStepIndex(Number(e.target.value))}
        />
        <button
          onClick={() => setStepIndex((i) => Math.min(last, i + 1))}
          disabled={stepIndex === last}
        >
          다음 ▶
        </button>
        <span className="step-count">
          {stepIndex + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}

export default App;

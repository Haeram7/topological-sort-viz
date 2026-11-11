import { useMemo } from 'react';
import type { Step } from '../algo/types';
import { EDGES, edgeKey } from '../data/graph';
import GraphView, { type EdgeStyle } from './GraphView';
import StatePanel, { type StateLayout } from './StatePanel';

type AlgoPanelProps = {
  title: string;
  steps: Step[];
  stepIndex: number;
};

// Step만 보고 간선 표시 상태를 정한다 (렌더링은 여전히 steps[i]에 대한 순수 함수)
function computeEdgeStyles(step: Step): Record<string, EdgeStyle> {
  const styles: Record<string, EdgeStyle> = {};

  if (step.indegree) {
    // Kahn: 처리한 정점에서 나가는 간선은 "지운" 간선
    const done = new Set(step.doneVertices);
    for (const [from, to] of EDGES) {
      if (from === step.active) styles[edgeKey(from, to)] = 'removing';
      else if (done.has(from)) styles[edgeKey(from, to)] = 'removed';
    }
  }

  if (step.callStack) {
    // DFS: 호출 스택이 곧 현재 탐색 경로
    for (let i = 1; i < step.callStack.length; i++) {
      styles[edgeKey(step.callStack[i - 1], step.callStack[i])] = 'path';
    }
    for (const [from, to] of step.skippedEdges ?? []) {
      styles[edgeKey(from, to)] = 'skipped';
    }
  }

  return styles;
}

export default function AlgoPanel({ title, steps, stepIndex }: AlgoPanelProps) {
  const step = steps[stepIndex];

  const layout = useMemo<StateLayout>(
    () => ({
      indegree: steps.some((s) => s.indegree),
      queue: steps.some((s) => s.queue),
      color: steps.some((s) => s.color),
      callStack: steps.some((s) => s.callStack),
      finishStack: steps.some((s) => s.finishStack),
      maxCallDepth: Math.max(1, ...steps.map((s) => s.callStack?.length ?? 0)),
    }),
    [steps],
  );
  const isDfs = layout.color;

  return (
    <section className="algo-panel">
      <h2>{title}</h2>

      <div className="graph-wrap">
        <GraphView
          activeVertex={step.active}
          activeEdge={step.activeEdge}
          doneVertices={step.doneVertices}
          vertexBadges={step.indegree}
          vertexColors={step.color}
          waitingVertices={step.queue}
          edgeStyles={computeEdgeStyles(step)}
        />
        <Legend dfs={isDfs} />
      </div>

      <div className="caption">
        <div className="caption-head">
          <span className="step-tag">
            {stepIndex + 1}/{steps.length}
          </span>
          <strong>{step.headline}</strong>
        </div>
        <p>{step.caption}</p>
      </div>

      <StatePanel step={step} layout={layout} />
    </section>
  );
}

function Legend({ dfs }: { dfs: boolean }) {
  // 정점 범례 / 간선 범례를 두 줄로 고정해 좌우 패널 높이를 맞춘다
  return (
    <div className="legend">
      <div className="legend-row">
        <span className="legend-item">
          <i className="swatch swatch-idle" />
          {dfs ? '미방문' : '미처리'}
        </span>
        <span className="legend-item">
          <i className="swatch swatch-waiting" />
          {dfs ? '탐색 중' : '큐에 있음'}
        </span>
        <span className="legend-item">
          <i className="swatch swatch-done" />
          {dfs ? '종료' : '결과에 추가됨'}
        </span>
        <span className="legend-item">
          <i className="swatch swatch-current" />
          지금 처리 중
        </span>
      </div>
      <div className="legend-row">
        {dfs ? (
          <>
            <span className="legend-item">
              <i className="line line-active" />
              방금 내려간 간선
            </span>
            <span className="legend-item">
              <i className="line line-path" />
              호출 경로
            </span>
            <span className="legend-item">
              <i className="line line-skipped" />
              건너뛴 간선
            </span>
          </>
        ) : (
          <>
            <span className="legend-item">
              <i className="line line-removing" />
              지우는 간선
            </span>
            <span className="legend-item">
              <i className="line line-removed" />
              지운 간선
            </span>
          </>
        )}
      </div>
    </div>
  );
}

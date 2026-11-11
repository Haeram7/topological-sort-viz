import type { Step } from '../algo/types';
import GraphView from './GraphView';
import StatePanel from './StatePanel';

type AlgoPanelProps = {
  title: string;
  steps: Step[];
  stepIndex: number;
};

export default function AlgoPanel({ title, steps, stepIndex }: AlgoPanelProps) {
  const step = steps[stepIndex];

  return (
    <section className="algo-panel">
      <h2>{title}</h2>
      <GraphView
        activeVertex={step.active}
        activeEdge={step.activeEdge}
        doneVertices={step.doneVertices}
        vertexBadges={step.indegree}
        vertexColors={step.color}
      />
      <p className="caption">{step.caption}</p>
      <StatePanel step={step} />
    </section>
  );
}

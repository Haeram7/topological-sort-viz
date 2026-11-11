type StepControlsProps = {
  stepIndex: number;
  total: number;
  onChange: (index: number) => void;
};

export default function StepControls({ stepIndex, total, onChange }: StepControlsProps) {
  const last = total - 1;

  return (
    <div className="controls">
      <button onClick={() => onChange(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>
        ◀ 이전
      </button>
      <input
        type="range"
        min={0}
        max={last}
        value={stepIndex}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button onClick={() => onChange(Math.min(last, stepIndex + 1))} disabled={stepIndex === last}>
        다음 ▶
      </button>
      <span className="step-count">
        {stepIndex + 1} / {total}
      </span>
    </div>
  );
}

export function ScoreBar({ score, color = 'var(--accent)' }: { score: number; color?: string }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      borderRadius: 100, height: 3, width: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        background: color, height: '100%',
        width: `${Math.max(0, Math.min(100, score))}%`,
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
}

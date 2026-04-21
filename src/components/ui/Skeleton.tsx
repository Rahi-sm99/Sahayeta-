export function Skeleton({ width = '100%', height = 20, borderRadius = 'var(--radius-sm)' }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'var(--bg-subtle)',
      animation: 'skeletonPulse 1.5s infinite ease-in-out',
    }} />
  );
}

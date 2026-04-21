export function LiveDot({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: color,
      boxShadow: `0 0 8px ${color}`,
      animation: 'blink 1.5s infinite ease-in-out',
    }} />
  );
}

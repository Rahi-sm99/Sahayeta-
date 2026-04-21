export default function CrisisOverlay() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--critical)', zIndex: 900,
      pointerEvents: 'none',
      animation: 'crisisFlash 2s infinite ease-in-out',
    }} />
  );
}

export function Badge({ severity }: { severity: string }) {
  const isCritical = severity === 'Critical';
  return (
    <span style={{
      background: `var(--${severity.toLowerCase()}-subtle, var(--border-default))`,
      color: `var(--${severity.toLowerCase()}, var(--text-primary))`,
      border: isCritical ? '1px solid rgba(244,63,94,0.25)' : 'none',
      borderRadius: 100, padding: '3px 10px',
      fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 500,
      letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>
      {severity}
    </span>
  );
}

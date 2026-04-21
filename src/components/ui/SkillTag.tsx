export function SkillTag({ skill }: { skill: string }) {
  return (
    <span style={{
      background: 'var(--bg-subtle)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      padding: '2px 8px', fontSize: '0.75rem',
    }}>
      {skill}
    </span>
  );
}

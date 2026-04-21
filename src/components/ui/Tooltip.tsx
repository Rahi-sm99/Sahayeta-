import React, { useState } from 'react';

export function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: 8, padding: '4px 8px', background: 'var(--bg-elevated)',
          color: 'var(--text-primary)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)',
          whiteSpace: 'nowrap', zIndex: 100, border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-card)', animation: 'fadeIn 0.2s ease',
        }}>
          {content}
        </div>
      )}
    </div>
  );
}

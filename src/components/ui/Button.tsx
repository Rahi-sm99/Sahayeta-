import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

export function Button({ variant = 'primary', style, children, ...props }: ButtonProps) {
  const base = {
    borderRadius: 'var(--radius-md)', padding: '10px 20px',
    fontFamily: 'Syne', fontWeight: 700,
    cursor: 'pointer', outline: 'none', border: 'none',
    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };

  const variants = {
    primary: {
      background: 'var(--gradient-accent)', color: 'white',
      boxShadow: 'var(--shadow-card)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-secondary)',
      border: '1px solid var(--border-strong)',
    },
    danger: {
      background: 'var(--critical-subtle)', color: 'var(--critical)',
      border: '1px solid rgba(244,63,94,0.3)',
    }
  };

  return (
    <button
      {...props}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
          e.currentTarget.style.filter = 'brightness(1.1)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'var(--bg-subtle)';
          e.currentTarget.style.color = 'var(--text-primary)';
        } else if (variant === 'danger') {
          e.currentTarget.style.background = 'var(--critical)';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = variant === 'primary' ? 'var(--shadow-card)' : 'none';
        e.currentTarget.style.filter = 'none';
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.color = variants[variant].color;
      }}
    >
      {children}
    </button>
  );
}

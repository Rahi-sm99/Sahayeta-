import type { ReactNode } from 'react';
import React from 'react';

export function PageWrapper({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={className} 
      style={{ 
        ...style,
        animation: 'fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        paddingTop: 60, /* For fixed navbar */
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column'
      }}
    >
      {children}
    </div>
  );
}

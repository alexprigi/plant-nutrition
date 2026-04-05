'use client';

import { useState } from 'react';

interface ScrollButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollButton({ href, children, className = '' }: ScrollButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 border-2 hover:shadow-lg ${className}`}
      style={{
        color: isHovered ? 'white' : 'var(--brand-title)',
        borderColor: 'var(--brand-title)',
        background: isHovered ? 'var(--brand-title)' : 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}

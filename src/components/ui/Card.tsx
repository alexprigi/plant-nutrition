
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}



const Card = ({ children, className = '', hover = false, style }: CardProps) => {
  const baseClasses = "rounded-lg shadow-md";
  const hoverClasses = hover ? "hover:shadow-lg transition-shadow duration-300" : "";
  const defaultStyle: React.CSSProperties = {
    background: 'var(--card-bg)',
    color: 'var(--foreground)',
    ...style,
  };
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} style={defaultStyle}>
      {children}
    </div>
  );
};

export default Card;
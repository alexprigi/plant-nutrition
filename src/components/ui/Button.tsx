
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}


const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  href, 
  onClick, 
  type = 'button',
  disabled = false
}: ButtonProps) => {

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-lift";
  
  const variants = {
    primary: "text-[var(--foreground)] bg-[var(--button-bg)] hover:bg-[var(--button-hover)]",
    secondary: "text-[var(--color-main-dark)] bg-[var(--color-main-light)] hover:bg-[var(--color-main)] hover:text-white",
    outline: "border-4 border-[var(--color-main-dark)] text-[var(--color-main-dark)] bg-transparent font-semibold hover:bg-[#E6EFE6] hover:text-[var(--color-main-dark)] hover:border-[var(--color-main-dark)] hover:shadow-lg",
    sage: "text-white bg-[var(--accent)] hover:opacity-90"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  // Non serve più customStyle né event handlers JS
  if (href) {
    return (
      <a
        href={href}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;
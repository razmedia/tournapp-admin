import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  loading = false,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-500 shadow-xs hover:shadow-sm',
    secondary: 'bg-white text-text-secondary border-border hover:bg-gray-50 hover:text-text-primary focus:ring-primary-500 shadow-xs hover:shadow-sm',
    danger: 'bg-danger-600 text-white border-danger-600 hover:bg-danger-700 hover:border-danger-700 focus:ring-danger-500 shadow-xs hover:shadow-sm',
    success: 'bg-success-600 text-white border-success-600 hover:bg-success-700 hover:border-success-700 focus:ring-success-500 shadow-xs hover:shadow-sm',
    warning: 'bg-warning-600 text-white border-warning-600 hover:bg-warning-700 hover:border-warning-700 focus:ring-warning-500 shadow-xs hover:shadow-sm',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
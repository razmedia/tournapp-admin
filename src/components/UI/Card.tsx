import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  title, 
  subtitle,
  padding = 'md'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-xl shadow-xs hover:shadow-sm transition-shadow duration-200 ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
import React from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function StatCard({ 
  label, 
  value, 
  icon, 
  trend,
  color = 'blue'
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-primary-600 bg-primary-50',
    green: 'text-success-600 bg-success-50',
    yellow: 'text-warning-600 bg-warning-50',
    red: 'text-danger-600 bg-danger-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-success-600' : 'text-danger-600'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-text-muted ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
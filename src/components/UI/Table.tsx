import React from 'react';
import Button from './Button';

interface Column {
  header: string;
  key: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface Action {
  label: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  icon?: React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  onAction?: (action: string, row: any) => void;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function Table({ 
  columns, 
  data, 
  actions, 
  onAction, 
  onRowClick,
  loading = false,
  emptyMessage = "No data available"
}: TableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-text-secondary">Loading...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-muted text-lg mb-2">📋</div>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-gray-25">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {data.map((row, index) => (
              <tr 
                key={index} 
                className={`transition-colors duration-150 ${
                  onRowClick 
                    ? 'hover:bg-gray-25 cursor-pointer' 
                    : 'hover:bg-gray-25'
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      {actions.map((action) => (
                        <Button
                          key={action.action}
                          size="sm"
                          variant={action.variant || 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when clicking action buttons
                            onAction?.(action.action, row);
                          }}
                          className="min-w-0"
                        >
                          {action.icon && <span className="mr-1">{action.icon}</span>}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
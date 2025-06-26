import React from 'react';
import { AlertTriangle, X, Info, Clock, Users, Database } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  details?: string[];
  warningLevel?: 'low' | 'medium' | 'high';
  affectedItems?: {
    label: string;
    count: number;
    icon?: React.ReactNode;
  }[];
  consequences?: string[];
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  itemType,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  details = [],
  warningLevel = 'medium',
  affectedItems = [],
  consequences = []
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'text-danger-600',
      bg: 'bg-danger-50',
      border: 'border-danger-200',
      button: 'danger' as const,
      headerBg: 'bg-gradient-to-r from-danger-50 to-danger-100'
    },
    warning: {
      icon: 'text-warning-600',
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      button: 'warning' as const,
      headerBg: 'bg-gradient-to-r from-warning-50 to-warning-100'
    },
    info: {
      icon: 'text-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      button: 'primary' as const,
      headerBg: 'bg-gradient-to-r from-primary-50 to-primary-100'
    }
  };

  const warningStyles = {
    low: {
      color: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '⚠️'
    },
    medium: {
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: '🚨'
    },
    high: {
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '🔥'
    }
  };

  const styles = variantStyles[variant];
  const warningStyle = warningStyles[warningLevel];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Enhanced Header */}
          <div className={`px-6 py-4 ${styles.headerBg} border-b border-border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-white shadow-sm`}>
                  <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                  {itemType && (
                    <p className="text-sm text-text-secondary">{itemType} Deletion</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            <div className="space-y-6">
              {/* Main Message */}
              <div className="space-y-3">
                <p className="text-text-primary font-medium">{message}</p>
                
                {itemName && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        {itemType || 'Item'}:
                      </span>
                      <span className="font-bold text-text-primary text-lg">"{itemName}"</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Affected Items Count */}
              {affectedItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-text-secondary" />
                    <h4 className="text-sm font-semibold text-text-primary">Affected Data</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {affectedItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {item.icon || <Users className="h-4 w-4 text-gray-400" />}
                          <span className="text-sm text-text-primary">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-text-secondary">
                          {item.count} {item.count === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Impact */}
              {details.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-text-secondary" />
                    <h4 className="text-sm font-semibold text-text-primary">This will affect:</h4>
                  </div>
                  <ul className="space-y-2">
                    {details.map((detail, index) => (
                      <li key={index} className="text-sm text-text-muted flex items-start">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Consequences */}
              {consequences.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-text-secondary" />
                    <h4 className="text-sm font-semibold text-text-primary">Consequences:</h4>
                  </div>
                  <ul className="space-y-2">
                    {consequences.map((consequence, index) => (
                      <li key={index} className="text-sm text-text-muted flex items-start">
                        <span className="text-warning-500 mr-2 flex-shrink-0">⚠️</span>
                        <span>{consequence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warning Box */}
              <div className={`p-4 rounded-lg ${warningStyle.bg} ${warningStyle.border} border`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl flex-shrink-0">{warningStyle.icon}</span>
                  <div className="space-y-2">
                    <p className={`text-sm font-semibold ${warningStyle.color}`}>
                      {warningLevel === 'high' ? 'CRITICAL WARNING' : 
                       warningLevel === 'medium' ? 'Important Warning' : 'Notice'}
                    </p>
                    <p className={`text-sm ${warningStyle.color}`}>
                      {warningLevel === 'high' 
                        ? 'This action will permanently delete critical data and cannot be undone. Multiple systems may be affected.'
                        : warningLevel === 'medium'
                        ? 'This action cannot be undone and may affect related data in the system.'
                        : 'This action cannot be undone. Please confirm you want to proceed.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Input for High-Risk Items */}
              {warningLevel === 'high' && itemName && (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      To confirm deletion, please type the name exactly: <code className="bg-red-100 px-1 rounded">{itemName}</code>
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder={`Type "${itemName}" to confirm`}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-border">
            <div className="text-xs text-text-muted">
              Action ID: {Date.now().toString().slice(-6)}
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={onClose}
                className="min-w-[80px]"
              >
                {cancelText}
              </Button>
              <Button 
                variant={styles.button}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="min-w-[80px]"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
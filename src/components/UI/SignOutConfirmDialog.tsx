import React from 'react';
import { LogOut, X, Shield, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface SignOutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  userRole?: string;
}

// Tournapp Logo Component with theme switching
const TournappLogo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      {/* Light mode logo */}
      <img 
        src="/assets/light-tournapp-logo.svg" 
        alt="Tournapp" 
        className="h-6 w-auto dark:hidden"
      />
      {/* Dark mode logo */}
      <img 
        src="/assets/dark-tournapp-logo.svg" 
        alt="Tournapp" 
        className="h-6 w-auto hidden dark:block"
      />
    </div>
  );
};

export default function SignOutConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  userName = 'User',
  userRole = 'Admin'
}: SignOutConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-border dark:border-gray-700">
          {/* Header with Tournapp Branding */}
          <div className="relative px-6 py-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-b border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TournappLogo />
                <div>
                  <h2 className="text-xl font-bold text-text-primary dark:text-white">Sign Out</h2>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Tournapp Admin Panel</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Warning Icon and Message */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-warning-100 dark:bg-warning-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
                    Confirm Sign Out
                  </h3>
                  <p className="text-text-secondary dark:text-gray-300 leading-relaxed">
                    Are you sure you want to sign out of your admin session? You will need to log in again to access the system.
                  </p>
                </div>
              </div>

              {/* User Information */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Current Session</p>
                    <p className="font-semibold text-text-primary dark:text-white">{userName}</p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Security Notice</p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Your session will be securely terminated and all unsaved changes may be lost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-border dark:border-gray-600">
            <div className="text-xs text-text-muted dark:text-gray-500">
              Session ID: {Date.now().toString().slice(-6)}
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={onClose}
                className="min-w-[80px]"
              >
                Cancel
              </Button>
              <Button 
                variant="danger"
                onClick={handleConfirm}
                className="min-w-[100px] flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
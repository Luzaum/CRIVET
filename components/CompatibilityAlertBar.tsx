import React from 'react';
import { CompatibilityLevel } from '../utils/compatibility';

interface CompatibilityAlertBarProps {
  level: CompatibilityLevel;
  message: string;
  reason: string;
}

export const CompatibilityAlertBar: React.FC<CompatibilityAlertBarProps> = ({
  level,
  message,
  reason,
}) => {
  const getAlertStyles = () => {
    switch (level) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className={`border rounded-lg p-3 ${getAlertStyles()}`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0">
          {level === 'success' && '✅'}
          {level === 'warning' && '⚠️'}
          {level === 'danger' && '🚨'}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
          <p className="text-xs mt-1 opacity-80">{reason}</p>
        </div>
      </div>
    </div>
  );
};

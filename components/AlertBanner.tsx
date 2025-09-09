import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  Collapse, 
  IconButton,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { AlertMessage } from '../types';

interface AlertBannerProps {
  alert: AlertMessage;
  onClose?: () => void;
  closable?: boolean;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alert,
  onClose,
  closable = false
}) => {
  const getSeverity = (type: AlertMessage['type']) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  const getIcon = () => {
    if (alert.icon) return alert.icon;
    
    switch (alert.type) {
      case 'error': return '🚫';
      case 'warning': return '⚠️';
      case 'info': return '💡';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <Alert
      severity={getSeverity(alert.type)}
      sx={{
        mb: 2,
        '& .MuiAlert-icon': {
          fontSize: '1.5rem'
        }
      }}
      action={
        closable && onClose ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : undefined
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="span" sx={{ mr: 1, fontSize: '1.2rem' }}>
          {getIcon()}
        </Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {alert.message}
        </Typography>
      </Box>
    </Alert>
  );
};

interface AlertListProps {
  alerts: AlertMessage[];
  onClose?: (index: number) => void;
  closable?: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onClose,
  closable = false
}) => {
  if (alerts.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {alerts.map((alert, index) => (
        <AlertBanner
          key={index}
          alert={alert}
          onClose={closable ? () => onClose?.(index) : undefined}
          closable={closable}
        />
      ))}
    </Box>
  );
};

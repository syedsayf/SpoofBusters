// src/utils/styles.js
export const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'safe':
        return 'text-cyber-success';
      case 'warning':
        return 'text-cyber-warning';
      case 'danger':
        return 'text-cyber-danger';
      default:
        return 'text-cyber-neon';
    }
  };
  
  export const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'safe':
        return 'cyber-badge-success';
      case 'warning':
        return 'cyber-badge-warning';
      case 'danger':
        return 'cyber-badge-danger';
      default:
        return 'cyber-badge';
    }
  };
  
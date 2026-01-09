import React, { useState, useEffect } from 'react';
import { backgroundSyncEngine } from '../../services/simple-services';

const ConnectionStatus = ({ isOnline, syncStatus }) => {
  const getStatusColor = () => {
    if (!isOnline) return '#dc3545'; // Red for offline
    if (syncStatus?.syncing) return '#ffc107'; // Yellow for syncing
    if (syncStatus?.pending > 0) return '#fd7e14'; // Orange for pending
    return '#28a745'; // Green for online and synced
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline-Modus';
    if (syncStatus?.syncing) return 'Synchronisiert...';
    if (syncStatus?.pending > 0) return `${syncStatus.pending} ausstehend`;
    return 'Online & Synchronisiert';
  };

  const getStatusIcon = () => {
    if (!isOnline) return '📴';
    if (syncStatus?.syncing) return '🔄';
    if (syncStatus?.pending > 0) return '⏳';
    return '✅';
  };

  const handleRetrySync = () => {
    if (isOnline && syncStatus?.pending > 0) {
      backgroundSyncEngine.processSyncQueue();
    }
  };

  return (
    <div 
      className="connection-status"
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        padding: '8px 12px',
        borderRadius: '20px',
        backgroundColor: getStatusColor(),
        color: 'white',
        fontSize: '12px',
        fontWeight: '500',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: syncStatus?.pending > 0 ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
      onClick={handleRetrySync}
      title={syncStatus?.pending > 0 ? 'Klicken zum erneuten Synchronisieren' : ''}
    >
      <span>{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
      
      {/* Sync animation */}
      {syncStatus?.syncing && (
        <div 
          style={{
            width: '12px',
            height: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
    </div>
  );
};

export default ConnectionStatus;
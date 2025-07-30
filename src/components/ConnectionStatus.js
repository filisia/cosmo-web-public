import React from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

function ConnectionStatus() {
  const { wsConnected, connectionLogs } = useWebSocket();

  const getStatusColor = () => {
    if (wsConnected) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = () => {
    return '';
  };

  const getStatusIcon = () => {
    if (wsConnected) return '🟢';
    return '';
  };

  const getHelpText = () => {
    if (wsConnected) {
      return 'Your Cosmo Bridge app is connected and ready to use!';
    }
    
    return (
      <div className="text-sm">
        <p className="mb-2">To connect to your Cosmo devices:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Make sure the Cosmo Bridge app is installed and running on your Mac</li>
          <li>The web app will automatically connect to your local bridge on port 8080</li>
          <li>If connection fails, check that the bridge app is running and not blocked by firewall</li>
        </ol>
      </div>
    );
  };

  // Only show the component when connected
  if (!wsConnected) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <p className="text-sm opacity-80">{getHelpText()}</p>
          </div>
        </div>
      </div>
      
      {/* Show recent connection logs */}
      {connectionLogs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <details className="text-xs">
            <summary className="cursor-pointer hover:opacity-80">
              Recent connection activity ({connectionLogs.length})
            </summary>
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {connectionLogs.slice(-5).map((log, index) => (
                <div key={index} className="opacity-80">
                  <span className="text-xs opacity-60">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="ml-2">{log.message}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default ConnectionStatus; 
import React from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

function ConnectionStatus() {
  const { wsConnected, connectionLogs } = useWebSocket();

  const getStatusColor = () => {
    if (wsConnected) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = () => {
    if (wsConnected) return 'Connected to Cosmo Bridge';
    return 'Searching for local Cosmo Bridge app...';
  };

  const getStatusIcon = () => {
    if (wsConnected) return '🟢';
    return '🟡';
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
          <li>Ensure your Mac and this device are on the same network</li>
          <li>The app will automatically search for your local Cosmo Bridge</li>
        </ol>
      </div>
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <h3 className="font-medium">{getStatusText()}</h3>
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
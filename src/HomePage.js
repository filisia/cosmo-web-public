// HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import wsService from './services/WebSocketService';
import { useWebSocket } from './contexts/WebSocketContext';
import cosmoLogo from './assets/images/cosmo_logo.png';

function HomePage({ colors }) {
  const { 
    wsConnected, 
    connectionError, 
    connectedDevices, 
    deviceInfo, 
    deviceValues 
  } = useWebSocket();
  
  const [lockState, setLockState] = useState({ isLocked: false, deviceIds: [] });
  const [lastScanTime, setLastScanTime] = useState(new Date());

  // Debug: Log connected devices and their connection status
  React.useEffect(() => {
    console.log('HomePage - connectedDevices:', connectedDevices);
    if (connectedDevices && connectedDevices.length > 0) {
      console.log('HomePage - Connected Devices Details:', connectedDevices.map(device => ({
        id: device.id,
        name: device.name,
        connected: device.connected,
        status: device.status,
        serial: device.serial,
        firmware: device.firmware,
        batteryLevel: device.batteryLevel
      })));
    }
  }, [connectedDevices]);

  // Handle lock/unlock functionality
  const handleLockDevices = () => {
    const newLockState = !lockState.isLocked;
    const deviceIds = newLockState ? connectedDevices.filter(d => d.connected).map(d => d.id) : [];
    
    const lockMessage = {
      type: 'lockDevices',
      isLocked: newLockState,
      deviceIds: deviceIds
    };
    
    wsService.sendMessage(lockMessage);
    setLockState({ isLocked: newLockState, deviceIds });
  };

  // Handle scan devices
  const handleScanDevices = () => {
    const scanMessage = { type: 'getDevices' };
    wsService.sendMessage(scanMessage);
    setLastScanTime(new Date());
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get device status display
  const getDeviceStatus = (device) => {
    if (device.status === 'available') return 'Available';
    if (device.connected) return 'Connected';
    return 'Available';
  };

  // Get status CSS class
  const getStatusClass = (device) => {
    if (device.status === 'available') return 'status-available';
    if (device.connected) return 'status-connected';
    return 'status-available';
  };

  // Use actual connected devices
  const displayDevices = connectedDevices || [];

  if (!wsConnected || connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Waiting for Cosmoid Bridge...
          </h2>
          <p className="text-gray-600 text-center text-base max-w-md">
            Cosmoweb is trying to connect to the Cosmoid Bridge on your computer.<br />
            <span className="block mt-2">Please make sure the Cosmoid Bridge application is running.<br />
            If you haven't installed it yet, <a href="https://drive.google.com/file/d/1QXPr67vYiePTso6lsO33KBVpTza1x6_6/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">download it here</a>.</span>
            <span className="block mt-2">Use a supported browser (Chrome or Edge).</span>
            <span className="block mt-2">If the bridge is running and you still see this message, try refreshing the page.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Welcome Section */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{color: '#7B1C93'}}>
              Welcome to the CosmoWeb
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Cosmoweb is a modern web interface for Filisia's Cosmo devices, enabling real-time, interactive experiences for therapy, education, and play. Connect your Cosmo devices via the Cosmoid Bridge and control them directly from your browser.
            </p>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">How it works</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{backgroundColor: '#7B1C93'}}>
                    1
                  </div>
                  <p className="text-gray-600">Start the Cosmoid Bridge app on your computer</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{backgroundColor: '#7B1C93'}}>
                    2
                  </div>
                  <p className="text-gray-600">Power on your Cosmo devices and keep them nearby</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{backgroundColor: '#7B1C93'}}>
                    3
                  </div>
                  <p className="text-gray-600">Devices will appear below when connected</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{backgroundColor: '#7B1C93'}}>
                    4
                  </div>
                  <p className="text-gray-600">Explore games and activities from the menu!</p>
                </div>
              </div>
            </div>
            
            <button className="border px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center space-x-2" style={{borderColor: '#7B1C93', color: '#7B1C93'}}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Check Documentation</span>
            </button>
          </div>

          {/* Right Column - Connected Devices Panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2" style={{color: '#7B1C93'}}>
                  Connected Cosmo Devices
                </h2>
                <p className="text-gray-600 text-sm max-w-md">
                  Here are the Cosmo devices detected by your browser. Please ensure your devices are powered on and within range.
                </p>
              </div>
              <button 
                onClick={handleLockDevices}
                className="border px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2" style={{borderColor: '#7B1C93', color: '#7B1C93'}}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Lock Devices</span>
              </button>
            </div>

            {/* Devices Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial no.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Firmware
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Battery
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayDevices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                        No devices found. Make sure your Cosmo devices are powered on and nearby.
                      </td>
                    </tr>
                  ) : (
                    displayDevices.map((device, index) => (
                      <tr key={device.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {device.serial || device.serialNumber || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {device.firmware || device.firmwareVersion || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {device.batteryLevel !== undefined ? `${device.batteryLevel}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="text-green-600 font-medium">
                            {getDeviceStatus(device) || device.status || 'Connected'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Start Playing Activity Button */}
            <div className="mt-6 text-center">
              <Link to="/exercise-settings" className="inline-block text-white px-8 py-3 rounded-md text-sm font-medium transition-colors" style={{backgroundColor: '#7B1C93'}}>
                Start Playing Activity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

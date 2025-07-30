// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wsService from './services/WebSocketService';
import { useWebSocket } from './contexts/WebSocketContext';
import cosmoLogo from './assets/images/cosmo_logo.png';
import { ReactComponent as AppleLogo } from './assets/icons/apple-logo.svg';
import { ReactComponent as WindowsLogo } from './assets/icons/windows-logo.svg';

function HomePage({ colors }) {
  const navigate = useNavigate();
  const { wsConnected, connectionError, connectedDevices } = useWebSocket();
  
  const [lockState] = useState({ isLocked: false, deviceIds: [] });
  const [activeTab, setActiveTab] = useState('Home');
  
  const handleLaunchTestActivity = () => {
    navigate('/exercise-settings');
  };

  const getDeviceStatus = (device) => {
    if (device.connected || device.status === 'connected') return 'Connected';
    return 'Disconnected';
  };

  const getStatusClass = (device) => {
    return device.connected || device.status === 'connected' ? 'text-green-600' : 'text-red-600';
  };

  const BridgeStatusWidget = () => {
    const isConnected = wsConnected && !connectionError;
    
    return (
      <div 
        className="rounded-3xl border-2 shadow-xl" 
        style={{
          backgroundColor: '#EDDDF1', 
          borderColor: '#7B1C93',
          boxShadow: '10px 10px 34px 0px rgba(0, 0, 0, 0.15)',
          padding: '24px'
        }}
      >
        {/* Top section - Icon and title */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8">
            {isConnected ? (
              // Green checkmark when connected
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#10B981"/>
                <path d="M9 16l6 6L23 10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              // Spinning loader when searching
              <svg 
                className="animate-spin" 
                width="32" 
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <defs>
                  <linearGradient id="spinner-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#C99BD5" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8D6198" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <circle 
                  cx="16" 
                  cy="16" 
                  r="13.33" 
                  stroke="url(#spinner-gradient)" 
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="75 25"
                />
              </svg>
            )}
          </div>
          <h2 
            style={{
              fontSize: '24px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              lineHeight: '1.24',
              color: '#7B1C93'
            }}
          >
            {isConnected ? 'Bridge App (Beta) Detected' : 'Searching Bridge App (Beta)'}
          </h2>
        </div>

        {/* Description text */}
        <p 
          style={{
            fontSize: '16px',
            fontFamily: 'GT Walsheim Pro, sans-serif',
            fontWeight: '400',
            lineHeight: '1.24',
            color: 'rgba(30, 30, 30, 0.7)',
            marginBottom: '32px',
            maxWidth: '400px'
          }}
        >
          {isConnected 
            ? 'Here are the Cosmo devices detected by your browser. Please ensure your devices are powered on and within range.'
            : 'Make sure the Cosmoid Bridge application is running on your computer.'}
        </p>
        
        {/* White inner frame */}
        <div 
          className="rounded-3xl" 
          style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          {/* Table headers */}
          <div 
            className="flex items-stretch" 
            style={{
              gap: '60px',
              height: '21px',
              marginBottom: '60px'
            }}
          >
            <div 
              style={{
                fontSize: '18px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.145',
                color: 'rgba(30, 30, 30, 0.7)',
                flex: '1'
              }}
            >
              Serial no.
            </div>
            <div 
              style={{
                fontSize: '18px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.145',
                color: 'rgba(30, 30, 30, 0.7)',
                flex: '1'
              }}
            >
              Firmware
            </div>
            <div 
              style={{
                fontSize: '18px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.145',
                color: 'rgba(30, 30, 30, 0.7)',
                flex: '1'
              }}
            >
              Battery
            </div>
            <div 
              style={{
                fontSize: '18px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.145',
                color: 'rgba(30, 30, 30, 0.7)',
                flex: '1'
              }}
            >
              Status
            </div>
          </div>
          
          {/* Device data */}
          {isConnected && connectedDevices.length > 0 ? (
            connectedDevices.map((device) => (
              <div key={device.id} className="flex items-stretch" style={{gap: '60px', marginBottom: '8px'}}>
                <div style={{flex: '1'}}>{device.serialNumber || device.serial || 'N/A'}</div>
                <div style={{flex: '1'}}>{device.firmwareVersion || device.firmware || 'N/A'}</div>
                <div style={{flex: '1'}}>{device.batteryLevel !== undefined ? `${device.batteryLevel}%` : 'N/A'}</div>
                <div style={{flex: '1'}}>{getDeviceStatus(device)}</div>
              </div>
            ))
          ) : isConnected ? (
            <div className="text-center" style={{marginTop: '40px', marginBottom: '40px'}}>
              <p style={{
                fontSize: '16px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '400',
                color: 'rgba(30, 30, 30, 0.7)'
              }}>
                No devices found<br/>
                Make sure Cosmo Bridge is running and devices are in range.
              </p>
            </div>
          ) : null}
          
          {/* Refresh message - only show when not connected */}
          {!isConnected && (
            <div 
              className="text-center" 
              style={{
                marginTop: '80px',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <p 
                style={{
                  fontSize: '16px',
                  fontFamily: 'GT Walsheim Pro, sans-serif',
                  fontWeight: '300',
                  lineHeight: '1.36',
                  color: '#7B1C93',
                  textAlign: 'center'
                }}
              >
                <span 
                  className="underline cursor-pointer" 
                  onClick={() => wsService.refreshConnection()}
                >
                  Refresh Page
                </span>
                {" "} If the bridge is running and you still see the same status.
                <br />
                Use a supported browser (Chrome or Edge).
              </p>
            </div>
          )}
        </div>
        
        {/* Launch Test Activity Button */}
        <div className="flex justify-center">
          <button 
            className="flex items-center justify-center gap-2 border"
            style={{
              backgroundColor: '#7B1C93',
              borderColor: '#7B1C93',
              color: '#FFFFFF',
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '400',
              lineHeight: '1em',
              textAlign: 'center',
              padding: '8px 24px',
              borderRadius: '8px',
              height: '52px',
              opacity: isConnected ? 1 : 0.5
            }}
            disabled={!isConnected}
            onClick={isConnected ? handleLaunchTestActivity : undefined}
          >
            Launch Test Activity
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M3.33 3.33L9.33 9.33L3.33 9.33" 
                stroke="#FFFFFF" 
                strokeWidth="1.6"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="px-20 py-12">
        <div className="flex gap-8">
          <div className="w-1/2">
            {/* Cosmo Beta App Button */}
            <div className="mb-6">
              <button 
                className="flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  color: 'rgba(30, 30, 30, 0.7)',
                  fontSize: '14px',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: '500',
                  letterSpacing: '0.714%',
                  lineHeight: '1.43em',
                  padding: '10px 16px',
                  borderRadius: '100px',
                  height: '40px',
                  border: 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(30, 30, 30, 0.7)" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Cosmo Beta App
              </button>
            </div>
            
            {/* Title */}
            <h1 className="mb-4" style={{
              fontSize: '36px', 
              fontFamily: 'GT Walsheim Pro, sans-serif', 
              fontWeight: '700', 
              lineHeight: '1.24'
            }}>
              <span style={{color: '#1E1E1E'}}>Welcome to the </span>
              <span style={{color: '#7B1C93'}}>CosmoWeb</span>
            </h1>
            
            <p className="mb-6 leading-relaxed" style={{
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '400',
              lineHeight: '1.24',
              color: 'rgba(30, 30, 30, 0.7)'
            }}>
              CosmoWeb is a modern web interface for Filisia's Cosmo devices, providing real-time, interactive experiences for therapy, education, and play. Connect your Cosmo devices via the Cosmoid Bridge and control them directly from your browser.
            </p>
            
      
            
            {/* Download buttons */}
            <div className="flex gap-4 mb-6">
              <button 
                className="flex items-center justify-center gap-3 border" 
                style={{
                  borderColor: '#7B1C93',
                  color: '#7B1C93',
                  backgroundColor: '#FFFFFF',
                  fontSize: '16px',
                  fontFamily: 'GT Walsheim Pro, sans-serif',
                  fontWeight: '700',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  width: '156px'
                }}
              >
                <AppleLogo style={{ width: '14px', height: '16px' }} />
                MacOS
              </button>
              <button 
                className="flex items-center justify-center gap-3 border" 
                style={{
                  borderColor: '#7B1C93',
                  color: '#7B1C93',
                  backgroundColor: '#FFFFFF',
                  fontSize: '16px',
                  fontFamily: 'GT Walsheim Pro, sans-serif',
                  fontWeight: '700',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  width: '156px'
                }}
              >
                <WindowsLogo style={{ width: '16px', height: '16px' }} />
                Windows
              </button>
            </div>
            
            {/* How it works section */}
            <div className="mb-6">
              <h3 
                className="mb-6" 
                style={{
                  fontSize: '18px',
                  fontFamily: 'GT Walsheim Pro, sans-serif',
                  fontWeight: '500',
                  color: '#1E1E1E',
                  lineHeight: '1.15'
                }}
              >
                How it works
              </h3>
              <div className="flex flex-col" style={{gap: '16px'}}>
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      backgroundColor: '#FBEAFF',
                      border: '1px solid #7B1C93',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '18px',
                      fontFamily: 'GT Walsheim Pro, sans-serif',
                      fontWeight: '500',
                      color: '#7B1C93'
                    }}
                  >
                    1
                  </div>
                  <div 
                    style={{
                      fontSize: '16px', 
                      fontFamily: 'GT Walsheim Pro, sans-serif', 
                      fontWeight: '400',
                      color: 'rgba(30, 30, 30, 0.7)',
                      lineHeight: '1.42'
                    }}
                  >
                    Download and Start Cosmo Bridge App (Beta)
                  </div>
                </div>
                
                {/* Connecting line 1 */}
                <div style={{marginLeft: '11px', width: '2px', height: '16px', backgroundColor: '#7B1C93'}} />
                
                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      backgroundColor: '#FBEAFF',
                      border: '1px solid #7B1C93',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '18px',
                      fontFamily: 'GT Walsheim Pro, sans-serif',
                      fontWeight: '500',
                      color: '#7B1C93'
                    }}
                  >
                    2
                  </div>
                  <div 
                    style={{
                      fontSize: '16px', 
                      fontFamily: 'GT Walsheim Pro, sans-serif', 
                      fontWeight: '400',
                      color: 'rgba(30, 30, 30, 0.7)',
                      lineHeight: '1.14'
                    }}
                  >
                    Power on your Cosmo devices and keep them in range
                  </div>
                </div>
                
                {/* Connecting line 2 */}
                <div style={{marginLeft: '11px', width: '2px', height: '16px', backgroundColor: '#7B1C93'}} />
                
                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      backgroundColor: '#FBEAFF',
                      border: '1px solid #7B1C93',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '18px',
                      fontFamily: 'GT Walsheim Pro, sans-serif',
                      fontWeight: '500',
                      color: '#7B1C93'
                    }}
                  >
                    3
                  </div>
                  <div 
                    style={{
                      fontSize: '16px', 
                      fontFamily: 'GT Walsheim Pro, sans-serif', 
                      fontWeight: '400',
                      color: 'rgba(30, 30, 30, 0.7)',
                      lineHeight: '1.14'
                    }}
                  >
                    Devices will appear in the widget when connected
                  </div>
                </div>
                
                {/* Connecting line 3 */}
                <div style={{marginLeft: '11px', width: '2px', height: '16px', backgroundColor: '#7B1C93'}} />
                
                {/* Step 4 */}
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      backgroundColor: '#FBEAFF',
                      border: '1px solid #7B1C93',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '18px',
                      fontFamily: 'GT Walsheim Pro, sans-serif',
                      fontWeight: '500',
                      color: '#7B1C93'
                    }}
                  >
                    4
                  </div>
                  <div 
                    style={{
                      fontSize: '16px', 
                      fontFamily: 'GT Walsheim Pro, sans-serif', 
                      fontWeight: '400',
                      color: 'rgba(30, 30, 30, 0.7)',
                      lineHeight: '1.14'
                    }}
                  >
                    Click on "Launch Test Activity " to start
                  </div>
                </div>
              </div>
            </div>
            
            {/* Check Documentation Button */}
            <button 
              className="flex items-center justify-center gap-2" 
              style={{
                border: '1px solid #7B1C93',
                color: '#7B1C93',
                fontSize: '16px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1em',
                borderRadius: '8px',
                padding: '8px 16px',
                height: '52px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="16" height="16" fill="white"/>
                <g transform="translate(2.67, 1.33)">
                  <path d="M0 0h10.67v13.33H0V0z" stroke="#7B1C93" strokeWidth="1.5" fill="none"/>
                  <circle cx="6.67" cy="0" r="2" stroke="#7B1C93" strokeWidth="1.5" fill="none"/>
                </g>
              </svg>
              Check Documentation
            </button>
          </div>
          <div className="w-1/2">
            <BridgeStatusWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
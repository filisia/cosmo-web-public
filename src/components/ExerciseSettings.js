import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../contexts/WebSocketContext';
import { BACKGROUND_TRACKS } from '../hooks/useBackgroundMusic';

export default function ExerciseSettings() {
  const navigate = useNavigate();
  const { connectedDevices } = useWebSocket();
  const numCosmos = connectedDevices.length;
  
  // Duration options: [seconds, displayText]
  const durationOptions = [
    [30, '30 s'],
    [60, '1 min'],
    [120, '2 min'],
    [-1, '...']
  ];
  
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTrackId, setSelectedTrackId] = useState('brassbeat');
  const [backgroundVolume, setBackgroundVolume] = useState(25); // 0-100

  const handlePlay = () => {
    navigate('/exercise', { 
      state: { 
        numCosmos, 
        duration: selectedDuration, 
        soundEnabled, 
        backgroundTrackId: selectedTrackId,
        backgroundVolume 
      } 
    });
  };

  const handleHelp = () => {
    alert('Help coming soon!');
  };

  const formatDuration = (seconds) => {
    if (seconds === -1) return 'Infinite';
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds === 60) return '1 minute';
    return `${Math.floor(seconds / 60)} minutes`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20" style={{ backgroundColor: '#FFFFFF' }}>
      <div 
        className="rounded-3xl shadow-xl p-9"
        style={{
          
          borderColor: '#7B1C93',
          border: '2px solid #7B1C93',
          boxShadow: '10px 10px 34px 0px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="flex items-center mb-4">
          <h1 
            className="font-bold"
            style={{
              fontSize: '24px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              lineHeight: '1.24',
              color: '#7B1C93'
            }}
          >
            Test Activity
          </h1>
        </div>
        
        <div 
          className="mb-6"
          style={{
            fontSize: '16px',
            fontFamily: 'GT Walsheim Pro, sans-serif',
            fontWeight: '400',
            lineHeight: '1.36',
            color: 'rgba(30, 30, 30, 0.7)',
            maxWidth: '682px'
          }}
        >
          Distribute the Cosmoids across the play area and swiftly press them as they illuminate to earn points before time runs out.
        </div>

        {/* Settings Grid - First Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Music Track */}
          <div>
            <div 
              className="mb-2"
              style={{
                fontSize: '16px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '600',
                lineHeight: '1.4',
                color: '#1E1E1E'
              }}
            >
              Music Track
            </div>
            <div className="relative">
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full bg-white border appearance-none cursor-pointer transition-colors"
                style={{
                  borderColor: '#D9D9D9',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontFamily: 'GT Walsheim Pro, sans-serif',
                  fontWeight: '600',
                  color: '#1E1E1E'
                }}
              >
                {BACKGROUND_TRACKS.map(track => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Duration of Activity */}
          <div>
            <div 
              className="mb-2"
              style={{
                fontSize: '16px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.4',
                color: '#1E1E1E'
              }}
            >
              Duration of Activity
            </div>
            <div className="flex gap-2">
              {durationOptions.map(([seconds, displayText]) => (
                <div
                  key={seconds}
                  onClick={() => setSelectedDuration(seconds)}
                  className="flex-1 flex items-center justify-center cursor-pointer select-none transition-all"
                  style={{
                    height: '36px',
                    borderRadius: '8px',
                    border: selectedDuration === seconds ? '1px solid #7B1C93' : '1px solid #D9D9D9',
                    backgroundColor: '#FFFFFF',
                    color: selectedDuration === seconds ? '#1E1E1E' : '#757575',
                    fontSize: '14px',
                    fontFamily: 'GT Walsheim Pro, sans-serif',
                    fontWeight: '600',
                    padding: '8px'
                  }}
                >
                  {displayText}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Grid - Second Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Number of Cosmoids */}
          <div>
            <div 
              className="mb-2"
              style={{
                fontSize: '16px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.4',
                color: '#1E1E1E'
              }}
            >
              Number of Cosmoids
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 6 }, (_, index) => {
                const i = index + 1;
                const isEnabled = index < numCosmos;
                const colors = [
                  { bg: '#E3F2FD', border: '#2196F3', text: '#2196F3' }, // blue
                  { bg: '#E8F5E8', border: '#4CAF50', text: '#4CAF50' }, // green
                  { bg: '#FFF9E1', border: '#FFC107', text: '#FFC107' }, // yellow
                  { bg: '#FFF3E0', border: '#FF9800', text: '#FF9800' }, // orange
                  { bg: '#FFEBEE', border: '#F44336', text: '#F44336' }, // red
                  { bg: '#F3E5F5', border: '#9C27B0', text: '#9C27B0' }  // purple
                ];
                
                const colorIndex = index % colors.length;
                const { bg, border, text } = colors[colorIndex];
                
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-full text-sm font-medium select-none transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: isEnabled ? bg : '#F5F5F5',
                      border: `1px solid ${isEnabled ? border : '#D9D9D9'}`,
                      color: isEnabled ? text : '#9E9E9E',
                      fontSize: '14px',
                      fontFamily: 'GT Walsheim Pro, sans-serif',
                      fontWeight: '500',
                      opacity: isEnabled ? 1 : 0.5
                    }}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sound Toggle */}
          <div>
            <div 
              className="mb-2"
              style={{
                fontSize: '16px',
                fontFamily: 'GT Walsheim Pro, sans-serif',
                fontWeight: '500',
                lineHeight: '1.4',
                color: '#1E1E1E'
              }}
            >
              Sound
            </div>
            <div 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="cursor-pointer transition-all"
              style={{
                width: '80px',
                height: '40px',
                backgroundColor: soundEnabled ? '#65027E' : '#E4E4E4',
                borderRadius: '100px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div
                className="transition-all duration-300 ease-in-out flex items-center justify-center"
                style={{
                  width: '39px',
                  height: '28px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '100px',
                  position: 'absolute',
                  left: soundEnabled ? '35px' : '6px',
                  top: '6px',
                  boxShadow: '0px 6px 13px 0px rgba(0, 0, 0, 0.12), 0px 0.5px 4px 0px rgba(0, 0, 0, 0.12)'
                }}
              >
                {soundEnabled ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M8.25 3.375L5.0625 6H2.25V12H5.0625L8.25 14.625V3.375Z" stroke="#14142B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.25 6.75C11.8973 7.39731 12.2676 8.28065 12.2676 9.1875C12.2676 10.0944 11.8973 10.9777 11.25 11.625" stroke="#14142B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.5 4.5C14.7942 5.79417 15.5208 7.54167 15.5208 9.375C15.5208 11.2083 14.7942 12.9558 13.5 14.25" stroke="#14142B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 19 18" fill="none">
                    <path d="M11.5 6.75L16.273 11.523M11.5 11.523L16.273 6.75004M1 6.75V11.25H4L7.75 14.25V3.75L4 6.75H1Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Background Volume - Constrained Width */}
        <div className="mb-8" style={{ width: '335px' }}>
          <div 
            className="mb-2"
            style={{
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '500',
              lineHeight: '1.4',
              color: '#1E1E1E'
            }}
          >
            Track volume
          </div>
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M8.25 3.375L5.0625 6H2.25V12H5.0625L8.25 14.625V3.375Z" stroke="#14142B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex-1" style={{ position: 'relative', height: '24px' }}>
              <div 
                style={{
                  position: 'absolute',
                  top: '9px',
                  left: '0',
                  right: '0',
                  height: '6px',
                  backgroundColor: 'rgba(120, 120, 120, 0.2)',
                  borderRadius: '3px'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '9px',
                  left: '0',
                  width: `${(backgroundVolume / 100) * 100}%`,
                  height: '6px',
                  backgroundColor: '#65027E',
                  borderRadius: '3px'
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={backgroundVolume}
                onChange={(e) => setBackgroundVolume(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute flex items-center justify-center"
                style={{
                  left: `calc(${(backgroundVolume / 100) * 100}% - 19px)`,
                  top: '0',
                  width: '38px',
                  height: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #65027E',
                  borderRadius: '100px',
                  boxShadow: '0px 6px 13px 0px rgba(0, 0, 0, 0.12), 0px 0.5px 4px 0px rgba(0, 0, 0, 0.12)',
                  fontSize: '12px',
                  fontFamily: 'GT Walsheim Pro, sans-serif',
                  fontWeight: '500',
                  color: '#1E1E1E'
                }}
              >
                {backgroundVolume}%
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-12">
          <button
            onClick={handleHelp}
            className="flex items-center justify-center transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #7B1C93',
              borderRadius: '8px',
              padding: '16px 24px',
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              color: '#7B1C93',
              minWidth: '156px'
            }}
          >
            Help
          </button>
          <button
            onClick={handlePlay}
            className="flex items-center justify-center transition-all"
            style={{
              backgroundColor: '#7B1C93',
              border: '1px solid #7B1C93',
              borderRadius: '8px',
              padding: '16px 24px',
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              color: '#FFFFFF',
              minWidth: '156px'
            }}
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
} 
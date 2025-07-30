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
    [30, '30s'],
    [60, '1m'],
    [120, '2m'],
    [-1, '...']
  ];
  
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTrackId, setSelectedTrackId] = useState('brassbeat');
  const [backgroundVolume, setBackgroundVolume] = useState(30); // 0-100

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
    <div className="min-h-screen flex flex-col items-center justify-center py-8" style={{ backgroundColor: '#EDDDF1' }}>
      <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-600 p-9 w-full max-w-3xl">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold tracking-wide text-purple-700">Test Activity</h1>
        </div>
        <div className="text-gray-700 text-base mb-6">
          Distribute the Cosmoids across the play area and swiftly press them as they illuminate to earn points before time runs out.
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-base text-gray-800 font-medium mb-2">Music Track</div>
            <div className="relative">
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {BACKGROUND_TRACKS.map(track => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="text-base text-gray-800 font-medium mb-2">Duration of Activity</div>
            <div className="flex gap-2">
              {durationOptions.map(([seconds, displayText]) => (
                <button
                  key={seconds}
                  onClick={() => setSelectedDuration(seconds)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-all ${
                    selectedDuration === seconds 
                      ? 'border-purple-600 bg-white text-gray-800' 
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {displayText}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-base text-gray-800 font-medium mb-2">Number of Cosmoids</div>
            <div className="flex gap-2">
              {[1,2,3,4,5,6].map(i => {
                const getCircleStyle = () => {
                  if (i <= numCosmos) {
                    if (i === 1) return 'border-blue-500 bg-blue-50 text-blue-600';
                    if (i === 2) return 'border-red-500 bg-red-50 text-red-600';
                    return 'border-gray-400 bg-white text-gray-600';
                  }
                  return 'border-gray-300 bg-white text-gray-300';
                };
                return (
                  <div
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm font-medium select-none transition-all ${getCircleStyle()}`}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-base text-gray-800 font-medium mb-2">Sound</div>
            <div 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-colors ${
                soundEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center transition-transform ${
                soundEnabled ? 'translate-x-10' : 'translate-x-0'
              }`}>
                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.773L4.146 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.146l4.237-3.773z" clipRule="evenodd" />
                  {soundEnabled && (
                    <>
                      <path d="M12.828 8.172a4 4 0 000 5.656l-.708-.708a3 3 0 000-4.24l.708-.708z" />
                      <path d="M14.243 6.757a6 6 0 000 8.486l-.707-.707a5 5 0 000-7.072l.707-.707z" />
                    </>
                  )}
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="text-base text-gray-800 font-medium mb-2">Background Volume</div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.773L4.146 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.146l4.237-3.773z" clipRule="evenodd" />
                <path d="M12.828 8.172a4 4 0 000 5.656l-.708-.708a3 3 0 000-4.24l.708-.708z" />
              </svg>
              <div className="flex-1 relative h-6">
                {/* Track background */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-gray-300 rounded-full"></div>
                {/* Filled track */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 h-1.5 bg-purple-600 rounded-full transition-all"
                  style={{ width: `${backgroundVolume}%` }}
                ></div>
                {/* Hidden range input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={backgroundVolume}
                  onChange={(e) => setBackgroundVolume(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Custom knob */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-10 h-6 bg-white border-2 border-purple-600 rounded-full shadow-lg flex items-center justify-center pointer-events-none"
                  style={{ left: `calc(${backgroundVolume}% - 20px)` }}
                >
                  <span className="text-xs font-medium text-gray-800">{backgroundVolume}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={handleHelp}
            className="bg-white border border-purple-600 text-purple-600 text-base font-bold rounded-lg px-6 py-4 transition hover:bg-purple-50 flex-1 max-w-40"
          >
            Help
          </button>
          <button
            onClick={handlePlay}
            className="bg-purple-600 hover:bg-purple-700 text-white text-base font-bold rounded-lg px-6 py-4 transition flex-1 max-w-40"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
} 
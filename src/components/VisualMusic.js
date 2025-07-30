import React, { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import useMIDISound from '../hooks/useMIDISound';
import wsService from '../services/WebSocketService';

const VisualMusic = () => {
  const { connectedDevices, deviceValues, wsConnected } = useWebSocket();
  const playNote = useMIDISound(true);

  // Cosmo-compatible color schemes (using 0-4 RGB scale)
  const cosmoColorMap = [
    { name: 'blue', rgb: [0, 0, 4], hex: '#0000FF' },
    { name: 'green', rgb: [0, 4, 0], hex: '#00FF00' },
    { name: 'yellow', rgb: [4, 3, 0], hex: '#FFCC00' },
    { name: 'orange', rgb: [4, 1, 0], hex: '#FF4400' },
    { name: 'red', rgb: [4, 0, 0], hex: '#FF0000' },
    { name: 'purple', rgb: [4, 0, 4], hex: '#FF00FF' },
  ];

  // Color schemes for accessibility using Cosmo-compatible colors
  const colorSchemes = {
    classic: {
      colors: cosmoColorMap.map(c => c.hex),
      names: cosmoColorMap.map(c => c.name),
      cosmoRgb: cosmoColorMap.map(c => c.rgb)
    },
    highContrast: {
      colors: ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
      names: ['White', 'Black', 'Red', 'Green', 'Blue', 'Yellow'],
      cosmoRgb: [[4, 4, 4], [0, 0, 0], [4, 0, 0], [0, 4, 0], [0, 0, 4], [4, 4, 0]]
    },
    pastel: {
      colors: ['#CCE5FF', '#CCFFCC', '#FFCCCC', '#FFCCFF', '#FFDDCC', '#FFFFCC'],
      names: ['Light Blue', 'Light Green', 'Light Red', 'Light Purple', 'Light Orange', 'Light Yellow'],
      cosmoRgb: [[1, 1, 4], [1, 4, 1], [4, 1, 1], [4, 1, 4], [4, 2, 1], [4, 4, 1]]
    }
  };

  const [currentScheme, setCurrentScheme] = useState('classic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(120); // BPM
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [customPattern, setCustomPattern] = useState([]);
  const [recordingMode, setRecordingMode] = useState(false);

  // Calculate available notes based on connected devices
  const activeScheme = colorSchemes[currentScheme];
  const maxNotes = Math.min(connectedDevices.length, 6); // Limit to connected devices or 6 max
  const availableColors = activeScheme.colors.slice(0, maxNotes);
  const availableNames = activeScheme.names.slice(0, maxNotes);
  const availableCosmoRgb = activeScheme.cosmoRgb.slice(0, maxNotes);

  // Pre-defined musical patterns (adjust to available devices)
  const patterns = useMemo(() => {
    const adjustPattern = (sequence) => sequence.map(note => note % Math.max(maxNotes, 1));
    
    return [
      {
        name: "Simple Scale",
        sequence: adjustPattern([0, 1, 2, 3, 4, 5, 0].slice(0, maxNotes + 1)),
        colors: adjustPattern([0, 1, 2, 3, 4, 5, 0].slice(0, maxNotes + 1))
      },
      {
        name: "Twinkle Twinkle",
        sequence: adjustPattern([0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0]),
        colors: adjustPattern([0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0])
      },
      {
        name: "Mary Had a Little Lamb",
        sequence: adjustPattern([2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4]),
        colors: adjustPattern([2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4])
      },
      {
        name: "Happy Birthday",
        sequence: adjustPattern([0, 0, 1, 0, 3, 2, 0, 0, 1, 0, 4, 3]),
        colors: adjustPattern([0, 0, 1, 0, 3, 2, 0, 0, 1, 0, 4, 3])
      }
    ];
  }, [maxNotes]);

  const currentPattern = patterns[selectedPattern];

  // Handle device button presses
  useEffect(() => {
    if (!connectedDevices.length) return;

    connectedDevices.forEach((device, deviceIndex) => {
      const deviceState = deviceValues[device.id];
      if (deviceState?.buttonState === 1) {
        const noteIndex = deviceIndex % maxNotes; // Map to available notes
        const colorIndex = noteIndex % availableColors.length;
        
        // Play the note
        playNote(noteIndex, 100, 0.3);
        
        // Set device LED to corresponding color using Cosmo RGB values
        const cosmoRgb = availableCosmoRgb[colorIndex];
        if (cosmoRgb) {
          wsService.setColor(device.id, cosmoRgb[0], cosmoRgb[1], cosmoRgb[2]);
        }

        // If in recording mode, add to custom pattern
        if (recordingMode) {
          setCustomPattern(prev => [...prev, noteIndex]);
        }
      }
    });
  }, [deviceValues, connectedDevices, playNote, activeScheme, recordingMode]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = (60 / tempo) * 1000; // Convert BPM to milliseconds
    const timer = setInterval(() => {
      const pattern = selectedPattern === patterns.length ? customPattern : currentPattern;
      if (!pattern || (selectedPattern !== patterns.length && !pattern.sequence)) return;

      const sequence = selectedPattern === patterns.length ? pattern : pattern.sequence;
      const colors = selectedPattern === patterns.length ? pattern : pattern.colors;

      if (currentNoteIndex < sequence.length) {
        const noteIndex = sequence[currentNoteIndex];
        const colorIndex = colors[currentNoteIndex];
        
        // Play the note
        playNote(noteIndex, 100, 0.3);
        
        // Light up corresponding device if available
        if (connectedDevices[colorIndex] && colorIndex < maxNotes) {
          const cosmoRgb = availableCosmoRgb[colorIndex % availableCosmoRgb.length];
          if (cosmoRgb) {
            wsService.setColor(connectedDevices[colorIndex].id, cosmoRgb[0], cosmoRgb[1], cosmoRgb[2]);
          }
        }

        setCurrentNoteIndex(prev => prev + 1);
      } else {
        // Pattern finished, restart or stop
        setCurrentNoteIndex(0);
        setIsPlaying(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentNoteIndex, tempo, selectedPattern, currentPattern, customPattern, connectedDevices, playNote, activeScheme, patterns.length]);

  // Control functions
  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentNoteIndex(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
  };

  const handlePatternChange = (index) => {
    setSelectedPattern(index);
    setCurrentNoteIndex(0);
    setIsPlaying(false);
  };

  const handleRecordingToggle = () => {
    setRecordingMode(!recordingMode);
    if (!recordingMode) {
      setCustomPattern([]);
    }
  };

  const clearCustomPattern = () => {
    setCustomPattern([]);
  };

  // Pattern display component (like image 1)
  const PatternDisplay = ({ pattern, currentIndex }) => {
    const sequence = selectedPattern === patterns.length ? pattern : pattern?.sequence || [];
    const colors = selectedPattern === patterns.length ? pattern : pattern?.colors || [];

    return (
      <div className="mb-6 p-4 bg-black rounded-lg">
        <div className="flex flex-wrap gap-1 mb-2">
          {sequence.map((noteIndex, index) => (
            <div
              key={index}
              className={`h-12 w-16 rounded ${
                index === currentIndex ? 'ring-4 ring-white' : ''
              }`}
              style={{
                backgroundColor: availableColors[colors[index] % availableColors.length]
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Current note display (like image 2)
  const CurrentNoteDisplay = () => {
    return (
      <div className="mb-6 p-4 bg-black rounded-lg">
        <div className="flex justify-center space-x-4">
          {availableColors.map((color, index) => (
            <div
              key={index}
              className="relative w-20 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {connectedDevices[index] && deviceValues[connectedDevices[index].id]?.buttonState === 1 && (
                <div className="w-8 h-8 bg-white rounded-full" />
              )}
              <div className="absolute bottom-2 text-xs text-black font-bold">
                {availableNames[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Visual Music</h1>
        <p className="text-gray-600">
          Press Cosmo device buttons to play notes or use auto-play to learn patterns
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span className="text-sm text-gray-600">
            • {connectedDevices.length} device(s) connected • {maxNotes} notes available
          </span>
          {maxNotes < connectedDevices.length && (
            <span className="text-xs text-orange-600">
              (Limited to {maxNotes} notes max)
            </span>
          )}
        </div>
      </div>

      {/* Current Note Display */}
      {connectedDevices.length === 0 ? (
        <div className="mb-6 p-8 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Devices Connected</h3>
          <p className="text-gray-600">
            Connect Cosmo devices to start making music! Each device will represent a different note.
          </p>
        </div>
      ) : (
        <CurrentNoteDisplay />
      )}

      {/* Pattern Display */}
      <PatternDisplay 
        pattern={selectedPattern === patterns.length ? customPattern : currentPattern} 
        currentIndex={currentNoteIndex}
      />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Playback Controls */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Playback</h3>
          <div className="flex space-x-2 mb-3">
            <button
              onClick={handlePlay}
              disabled={!wsConnected || isPlaying || connectedDevices.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Play
            </button>
            <button
              onClick={handleStop}
              disabled={!wsConnected || connectedDevices.length === 0}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Stop
            </button>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo: {tempo} BPM
            </label>
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Pattern Selection */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Pattern</h3>
          <select
            value={selectedPattern}
            onChange={(e) => handlePatternChange(parseInt(e.target.value))}
            className="w-full p-2 border rounded mb-3"
          >
            {patterns.map((pattern, index) => (
              <option key={index} value={index}>
                {pattern.name}
              </option>
            ))}
            <option value={patterns.length}>Custom Pattern</option>
          </select>
          
          {/* Recording Controls */}
          <div className="flex space-x-2 mb-3">
            <button
              onClick={handleRecordingToggle}
              disabled={connectedDevices.length === 0}
              className={`px-4 py-2 rounded disabled:opacity-50 ${
                recordingMode 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {recordingMode ? 'Stop Recording' : 'Record Pattern'}
            </button>
            <button
              onClick={clearCustomPattern}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          
          {recordingMode && (
            <p className="text-sm text-red-600">
              Recording... Press device buttons to create a pattern
            </p>
          )}
        </div>
      </div>

      {/* Accessibility Controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Accessibility</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Scheme
          </label>
          <select
            value={currentScheme}
            onChange={(e) => setCurrentScheme(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="classic">Classic</option>
            <option value="highContrast">High Contrast</option>
            <option value="pastel">Pastel</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          <p>• Press device buttons to play notes and create patterns</p>
          <p>• Use auto-play to learn musical sequences</p>
          <p>• Customize colors for better visibility</p>
          <p>• Record your own patterns by pressing buttons</p>
        </div>
      </div>
    </div>
  );
};

export default VisualMusic;
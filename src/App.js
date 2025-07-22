import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './style.css';
// import GamePress from './GamePress';
import HomePage from './HomePage';
// import GrowShrinkGame from './GrowShrinkGame';
// import LEDModePage from './LEDModePage';
// import WhacAMole from './components/WhacAMole';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import ExerciseSettings from './components/ExerciseSettings';
import ExerciseGame from './components/ExerciseGame';
import VisualMusic from './components/VisualMusic';
import cosmoLogo from './assets/images/cosmo_logo.png';

function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={cosmoLogo} alt="Cosmo Logo" style={{ width: 80, objectFit: 'contain' }} />
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-white' 
                  : 'border'
              }`}
              style={isActive('/') 
                ? {backgroundColor: '#7B1C93'} 
                : {borderColor: '#7B1C93', color: '#7B1C93'}
              }
            >
              Home
            </Link>
            <Link 
              to="/exercise-settings" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/exercise') 
                  ? 'text-white' 
                  : 'border'
              }`}
              style={isActive('/exercise') 
                ? {backgroundColor: '#7B1C93'} 
                : {borderColor: '#7B1C93', color: '#7B1C93'}
              }
            >
              Exercise
            </Link>
            <Link 
              to="/visual-music" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/visual-music') 
                  ? 'text-white' 
                  : 'border'
              }`}
              style={isActive('/visual-music') 
                ? {backgroundColor: '#7B1C93'} 
                : {borderColor: '#7B1C93', color: '#7B1C93'}
              }
            >
              Visual Music
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  // Define colors array for the HomePage circles
  const colors = ['blue', 'green', 'yellow', 'orange', 'red', 'purple'];

  return (
    <GameSettingsProvider>
      <WebSocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
              <Routes>
                <Route 
                  path="/" 
                  element={<HomePage colors={colors} />} 
                />
                <Route 
                  path="/exercise-settings" 
                  element={<ExerciseSettings />} 
                />
                <Route 
                  path="/exercise" 
                  element={<ExerciseGame />} 
                />
                <Route 
                  path="/visual-music" 
                  element={<VisualMusic />} 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </WebSocketProvider>
    </GameSettingsProvider>
  );
}

export default App;

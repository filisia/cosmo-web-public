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

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <header className="bg-white border-b border-gray-200" style={{ padding: '24px 80px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={cosmoLogo} 
            alt="Cosmo Logo" 
            style={{ 
              width: '164px', 
              height: '32px', 
              objectFit: 'contain' 
            }} 
          />
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className={`hidden lg:flex px-6 py-4 rounded-lg border ${
              isActive('/')
                ? 'text-white border-purple-700'
                : 'text-purple-700 border-purple-700 hover:bg-purple-50'
            }`}
            style={{
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              ...(isActive('/') ? {backgroundColor: '#7B1C93'} : {}),
              borderColor: '#7B1C93'
            }}
          >
            Home
          </Link>
          <Link 
            to="/exercise-settings" 
            className={`hidden lg:flex px-6 py-4 rounded-lg border ${
              isActive('/exercise')
                ? 'text-white border-purple-700'
                : 'text-purple-700 border-purple-700 hover:bg-purple-50'
            }`}
            style={{
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              ...(isActive('/exercise') ? {backgroundColor: '#7B1C93'} : {}),
              borderColor: '#7B1C93'
            }}
          >
            Test Activity
          </Link>
          <a 
            href="/documentation.html" 
            className="hidden lg:flex px-6 py-4 rounded-lg border text-purple-700 border-purple-700 hover:bg-purple-50"
            style={{
              fontSize: '16px',
              fontFamily: 'GT Walsheim Pro, sans-serif',
              fontWeight: '700',
              borderColor: '#7B1C93',
              textDecoration: 'none'
            }}
          >
            Documentation
          </a>
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
          <div className="min-h-screen bg-white">
            <Navigation />

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

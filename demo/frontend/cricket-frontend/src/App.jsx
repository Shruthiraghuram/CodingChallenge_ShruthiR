import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Players from './pages/Players';
import AddPlayer from './pages/AddPlayer';
import EditPlayer from './pages/EditPlayer';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />
            <Route path="/add-player" element={<AddPlayer />} />
            <Route path="/edit-player/:id" element={<EditPlayer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer py-3 text-center">
          © {new Date().getFullYear()} CricketManager. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;

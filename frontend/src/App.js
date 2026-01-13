import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Extract from './pages/Extract';
import Banks from './pages/Banks';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/extract" element={<Extract />} />
            <Route path="/banks" element={<Banks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

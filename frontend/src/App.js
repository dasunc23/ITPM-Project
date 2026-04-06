import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Nethmi's pages
import Home from './Pages/Home';
import AdminDashboard from './Pages/AdminDashboard';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

// Your pages
import CreateRoom from './Pages/CreateRoom';
import JoinRoom from './Pages/JoinRoom';
import Lobby from './Pages/Lobby';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/lobby/:roomCode" element={<Lobby />} />
        
      </Routes>
    </Router>
  );
}

export default App;
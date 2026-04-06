import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import CreateRoom from './Pages/CreateRoom';
import JoinRoom from './Pages/JoinRoom';
import Lobby from './Pages/Lobby';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/lobby/:roomCode" element={<Lobby />} />
        
      </Routes>
    </Router>
  );
}

export default App;
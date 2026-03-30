import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateRoom from './Pages/CreateRoom';
import JoinRoom from './Pages/JoinRoom';
import Lobby from './Pages/Lobby';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/lobby/:roomCode" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
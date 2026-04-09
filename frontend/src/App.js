import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Nethmi's pages 
import Home from './Pages/Home'; 
import AdminDashboard from './Pages/AdminDashboard'; 
import Login from './Pages/Login'; 
import Signup from './Pages/Signup';
import AnalyticsDashboard from "./Pages/AnalyticsDashboard";
import PaymentPage from "./Pages/PaymentPage";

// Dasun's pages 
import CreateRoom from './Pages/CreateRoom';
import JoinRoom from './Pages/JoinRoom'; 
import Lobby from './Pages/Lobby';

// Student game pages 
import GamePage from './Pages/GamePage'; 
import HomePage from './Pages/HomePage'; 
import ModulePage from './Pages/ModulePage'; 
import PlayGamePage from './Pages/PlayGamePage'; 
import SemesterPage from './Pages/SemesterPage';

function GameHome() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-4xl text-white mb-4">Game Home</h1>
      <Link
        to="/student-games"
        className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black hover:bg-green-400"
      >
        Go to Student Games
      </Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/dashboard" element={<AnalyticsDashboard />} />

      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/lobby/:roomCode" element={<Lobby />} />

      <Route path="/gamehome" element={<GameHome />} />

      <Route path="/student-games" element={<HomePage />} />
      <Route path="/student-games/year/:year" element={<SemesterPage />} />
      <Route path="/student-games/year/:year/semester/:sem" element={<ModulePage />} />
      <Route path="/student-games/module/:id" element={<GamePage />} />
      <Route path="/student-games/play/:type" element={<PlayGamePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
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
    <div className="relative min-h-screen bg-[#040b1d] text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#a855f7]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-8 w-60 h-60 bg-[#ec4899]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-[#0f172a]/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center p-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
        <div className="text-6xl mb-6 text-[#a855f7]">🎮</div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Game Home</h1>
        <p className="text-gray-300 mb-8 max-w-md text-center">
          Step into the arena. Test your skills across multiple interactive modules and challenges.
        </p>
        <Link
          to="/student-games"
          className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#a855f7]/30 hover:shadow-[#a855f7]/70 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Enter the Game Hub
        </Link>
        <Link to="/" className="mt-6 text-sm text-gray-400 hover:text-white transition-colors">
          &larr; Back to Main Website
        </Link>
      </div>
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
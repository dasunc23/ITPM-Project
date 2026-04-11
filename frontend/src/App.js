import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Pages
import Home from './Pages/Home';
import AdminDashboard from './Pages/AdminDashboard';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import GamePage from './Pages/GamePage';
import HomePage from './Pages/HomePage';
import ModulePage from './Pages/ModulePage';
import PlayGamePage from './Pages/PlayGamePage';
import SemesterPage from './Pages/SemesterPage';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminRooms from './Pages/AdminRooms';
import AdminGamesCategory from './Pages/AdminGamesCategory';
import AdminAchievements from './Pages/AdminAchievements';
import AnalyticsDashboard from './Pages/AnalyticsDashboard';
import PaymentPage from './Pages/PaymentPage';
import CreateRoom from './Pages/CreateRoom';
import JoinRoom from './Pages/JoinRoom'; 
import Lobby from './Pages/Lobby';
import Leaderboard from "./Pages/Leaderboard";
import Achievements from "./Pages/Achievements";
import Notifications from "./Pages/Notifications";

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
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/gamehome" element={<GameHome />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Game Room Routes */}
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/lobby/:roomCode" element={<Lobby />} />

      {/* Protected Routes - General */}
      <Route path="/dashboard" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

      {/* Protected Routes - Admin */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/rooms" element={<ProtectedRoute requireAdmin={true}><AdminRooms /></ProtectedRoute>} />
      <Route path="/admin/games-category" element={<ProtectedRoute requireAdmin={true}><AdminGamesCategory /></ProtectedRoute>} />
      <Route path="/admin/achievements" element={<ProtectedRoute requireAdmin={true}><AdminAchievements /></ProtectedRoute>} />

      {/* Protected Routes - Student Games */}
      <Route path="/student-games" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/student-games/year/:year" element={<ProtectedRoute><SemesterPage /></ProtectedRoute>} />
      <Route path="/student-games/year/:year/semester/:sem" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
      <Route path="/student-games/module/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="/student-games/play/:type" element={<ProtectedRoute><PlayGamePage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
import React from "react";
<<<<<<< Updated upstream

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-white mb-2">
          ITPM PROJECT
        </h1>
        <p className="text-lg text-center text-gray-400">
          itpm
        </p>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-green-400">
          Tailwind is Working 🚀
        </h1>
      </div>

    </div>
=======
import ProtectedRoute from './Components/ProtectedRoute';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminRooms from "./Pages/AdminRooms";
import AdminGamesCategory from "./Pages/AdminGamesCategory";
import AdminAchievements from "./Pages/AdminAchievements";
import AnalyticsDashboard from "./Pages/AnalyticsDashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import PaymentPage from "./Pages/PaymentPage";
import Leaderboard from "./Pages/Leaderboard";
import Achievements from "./Pages/Achievements";
import Notifications from "./Pages/Notifications";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/rooms" element={<ProtectedRoute requireAdmin={true}><AdminRooms /></ProtectedRoute>} />
      <Route path="/admin/games-category" element={<ProtectedRoute requireAdmin={true}><AdminGamesCategory /></ProtectedRoute>} />
      <Route path="/admin/achievements" element={<ProtectedRoute requireAdmin={true}><AdminAchievements /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/student-games" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/student-games/year/:year" element={<ProtectedRoute><SemesterPage /></ProtectedRoute>} />
      <Route path="/student-games/year/:year/semester/:sem" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
      <Route path="/student-games/module/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="/student-games/play/:type" element={<ProtectedRoute><PlayGamePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
>>>>>>> Stashed changes
  );
}

export default App;
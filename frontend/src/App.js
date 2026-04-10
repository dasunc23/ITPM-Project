import GamePage from './Pages/GamePage';
import HomePage from './Pages/HomePage';
import ModulePage from './Pages/ModulePage';
import PlayGamePage from './Pages/PlayGamePage';
import SemesterPage from './Pages/SemesterPage';
import React from "react";
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
      <Route path="/student-games" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/student-games/year/:year" element={<ProtectedRoute><SemesterPage /></ProtectedRoute>} />
      <Route path="/student-games/year/:year/semester/:sem" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
      <Route path="/student-games/module/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="/student-games/play/:type" element={<ProtectedRoute><PlayGamePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

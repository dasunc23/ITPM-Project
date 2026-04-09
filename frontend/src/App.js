import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import PlayGamePage from './pages/PlayGamePage';
import SemesterPage from './pages/SemesterPage';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import AdminDashboard from "./Pages/AdminDashboard";
import AnalyticsDashboard from "./Pages/AnalyticsDashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import PaymentPage from "./Pages/PaymentPage";

function RootHome() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<AnalyticsDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/student-games" element={<HomePage />} />
        <Route path="/student-games/year/:year" element={<SemesterPage />} />
        <Route path="/student-games/year/:year/semester/:sem" element={<ModulePage />} />
        <Route path="/student-games/module/:id" element={<GamePage />} />
        <Route path="/student-games/play/:type" element={<PlayGamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

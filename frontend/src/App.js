import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import PlayGamePage from './pages/PlayGamePage';
import SemesterPage from './pages/SemesterPage';

function RootHome() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-white mb-2">
          ITPM PROJECT
        </h1>
        <p className="text-lg text-center text-gray-400">
          itpm
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <Link
          to="/student-games"
          className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
        >
          Open Student Games
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootHome />} />
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

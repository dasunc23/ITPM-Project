import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';

const GAME_OPTIONS = ["Quiz Battle", "Typing Speed", "Coding Arena", "Memory Match"];

function AdminLeaderboard() {
  const [leaderboardRows, setLeaderboardRows] = useState([]);
  const [game, setGame] = useState("Quiz Battle");
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPoints, setEditPoints] = useState(0);
  const [editWins, setEditWins] = useState(0);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/leaderboard");
      setLeaderboardRows(res.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leaderboardRows
      .filter((r) => r.game === game)
      .filter((r) => (q ? r.username.toLowerCase().includes(q) : true))
      .sort((a, b) => a.rank - b.rank);
  }, [game, search, leaderboardRows]);

  const handleResetAll = async () => {
    if (!window.confirm("WARNING: This will permanently reset all points and wins for ALL users across ALL games. Are you absolutely sure?")) {
      return;
    }
    
    try {
      await axios.post("http://localhost:5000/api/users/leaderboard/reset");
      alert("All leaderboards have been reset.");
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
      alert("Failed to reset leaderboards.");
    }
  };

  const openEditModal = (player) => {
    setSelectedUser(player);
    setEditPoints(player.points);
    setEditWins(player.wins);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser.userId}/gameStats`, {
        game: selectedUser.game,
        points: editPoints,
        wins: editWins
      });
      setIsModalOpen(false);
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
      alert("Failed to update user stats.");
    }
  };

  const handleResetIndividual = async (player) => {
    if (!window.confirm(`Are you sure you want to reset stats for ${player.username} in ${player.game}?`)) {
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/users/${player.userId}/gameStats`, {
        game: player.game,
        points: 0,
        wins: 0
      });
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
      alert("Failed to reset user stats.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Leaderboard Management</h1>
            <p className="text-gray-500 mt-1">Manage and view the global leaderboard.</p>
          </div>
          <button
            onClick={handleResetAll}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors"
          >
            Reset All Users
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Game Category</label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {GAME_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Username</label>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="px-6 py-4 font-semibold border-b">Rank</th>
                  <th className="px-6 py-4 font-semibold border-b">Username</th>
                  <th className="px-6 py-4 font-semibold border-b">Wins</th>
                  <th className="px-6 py-4 font-semibold border-b">Points</th>
                  <th className="px-6 py-4 font-semibold border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No players found for this category.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((player) => (
                    <tr key={player.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                          #{player.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{player.username}</td>
                      <td className="px-6 py-4 text-gray-600">{player.wins}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{player.points}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => openEditModal(player)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleResetIndividual(player)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Edit Player Stats</h3>
            <p className="text-sm text-gray-500 mb-6">
              Modifying stats for <span className="font-semibold text-gray-800">{selectedUser.username}</span> in {selectedUser.game}.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                  type="number"
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wins</label>
                <input
                  type="number"
                  value={editWins}
                  onChange={(e) => setEditWins(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLeaderboard;

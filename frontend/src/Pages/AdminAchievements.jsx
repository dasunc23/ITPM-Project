import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';

const GAME_OPTIONS = ["Quiz Battle", "Typing Speed", "Coding Arena", "Memory Match"];
const BADGE_OPTIONS = ["🥇", "🥈", "🥉", "🏆", "🌟", "🔥", "💎"];

function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGame, setSelectedGame] = useState(GAME_OPTIONS[0]);
  const [selectedBadge, setSelectedBadge] = useState(BADGE_OPTIONS[0]);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [achievementsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/achievements"),
        axios.get("http://localhost:5000/api/users")
      ]);
      setAchievements(achievementsRes.data);
      setUsers(usersRes.data);
      if (usersRes.data.length > 0 && !selectedUser) {
        setSelectedUser(usersRes.data[0].name || usersRes.data[0].email);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAward = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedUser) return;
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/achievements", {
        title: title.trim(),
        game: selectedGame,
        badge: selectedBadge,
        earnedBy: selectedUser
      });
      setTitle("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to award achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this achievement?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/achievements/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to revoke achievement.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Achievements Management</h1>
        <p className="text-gray-500 mt-1 mb-8">Award and revoke player achievements.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Award Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Award Achievement</h2>
              <form onSubmit={handleAward} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Player</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    {users.map(u => (
                      <option key={u._id} value={u.name || u.email}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game</label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {GAME_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <select
                    value={selectedBadge}
                    onChange={(e) => setSelectedBadge(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-xl"
                  >
                    {BADGE_OPTIONS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Flawless Victory"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? "Awarding..." : "Award Achievement"}
                </button>
              </form>
            </div>
          </div>

          {/* Achievements Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Awarded History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-gray-500 text-sm border-b">
                      <th className="px-6 py-4 font-semibold">Badge</th>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Player</th>
                      <th className="px-6 py-4 font-semibold">Game</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No achievements have been awarded yet.
                        </td>
                      </tr>
                    ) : (
                      achievements.map((a) => (
                        <tr key={a._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-3xl">{a.badge}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{a.title}</td>
                          <td className="px-6 py-4 font-medium text-blue-600">{a.earnedBy}</td>
                          <td className="px-6 py-4 text-gray-600">
                            <span className="bg-gray-200 px-2.5 py-1 rounded-md text-xs">{a.game}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRevoke(a._id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAchievements;

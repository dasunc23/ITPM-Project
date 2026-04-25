import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Use relative path to leverage the proxy in package.json
      const res = await axios.get("/api/rooms/admin/all");
      console.log("[AdminRooms] Fetched rooms:", res.data.rooms);
      setRooms(res.data.rooms);
    } catch (error) {
      console.error("[AdminRooms] Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomCode) => {
    if (window.confirm(`Are you sure you want to delete room ${roomCode}?`)) {
      try {
        await axios.delete(`/api/rooms/admin/${roomCode}`);
        fetchRooms();
      } catch (error) {
        console.error("[AdminRooms] Error deleting room:", error);
      }
    }
  };

  const activeRooms = rooms.filter(r => r.status === 'waiting' || r.status === 'in-progress');
  const finishedRooms = rooms.filter(r => r.status === 'finished');

  const filteredActive = activeRooms.filter(r => 
    r.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.gameType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = finishedRooms.filter(r => 
    r.roomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.gameType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Game Rooms Management</h1>
            <p className="text-gray-600">Monitor active matches and view historical room data</p>
          </div>
          <button 
            onClick={fetchRooms}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Active Rooms</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{activeRooms.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase">History (30d)</h3>
            <p className="text-2xl font-bold text-green-600 mt-1">{finishedRooms.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Rooms</h3>
            <p className="text-2xl font-bold text-purple-600 mt-1">{rooms.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by room code or game type..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Rooms Table */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Live & Waiting Rooms</h2>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">Live</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Players</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started At</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredActive.map(room => (
                      <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">{room.roomCode}</td>
                        <td className="px-6 py-4 capitalize">{room.gameType}</td>
                        <td className="px-6 py-4">{room.players.length}/{room.maxPlayers}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            room.status === 'in-progress' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(room.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteRoom(room.roomCode)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                          >
                            Force Close
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredActive.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No active rooms found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Room History Table */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Rooms History</h2>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">History</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Players</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finished At</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistory.map(room => (
                      <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-600">{room.roomCode}</td>
                        <td className="px-6 py-4 capitalize">{room.gameType}</td>
                        <td className="px-6 py-4">{room.players.length} Players</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(room.updatedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteRoom(room.roomCode)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete from history"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No room history available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRooms;

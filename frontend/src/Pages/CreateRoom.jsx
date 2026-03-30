import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRoom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    gameType: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [createdRoom, setCreatedRoom] = useState(null);

  // ─── Validation ───────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    } else if (formData.username.trim().length > 20) {
      newErrors.username = 'Username must be under 20 characters';
    }

    if (!formData.gameType) {
      newErrors.gameType = 'Please select a game type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Handle Input Change ───────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ─── Handle Submit ─────────────────────────────
  const handleCreate = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Temporary hardcoded userId — replace with auth user later
      const userId = '507f1f77bcf86cd799439011';

      const res = await axios.post('/api/rooms/create', {
        userId,
        username: formData.username.trim(),
        gameType: formData.gameType
      });

      setRoomCode(res.data.roomCode);
      setCreatedRoom(res.data.room);

    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Failed to create room' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Go to Lobby ───────────────────────────────
  const goToLobby = () => {
    navigate(`/lobby/${roomCode}`, {
      state: {
        userId: '507f1f77bcf86cd799439011',
        username: formData.username.trim(),
        isHost: true,
        room: createdRoom
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 Create Room</h1>
          <p className="text-slate-400">Set up your game room and invite friends</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">

          {/* Room Code Display — shown after creation */}
          {roomCode && (
            <div className="bg-indigo-900 border border-indigo-500 rounded-xl p-5 mb-6 text-center">
              <p className="text-indigo-300 text-sm mb-1">Your Room Code</p>
              <p className="text-4xl font-bold text-white tracking-widest">{roomCode}</p>
              <p className="text-indigo-300 text-xs mt-2">Share this code with your friends!</p>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-900 border border-red-500 text-red-300 rounded-xl p-3 mb-4 text-sm text-center">
              {errors.general}
            </div>
          )}

          {/* Username Input */}
          <div className="mb-5">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Your Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={!!roomCode}
              className={`w-full bg-slate-700 text-white rounded-xl px-4 py-3 border outline-none transition
                ${errors.username
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-slate-600 focus:border-indigo-500'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Game Type Select */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Game Type
            </label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              disabled={!!roomCode}
              className={`w-full bg-slate-700 text-white rounded-xl px-4 py-3 border outline-none transition
                ${errors.gameType
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-slate-600 focus:border-indigo-500'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">Select a game type</option>
              <option value="quiz">🧠 Quiz Battle</option>
              <option value="typing">⌨️ Typing Speed Battle</option>
              <option value="memory">🃏 Memory Match</option>
              <option value="coding">💻 Coding Challenge</option>
            </select>
            {errors.gameType && (
              <p className="text-red-400 text-xs mt-1">{errors.gameType}</p>
            )}
          </div>

          {/* Buttons */}
          {!roomCode ? (
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Creating...' : 'Create Room 🚀'}
            </button>
          ) : (
            <button
              onClick={goToLobby}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
            >
              Go to Lobby →
            </button>
          )}

          {/* Join Room Link */}
          <p className="text-center text-slate-400 text-sm mt-4">
            Want to join instead?{' '}
            <span
              onClick={() => navigate('/join')}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline"
            >
              Join a Room
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
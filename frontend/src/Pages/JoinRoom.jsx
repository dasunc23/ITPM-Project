import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinRoom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    roomCode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.roomCode.trim()) {
      newErrors.roomCode = 'Room code is required';
    } else if (formData.roomCode.trim().length !== 6) {
      newErrors.roomCode = 'Room code must be exactly 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Handle Input Change ───────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomCode' ? value.toUpperCase() : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ─── Handle Join ───────────────────────────────
  const handleJoin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Temporary hardcoded userId — replace with auth user later
      const userId = '507f1f77bcf86cd799439022';

      const res = await axios.post(`/api/rooms/join/${formData.roomCode.trim()}`, {
        userId,
        username: formData.username.trim()
      });

      navigate(`/lobby/${formData.roomCode.trim()}`, {
        state: {
          userId,
          username: formData.username.trim(),
          isHost: false,
          room: res.data.room
        }
      });

    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Failed to join room' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 Join Room</h1>
          <p className="text-slate-400">Enter the room code to join your friends</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">

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
              className={`w-full bg-slate-700 text-white rounded-xl px-4 py-3 border outline-none transition
                ${errors.username
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-slate-600 focus:border-indigo-500'}`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Room Code Input */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Room Code
            </label>
            <input
              type="text"
              name="roomCode"
              value={formData.roomCode}
              onChange={handleChange}
              placeholder="e.g. AB12CD"
              maxLength={6}
              className={`w-full bg-slate-700 text-white rounded-xl px-4 py-3 border outline-none transition tracking-widest text-center text-xl font-bold uppercase
                ${errors.roomCode
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-slate-600 focus:border-indigo-500'}`}
            />
            {errors.roomCode && (
              <p className="text-red-400 text-xs mt-1">{errors.roomCode}</p>
            )}
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? 'Joining...' : 'Join Room 🚀'}
          </button>

          {/* Create Room Link */}
          <p className="text-center text-slate-400 text-sm mt-4">
            Want to create a room?{' '}
            <span
              onClick={() => navigate('/create')}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline"
            >
              Create a Room
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
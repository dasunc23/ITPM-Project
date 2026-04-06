import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState([]);

  // Generate random particle positions on mount
  useEffect(() => {
    const positions = Array.from({ length: 12 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }));
    setParticlePositions(positions);
  }, []);

  // Track mouse movement for interactive particles
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-[#040b1d] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#10b981]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-8 w-60 h-60 bg-[#00a76f]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-[#0f172a]/40 rounded-full blur-3xl" />

        {/* Floating Particles */}
        {particlePositions.map((pos, index) => {
          const sizes = [12, 8, 16, 10, 14, 9, 6, 20, 4, 18, 11, 13];
          const opacities = [0.7, 0.6, 0.8, 0.5, 0.75, 0.65, 0.4, 0.55, 0.3, 0.45, 0.85, 0.5];
          const speeds = [0.02, 0.015, 0.025, 0.01, 0.03, 0.02, 0.005, 0.035, 0.003, 0.04, 0.018, 0.022];
          const delays = ['0s', '1s', '2s', '0.5s', '1.5s', '2.5s', '0.2s', '3s', '1.8s', '2.2s', '0.8s', '1.2s'];
          const durations = ['2s', '3s', '2.5s', '3.5s', '2.8s', '3.2s', '4s', '2.2s', '5s', '3.8s', '2.6s', '4.2s'];

          return (
            <div
              key={index}
              className={`absolute rounded-full animate-ping pointer-events-none ${
                index % 2 === 0 ? 'bg-[#10b981]' : 'bg-[#00a76f]'
              }`}
              style={{
                width: `${sizes[index]}px`,
                height: `${sizes[index]}px`,
                opacity: opacities[index],
                left: pos.x + mousePosition.x * speeds[index],
                top: pos.y + mousePosition.y * speeds[index],
                animationDelay: delays[index],
                animationDuration: durations[index],
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          );
        })}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Room</h1>
            <p className="text-gray-300">Set up your game room and invite friends</p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-[#10b981]/20 rounded-2xl p-8 shadow-xl relative">

            {/* Return Home Link */}
            <div className="absolute top-4 right-4">
              <Link to="/" className="text-[#10b981] hover:text-[#00a76f] transition-colors text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
            </div>

            {/* Room Code Display — shown after creation */}
            {roomCode && (
              <div className="bg-[#10b981]/20 border border-[#10b981]/50 rounded-xl p-5 mb-6 text-center">
                <p className="text-[#10b981] text-sm mb-1">Your Room Code</p>
                <p className="text-4xl font-bold text-white tracking-widest">{roomCode}</p>
                <p className="text-[#10b981] text-xs mt-2">Share this code with your friends!</p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 rounded-xl p-3 mb-4 text-sm text-center">
                {errors.general}
              </div>
            )}

            {/* Username Input */}
            <div className="mb-5">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={!!roomCode}
                className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 border outline-none transition backdrop-blur-sm
                  ${errors.username
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#10b981]/30 focus:border-[#10b981]'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Game Type Select */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Game Type
              </label>
              <div className="relative">
                <select
                  name="gameType"
                  value={formData.gameType}
                  onChange={handleChange}
                  disabled={!!roomCode}
                  className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 border outline-none transition backdrop-blur-sm appearance-none cursor-pointer
                    ${errors.gameType
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-[#10b981]/30 focus:border-[#10b981]'}
                    disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 focus:bg-white/15`}
                >
                  <option value="" className="bg-[#040b1d] text-gray-300">Select a game type</option>
                  <option value="quiz" className="bg-[#040b1d] text-white py-2">🧠 Quiz Battle</option>
                  <option value="typing" className="bg-[#040b1d] text-white py-2">⌨️ Typing Speed Battle</option>
                  <option value="memory" className="bg-[#040b1d] text-white py-2">🃏 Memory Match</option>
                  <option value="coding" className="bg-[#040b1d] text-white py-2">💻 Coding Challenge</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.gameType && (
                <p className="text-red-400 text-xs mt-1">{errors.gameType}</p>
              )}
            </div>

            {/* Buttons */}
            {!roomCode ? (
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#00a76f] hover:shadow-lg hover:shadow-[#10b981]/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                {loading ? 'Creating...' : 'Create Room 🚀'}
              </button>
            ) : (
              <button
                onClick={goToLobby}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#00a76f] hover:shadow-lg hover:shadow-[#10b981]/30 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Go to Lobby →
              </button>
            )}

            {/* Join Room Link */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Want to join instead?{' '}
              <span
                onClick={() => navigate('/join')}
                className="text-[#10b981] hover:text-[#00a76f] cursor-pointer underline transition-colors"
              >
                Join a Room
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
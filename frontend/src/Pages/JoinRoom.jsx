import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinRoom = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    roomCode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [fetchingRooms, setFetchingRooms] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const userStr = localStorage.getItem("loggedInUser");
    console.log("[JoinRoom] loggedInUser from localStorage:", userStr);
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setCurrentUser(user);
      setFormData(prev => ({ ...prev, username: user.username || '' }));
    }
  }, []);

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

  // Fetch host's active waiting rooms on mount
  useEffect(() => {
    if (!currentUser?._id) return;
    setFetchingRooms(true);
    setFetchError(null);
    const url = `/api/rooms/host/${currentUser._id}`;
    console.log("[JoinRoom] Fetching rooms from:", url);
    axios.get(url)
      .then(res => {
        console.log("[JoinRoom] Results from", url, ":", res.data.rooms);
        setActiveRooms(res.data.rooms || []);
      })
      .catch(err => {
        console.error("[JoinRoom] Failed to fetch host rooms:", err);
        setFetchError("Could not load your active rooms.");
      })
      .finally(() => setFetchingRooms(false));
  }, [currentUser]);

  const handleClearSessions = async () => {
    if (!currentUser?._id) return;
    if (!window.confirm("Are you sure you want to clear all your active game sessions? This will remove you from any rooms you are currently in.")) return;

    try {
      await axios.post('/api/rooms/clear-active', { userId: currentUser._id });
      setActiveRooms([]);
      alert("All active game sessions cleared.");
    } catch (err) {
      console.error("[JoinRoom] Failed to clear sessions:", err);
      alert("Failed to clear sessions. Please try again.");
    }
  };

  // Tick every second to update countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
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
    if (!currentUser?._id) {
      setErrors({ general: 'You must be logged in to join a room' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`/api/rooms/join/${formData.roomCode.trim()}`, {
        userId: currentUser._id,
        username: formData.username.trim()
      });

      navigate(`/lobby/${formData.roomCode.trim()}`, {
        state: {
          userId: currentUser._id,
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
    <div className="min-h-screen bg-[#040b1d] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#a855f7]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-8 w-60 h-60 bg-[#ec4899]/25 rounded-full blur-3xl animate-pulse" />
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
              className={`absolute rounded-full animate-ping pointer-events-none ${index % 2 === 0 ? 'bg-[#ec4899]' : 'bg-[#a855f7]'
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
            <h1 className="text-4xl font-bold text-white mb-2">Join Game</h1>
            <p className="text-gray-300">Enter the room code to join your friends</p>
          </div>

          {/* ── Your Active Rooms Panel ── */}
          {(fetchingRooms || activeRooms.length > 0 || fetchError) && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-sm font-semibold text-[#a855f7] uppercase tracking-widest mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Your Active Rooms
                </div>
                {activeRooms.length > 0 && (
                  <button
                    onClick={handleClearSessions}
                    className="text-[10px] lowercase font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-tighter"
                  >
                    [ Clear All ]
                  </button>
                )}
                {fetchingRooms && (
                  <span className="text-[10px] lowercase font-normal italic animate-pulse">Checking...</span>
                )}
              </h2>

              {fetchError && (
                <div className="text-xs text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg p-2 text-center">
                  {fetchError}
                </div>
              )}

              <div className="space-y-3">
                {activeRooms.map(r => {
                  const expiryTime = r.expiresAt ? new Date(r.expiresAt).getTime() : new Date(r.createdAt).getTime() + 5 * 60 * 1000;
                  const secsLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
                  const mins = Math.floor(secsLeft / 60);
                  const secs = secsLeft % 60;
                  const isExpiringSoon = secsLeft < 60;

                  return (
                    <div
                      key={r._id}
                      className="bg-white/5 backdrop-blur-md border border-[#a855f7]/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3 group hover:border-[#ec4899]/50 transition-all duration-300 shadow-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-black tracking-[0.1em] text-lg">{r.roomCode}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30 font-bold uppercase tracking-tighter">{r.gameType}</span>
                          {r.status === 'in-progress' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold uppercase animate-pulse">Live</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                            </svg>
                            {r.players.length}/6
                          </span>
                          {r.status === 'waiting' && (
                            <span className={isExpiringSoon ? 'text-red-400 font-black animate-pulse' : 'text-slate-400'}>
                              ⏱ {mins}:{String(secs).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const targetPath = r.status === 'in-progress'
                            ? `/student-games/play/${r.gameType}`
                            : `/lobby/${r.roomCode}`;

                          navigate(targetPath, {
                            state: {
                              userId: currentUser._id,
                              username: r.players.find(p => String(p.userId) === String(currentUser._id))?.username || currentUser.username,
                              isHost: String(r.hostId) === String(currentUser._id),
                              room: r
                            }
                          });
                        }}
                        className={`shrink-0 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md ${r.status === 'in-progress'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/20'
                          : 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] shadow-[#a855f7]/20'
                          }`}
                      >
                        {r.status === 'in-progress' ? 'Resume Game 🎮' : 'Rejoin 🚀'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-[#a855f7]/20 rounded-2xl p-8 shadow-xl relative">

            {/* Return Home Link */}
            <div className="absolute top-4 right-4">
              <Link to="/" className="text-[#a855f7] hover:text-[#ec4899] transition-colors text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
            </div>

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
                className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 border outline-none transition backdrop-blur-sm
                  ${errors.username
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#a855f7]/30 focus:border-[#a855f7]'}`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Room Code Input */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Room Code
              </label>
              <input
                type="text"
                name="roomCode"
                value={formData.roomCode}
                onChange={handleChange}
                placeholder="e.g. AB12CD"
                maxLength={6}
                className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 border outline-none transition tracking-widest text-center text-xl font-bold uppercase backdrop-blur-sm
                  ${errors.roomCode
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#a855f7]/30 focus:border-[#a855f7]'}`}
              />
              {errors.roomCode && (
                <p className="text-red-400 text-xs mt-1">{errors.roomCode}</p>
              )}
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:shadow-lg hover:shadow-[#a855f7]/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              {loading ? 'Joining...' : 'Join Room 🚀'}
            </button>

            {/* Create Room Link */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Want to create a room?{' '}
              <span
                onClick={() => navigate('/create')}
                className="text-[#a855f7] hover:text-[#ec4899] cursor-pointer underline transition-colors"
              >
                Create a Room
              </span>
            </p>
          </div>
        </div>
      </div >
    </div >
  );
};

export default JoinRoom;
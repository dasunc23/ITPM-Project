import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getGameAccessStatus, getGames, getModules } from '../services/api';
import { semesterTwoFallbackGames } from '../games/gameData';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read pre-selected game from URL query params (passed from GameCard)
  const preselectedGame = searchParams.get('game') || '';
  const preselectedGameName = searchParams.get('gameName') || '';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    gameType: preselectedGame
  });

  useEffect(() => {
    const userStr = localStorage.getItem("loggedInUser");
    console.log("[CreateRoom] loggedInUser from localStorage:", userStr);
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setCurrentUser(user);
      setFormData(prev => ({ ...prev, username: user.name || '' }));
    }
  }, []);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particlePositions, setParticlePositions] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [fetchingRooms, setFetchingRooms] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Games state for dropdown (Year 3 Semester 2)
  const [availableGames, setAvailableGames] = useState(semesterTwoFallbackGames);

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
    axios.get(`/api/rooms/host/${currentUser._id}`)
      .then(res => {
        setActiveRooms(res.data.rooms || []);
      })
      .catch(err => {
        console.error("[CreateRoom] Failed to fetch host rooms:", err);
        setFetchError("Could not load your active rooms.");
      })
      .finally(() => setFetchingRooms(false));
  }, [currentUser, roomCode]); // re-fetch after creating a new room

  // Tick every second to update countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch games for Year 3 Semester 2 (Data Systems) on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const moduleData = await getModules(3, 2);
        const dataSystemsModule = moduleData.find((item) => item.name === 'Data Systems') || moduleData[0];

        if (dataSystemsModule?._id) {
          const gameData = await getGames({ moduleId: dataSystemsModule._id });
          if (gameData && gameData.length > 0) {
            setAvailableGames(gameData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch games for dropdown, using fallback.");
      }
    };
    fetchGames();
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
    if (!currentUser?._id) {
      setErrors({ general: 'You must be logged in to create a room' });
      return;
    }

    setLoading(true);
    try {
      const access = await getGameAccessStatus(currentUser._id);
      if (access.requiresPayment) {
        navigate('/payment', {
          state: {
            source: 'game-entry',
            access,
            game: availableGames.find((item) => item.type === formData.gameType) || null,
            returnTo: `/create?game=${formData.gameType}&gameName=${encodeURIComponent(preselectedGameName || availableGames.find((item) => item.type === formData.gameType)?.name || '')}`,
          },
        });
        return;
      }

      const res = await axios.post('/api/rooms/create', {
        userId: currentUser._id,
        username: formData.username.trim(),
        gameType: formData.gameType
      });

      if (res.data.access) {
        const updatedUser = {
          ...currentUser,
          freeGamePlays: res.data.access.freePlaysUsed,
          hasPaidGameAccess: res.data.access.hasPaidGameAccess,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }

      setRoomCode(res.data.roomCode);
      setCreatedRoom(res.data.room);

    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.access?.requiresPayment) {
        navigate('/payment', {
          state: {
            source: 'game-entry',
            access: error.response.data.access,
            game: availableGames.find((item) => item.type === formData.gameType) || null,
            returnTo: `/create?game=${formData.gameType}&gameName=${encodeURIComponent(preselectedGameName || availableGames.find((item) => item.type === formData.gameType)?.name || '')}`,
          },
        });
        return;
      }

      setErrors({ general: error.response?.data?.message || 'Failed to create room' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Go to Lobby ───────────────────────────────
  const goToLobby = () => {
    navigate(`/lobby/${roomCode}`, {
      state: {
        userId: currentUser._id,
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
            <h1 className="text-4xl font-bold text-white mb-2">Create Room</h1>
            <p className="text-gray-300">Set up your game room and invite friends</p>
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
                <svg className="w-4 h-4 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </Link>
            </div>

            {/* Room Code Display — shown after creation */}
            {roomCode && (
              <div className="bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 border border-[#a855f7]/30 rounded-xl p-6 mb-6 text-center animate-in fade-in zoom-in duration-500">
                <p className="text-[#ec4899] text-sm font-bold uppercase tracking-widest mb-2">Room Successfully Created</p>
                <div className="bg-white/5 rounded-lg py-4 border border-white/5 shadow-inner">
                  <p className="text-5xl font-black text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">{roomCode}</p>
                </div>
                <p className="text-gray-400 text-xs mt-4">Invite your friends using this unique code</p>
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
                    : 'border-[#a855f7]/30 focus:border-[#a855f7]'}
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

              {/* Locked game banner — shown when navigated from a game card */}
              {preselectedGame && (
                <div className="flex items-center gap-2 bg-[#a855f7]/15 border border-[#a855f7]/40 rounded-xl px-4 py-3 mb-3">
                  <span className="text-[#a855f7]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <p className="text-sm text-slate-200">
                    Game locked to <span className="font-semibold text-[#a855f7]">{preselectedGameName || preselectedGame}</span>
                  </p>
                </div>
              )}

              <div className="relative">
                <select
                  name="gameType"
                  value={formData.gameType}
                  onChange={handleChange}
                  disabled={!!roomCode || !!preselectedGame}
                  className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 border outline-none transition backdrop-blur-sm appearance-none cursor-pointer
                    ${errors.gameType
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-[#a855f7]/30 focus:border-[#a855f7]'}
                    ${preselectedGame ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/15 focus:bg-white/15'}`}
                >
                  <option value="" className="bg-[#040b1d] text-gray-300">Select a game ({availableGames.length} available)</option>
                  {availableGames.map(game => (
                    <option key={game._id || game.type} value={game.type} className="bg-[#040b1d] text-white py-2">
                      {game.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  {preselectedGame ? (
                    <svg className="w-4 h-4 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#ec4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
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
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:shadow-lg hover:shadow-[#a855f7]/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                {loading ? 'Creating...' : 'Create Room 🚀'}
              </button>
            ) : (
              <button
                onClick={goToLobby}
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:shadow-lg hover:shadow-[#a855f7]/30 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Go to Lobby →
              </button>
            )}

            {/* Join Game Link */}
            <p className="text-center text-gray-400 text-sm mt-4">
              Looking to join instead?{' '}
              <span
                onClick={() => navigate('/join')}
                className="text-[#a855f7] hover:text-[#ec4899] cursor-pointer underline transition-colors"
              >
                Join a Game
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const leaderboardRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setUserRole(parsedUser.role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    if (location.hash === "#leaderboard") {
      // small delay so layout is ready
      setTimeout(() => {
        leaderboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [location.hash]);

  // Dummy data for leaderboard
  const leaderboard = [
    { rank: 1, username: 'AlexGamer', points: 2450 },
    { rank: 2, username: 'QuizMaster', points: 2380 },
    { rank: 3, username: 'CodeNinja', points: 2320 },
    { rank: 4, username: 'TypeFast', points: 2280 },
    { rank: 5, username: 'MemoryKing', points: 2250 },
  ];

  // Dummy data for live rooms
  const liveRooms = [
    { code: 'ABC123', players: '3/6', game: 'Quiz Battle' },
    { code: 'DEF456', players: '5/6', game: 'Typing Speed' },
    { code: 'GHI789', players: '2/4', game: 'Coding Arena' },
    { code: 'JKL012', players: '4/6', game: 'Memory Match' },
  ];

  const notifications = useMemo(
    () => [
      { id: "pn1", title: "Match Invitation", message: "Room ABC123 is ready.", status: "Unread" },
      { id: "pn2", title: "Achievement Unlocked", message: "You unlocked 'Fast Thinker'.", status: "Unread" },
      { id: "pn3", title: "Weekly Summary", message: "You climbed 5 ranks this week.", status: "Read" },
    ],
    []
  );
  const unreadCount = notifications.filter((n) => n.status === "Unread").length;

  const showToast = (title, message) => {
    setToast({ title, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="min-h-screen bg-[#040b1d] text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#a855f7]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-8 w-60 h-60 bg-[#ec4899]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-[#0f172a]/40 rounded-full blur-3xl" />
      </div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-[#a855f7]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#a855f7]">GameHub</div>
            <div className="flex items-center space-x-10">
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="hover:text-[#a855f7] transition-colors">Home</Link>
                <a href="/student-games" className="hover:text-[#a855f7] transition-colors">Games</a>
                <a href="#leaderboard" className="hover:text-[#a855f7] transition-colors">Leaderboard</a>
                <Link to="/join" className="hover:text-[#a855f7] transition-colors">Join Game</Link>
                <Link to="/achievements" className="hover:text-[#a855f7] transition-colors">Achievements</Link>
                <Link to="/notifications" className="hover:text-[#a855f7] transition-colors">Notifications</Link>
                {isLoggedIn && <Link to="/payment" className="hover:text-[#a855f7] transition-colors">Payment</Link>}
                {userRole === "admin" && <Link to="/dashboard" className="hover:text-[#a855f7] transition-colors">Admin Dashboard</Link>}
              </div>
              <div className="hidden md:block relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen((v) => !v)}
                  className="relative bg-white/10 border border-white/10 px-4 py-2 rounded-full hover:bg-white/15 transition"
                >
                  <span className="text-sm font-semibold">🔔</span>
                  {unreadCount > 0 ? (
                    <span className="absolute -top-2 -right-2 text-[10px] bg-[#ec4899] text-white px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>

                {isNotificationsOpen ? (
                  <div className="absolute right-0 mt-3 w-80 bg-[#0b1226] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <p className="font-semibold">Notifications</p>
                      <button
                        type="button"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-xs text-gray-300 hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => showToast(n.title, n.message)}
                          className="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{n.title}</p>
                            <span
                              className={
                                "text-[10px] px-2 py-0.5 rounded-full border " +
                                (n.status === "Unread"
                                  ? "bg-[#a855f7]/15 border-[#a855f7]/25 text-[#e9d5ff]"
                                  : "bg-white/10 border-white/10 text-gray-200")
                              }
                            >
                              {n.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">{n.message}</p>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate("/notifications")}
                        className="w-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-95 transition-opacity"
                      >
                        Open Notification Center
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="hidden md:flex space-x-4">
                {isLoggedIn ? (
                  <button onClick={logout} className="bg-white text-indigo-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="bg-white text-indigo-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">Login</Link>
                    <Link to="/signup" className="bg-[#a855f7] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#ec4899] transition-colors">Sign Up</Link>
                  </>
                )}
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden bg-white/10 backdrop-blur-lg mt-4 rounded-lg p-4">
              <Link to="/" className="block py-2 hover:text-[#a855f7] transition-colors">Home</Link>
              <Link to="/gamehome" className="block py-2 hover:text-[#a855f7] transition-colors">Games</Link>
              <a href="#leaderboard" className="block py-2 hover:text-[#a855f7] transition-colors">Leaderboard</a>
              <Link to="/join" className="block py-2 hover:text-[#a855f7] transition-colors">Join Game</Link>
              <Link to="/achievements" className="block py-2 hover:text-[#a855f7] transition-colors">Achievements</Link>
              <Link to="/notifications" className="block py-2 hover:text-[#a855f7] transition-colors">Notifications</Link>
              {isLoggedIn && <Link to="/payment" className="block py-2 hover:text-[#a855f7] transition-colors">Payment</Link>}
              {userRole === "admin" && <Link to="/dashboard" className="block py-2 hover:text-[#a855f7] transition-colors">Admin Dashboard</Link>}
              {isLoggedIn ? (
                <button onClick={logout} className="bg-white text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors w-full text-center">Logout</button>
              ) : (
                <div className="flex space-x-4 mt-4">
                  <Link to="/login" className="bg-white text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors flex-1 text-center">Login</Link>
                  <Link to="/signup" className="bg-[#a855f7] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#ec4899] transition-colors flex-1 text-center">Sign Up</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.15),transparent_40%),radial-gradient(circle_at_80%_35%,rgba(16,185,129,0.12),transparent_45%)]" />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">COMPETE. LEARN. WIN.</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-lg">Real-time multiplayer games for university students, engineered for speed, fairness and the thrill of competition.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={isLoggedIn ? "/student-games" : "/login"} className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#a855f7]/30 hover:shadow-[#a855f7]/70 transition-all duration-300">Start Playing</Link>
              <Link to="/signup" className="bg-white/10 border border-[#a855f7]/50 text-[#a855f7] px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0a1a38] transition-all duration-300">Sign Up Free</Link>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative w-full h-96">
              {/* Animated Game Elements */}
              <div className="absolute top-10 left-10 w-16 h-16 bg-[#a855f7] rounded-lg flex items-center justify-center text-white font-bold text-xl animate-bounce" style={{ animationDelay: '0s' }}>Q</div>
              <div className="absolute top-20 right-20 w-12 h-12 bg-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse" style={{ animationDelay: '1s' }}>T</div>
              <div className="absolute bottom-20 left-1/4 w-14 h-14 bg-[#a855f7] rounded-lg flex items-center justify-center text-white font-bold text-lg animate-bounce" style={{ animationDelay: '2s' }}>C</div>
              <div className="absolute bottom-10 right-10 w-18 h-18 bg-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>M</div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#a855f7] rounded-lg flex items-center justify-center text-white font-bold text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>G</div>
              <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse" style={{ animationDelay: '2.5s' }}>⛶</div>
              {/* Central Game Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#a855f7] animate-pulse mb-4">PLAY</div>
                  <div className="text-4xl font-semibold text-white animate-bounce">NOW</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section id="games" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Quiz Battle', description: 'Test your knowledge in real-time MCQ battles', icon: 'Q', link: '/student-games/play/quiz' },
              { title: 'Typing Speed', description: 'Race against time in typing challenges', icon: 'T', link: '/student-games/play/typing' },
              { title: 'Coding Arena', description: 'Solve coding puzzles and compete', icon: 'C', link: '/student-games/play/coding' },
              { title: 'Memory Match', description: 'Challenge your memory with card matching', icon: 'M', link: '/student-games/play/memory' },
            ].map((game, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-6xl font-bold text-[#a855f7] mb-4">{game.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <p className="text-gray-300 mb-4">{game.description}</p>
                <Link to={game.link} className="inline-block bg-[#a855f7] text-white px-6 py-2 rounded-full hover:bg-[#ec4899] transition-colors">Play Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Create or Join Game', description: 'Start a new game or join an existing room with friends', icon: '1' },
              { step: 2, title: 'Play in Real-Time', description: 'Compete against other students in live multiplayer matches', icon: '2' },
              { step: 3, title: 'Earn Points & Rank', description: 'Win games to earn points and climb the leaderboard', icon: '3' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4 text-[#a855f7]">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" ref={leaderboardRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Top Players</h2>
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">#{player.rank}</td>
                    <td className="px-6 py-4 text-sm text-white">{player.username}</td>
                    <td className="px-6 py-4 text-sm text-white">{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <Link
              to="/leaderboard"
              className="inline-block bg-[#a855f7] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#ec4899] transition-colors"
            >
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Live Rooms Section */}
      <section className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Live Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveRooms.map((room, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-semibold mb-2">{room.game}</h3>
                <p className="text-gray-300 mb-2">Code: {room.code}</p>
                <p className="text-gray-300 mb-4">Players: {room.players}</p>
                <button className="bg-[#a855f7] text-white px-6 py-2 rounded-full w-full hover:bg-[#ec4899] transition-colors">Join</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { badge: 'Gold', description: 'Win 5 games in a row', icon: 'G' },
              { badge: 'Silver', description: 'Reach top 10 on leaderboard', icon: 'S' },
              { badge: 'Bronze', description: 'Complete your first game', icon: 'B' },
            ].map((achievement, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4 text-[#a855f7]">{achievement.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{achievement.badge}</h3>
                <p className="text-gray-300">{achievement.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/achievements"
              className="inline-block bg-white/10 border border-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-900 transition-all duration-300"
            >
              View All Achievements
            </Link>
          </div>
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-6 right-6 z-[60] w-[320px]">
          <div className="bg-[#0b1226] border border-white/10 rounded-2xl shadow-2xl p-4">
            <p className="font-semibold">{toast.title}</p>
            <p className="text-sm text-gray-300 mt-1">{toast.message}</p>
          </div>
        </div>
      ) : null}

      {/* Call-To-Action Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#a855f7] to-[#ec4899]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Join the Competition Today!</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-white text-indigo-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">Login</Link>
            <Link to="/signup" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-900 transition-colors">Sign Up</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-300">
            <div>
              <h3 className="text-xl font-bold text-[#a855f7] mb-3">GameHub</h3>
              <p className="text-gray-300">The ultimate multiplayer gaming platform for students.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#a855f7] mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><a href="#games" className="text-gray-300 hover:text-white transition-colors">Games</a></li>
                <li><a href="#leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#a855f7] mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#a855f7] mb-3">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="text-gray-400 text-sm">&copy; 2026 GameHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

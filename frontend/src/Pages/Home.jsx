import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#040b1d] text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#10b981]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-8 w-60 h-60 bg-[#00a76f]/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-[#0f172a]/40 rounded-full blur-3xl" />
      </div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-[#10b981]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#10b981]">GameHub</div>
            <div className="flex items-center space-x-10">
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="hover:text-[#10b981] transition-colors">Home</Link>
                <a href="#games" className="hover:text-[#10b981] transition-colors">Games</a>
                <a href="#leaderboard" className="hover:text-[#10b981] transition-colors">Leaderboard</a>
              </div>
              <div className="hidden md:flex space-x-4">
                <Link to="/login" className="bg-white text-indigo-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">Login</Link>
                <Link to="/signup" className="bg-[#10b981] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#00a76f] transition-colors">Sign Up</Link>
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
              <Link to="/" className="block py-2 hover:text-[#10b981] transition-colors">Home</Link>
              <a href="#games" className="block py-2 hover:text-[#10b981] transition-colors">Games</a>
              <a href="#leaderboard" className="block py-2 hover:text-[#10b981] transition-colors">Leaderboard</a>
              <div className="flex space-x-4 mt-4">
                <Link to="/login" className="bg-white text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors flex-1 text-center">Login</Link>
                <Link to="/signup" className="bg-[#10b981] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#00a76f] transition-colors flex-1 text-center">Sign Up</Link>
              </div>
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
              <Link to="/login" className="bg-gradient-to-r from-[#10b981] to-[#00a76f] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#10b981]/30 hover:shadow-[#10b981]/70 transition-all duration-300">Start Playing</Link>
              <Link to="/signup" className="bg-white/10 border border-[#10b981]/50 text-[#10b981] px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0a1a38] transition-all duration-300">Sign Up Free</Link>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative w-full h-96">
              {/* Animated Game Elements */}
              <div className="absolute top-10 left-10 w-16 h-16 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-bold text-xl animate-bounce" style={{ animationDelay: '0s' }}>Q</div>
              <div className="absolute top-20 right-20 w-12 h-12 bg-[#00a76f] rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse" style={{ animationDelay: '1s' }}>T</div>
              <div className="absolute bottom-20 left-1/4 w-14 h-14 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-bold text-lg animate-bounce" style={{ animationDelay: '2s' }}>C</div>
              <div className="absolute bottom-10 right-10 w-18 h-18 bg-[#00a76f] rounded-full flex items-center justify-center text-white font-bold text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>M</div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-bold text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>G</div>
              <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-[#00a76f] rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse" style={{ animationDelay: '2.5s' }}>⛶</div>
              {/* Central Game Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#10b981] animate-pulse mb-4">PLAY</div>
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
              { title: 'Quiz Battle', description: 'Test your knowledge in real-time MCQ battles', icon: 'Q' },
              { title: 'Typing Speed', description: 'Race against time in typing challenges', icon: 'T' },
              { title: 'Coding Arena', description: 'Solve coding puzzles and compete', icon: 'C' },
              { title: 'Memory Match', description: 'Challenge your memory with card matching', icon: 'M' },
            ].map((game, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-6xl font-bold text-[#10b981] mb-4">{game.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <p className="text-gray-300 mb-4">{game.description}</p>
                <button className="bg-[#10b981] text-white px-6 py-2 rounded-full hover:bg-[#00a76f] transition-colors">Play Now</button>
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
              { step: 1, title: 'Create or Join Room', description: 'Start a new game or join an existing room with friends', icon: '1' },
              { step: 2, title: 'Play in Real-Time', description: 'Compete against other students in live multiplayer matches', icon: '2' },
              { step: 3, title: 'Earn Points & Rank', description: 'Win games to earn points and climb the leaderboard', icon: '3' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4 text-[#10b981]">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="py-24 px-6">
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
            <button className="bg-[#10b981] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#00a76f] transition-colors">View Full Leaderboard</button>
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
                <button className="bg-[#10b981] text-white px-6 py-2 rounded-full w-full hover:bg-[#00a76f] transition-colors">Join</button>
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
                <div className="text-6xl mb-4 text-[#10b981]">{achievement.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{achievement.badge}</h3>
                <p className="text-gray-300">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#10b981] to-[#00a76f]">
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
              <h3 className="text-xl font-bold text-[#10b981] mb-3">GameHub</h3>
              <p className="text-gray-300">The ultimate multiplayer gaming platform for students.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#10b981] mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><a href="#games" className="text-gray-300 hover:text-white transition-colors">Games</a></li>
                <li><a href="#leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#10b981] mb-3">Account</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#10b981] mb-3">Support</h4>
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

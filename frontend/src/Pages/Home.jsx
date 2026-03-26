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
    <div className="min-h-screen bg-[#0a1a38] text-[#e2e8f0]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0a1a38] bg-opacity-95 backdrop-blur-sm border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-[#10b981]">GameHub</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-[#94a3b8] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <a href="#games" className="text-[#94a3b8] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Games</a>
                <a href="#leaderboard" className="text-[#94a3b8] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Leaderboard</a>
                <Link to="/login" className="text-[#94a3b8] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/signup" className="bg-[#10b981] hover:bg-[#00a76f] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Sign Up</Link>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-[#1f2937] inline-flex items-center justify-center p-2 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#334155] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1f2937]">
              <Link to="/" className="text-[#94a3b8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <a href="#games" className="text-[#94a3b8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Games</a>
              <a href="#leaderboard" className="text-[#94a3b8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Leaderboard</a>
              <Link to="/login" className="text-[#94a3b8] hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
              <Link to="/signup" className="bg-[#10b981] hover:bg-[#00a76f] text-white block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1a38] via-[#0f172a] to-[#0a1a38] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-[#10b981] rounded-full animate-bounce opacity-70"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-[#00a76f] rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-[#01673a] rounded-full animate-ping opacity-50"></div>
          <div className="absolute top-1/3 right-10 w-5 h-5 bg-[#10b981] rounded-full animate-bounce opacity-40"></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-[#00a76f] rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-[#01673a] rounded-full animate-ping opacity-80"></div>
          <div className="absolute bottom-40 right-1/4 w-3 h-3 bg-[#10b981] rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/2 left-20 w-5 h-5 bg-[#00a76f] rounded-full animate-pulse opacity-40"></div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <img 
              src="https://media.giphy.com/media/3o7TKz9bX9Z8LxOq5y/giphy.gif" 
              alt="Gaming Animation" 
              className="mx-auto w-32 h-32 rounded-full border-4 border-[#10b981] shadow-lg animate-spin"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-pulse">
            Compete. Learn. Win.
          </h1>
          <p className="text-xl md:text-2xl text-[#94a3b8] mb-8 max-w-3xl mx-auto">
            Real-time multiplayer games for university students
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-[#10b981] hover:bg-[#00a76f] text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 animate-pulse">
              Start Playing
            </Link>
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-[#0a1a38] transition-all duration-300 animate-pulse">
              Join Room
            </button>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section id="games" className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#e2e8f0] mb-12">Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Quiz Battle', description: 'Test your knowledge in real-time MCQ battles', icon: '🧠' },
              { title: 'Typing Speed', description: 'Race against time in typing challenges', icon: '⌨️' },
              { title: 'Coding Arena', description: 'Solve coding puzzles and compete', icon: '💻' },
              { title: 'Memory Match', description: 'Challenge your memory with card matching', icon: '🃏' },
            ].map((game, index) => (
              <div key={index} className="bg-[#1f2937] rounded-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                <div className="text-6xl mb-4 group-hover:animate-bounce">{game.icon}</div>
                <h3 className="text-xl font-semibold text-[#e2e8f0] mb-2">{game.title}</h3>
                <p className="text-[#94a3b8] mb-4">{game.description}</p>
                <button className="bg-[#10b981] hover:bg-[#00a76f] text-white font-bold py-2 px-4 rounded transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  Play Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#0a1a38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#e2e8f0] mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Create or Join Room', description: 'Start a new game or join an existing room with friends', icon: '🏠' },
              { step: 2, title: 'Play in Real-Time', description: 'Compete against other students in live multiplayer matches', icon: '⚡' },
              { step: 3, title: 'Earn Points & Rank', description: 'Win games to earn points and climb the leaderboard', icon: '🏆' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-[#e2e8f0] mb-2">{item.step}. {item.title}</h3>
                <p className="text-[#94a3b8]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#e2e8f0] mb-12">Top Players</h2>
          <div className="bg-[#1f2937] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#334155]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {leaderboard.map((player, index) => (
                  <tr key={index} className="hover:bg-[#334155] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#e2e8f0]">{player.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94a3b8]">{player.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94a3b8]">{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <button className="bg-[#10b981] hover:bg-[#00a76f] text-white font-bold py-3 px-6 rounded-lg transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* Live Rooms Section */}
      <section className="py-20 bg-[#0a1a38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#e2e8f0] mb-12">Live Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveRooms.map((room, index) => (
              <div key={index} className="bg-[#1f2937] rounded-lg p-6 hover:shadow-2xl transition-shadow">
                <h3 className="text-xl font-semibold text-[#e2e8f0] mb-2">{room.game}</h3>
                <p className="text-[#94a3b8] mb-2">Room Code: {room.code}</p>
                <p className="text-[#94a3b8] mb-4">Players: {room.players}</p>
                <button className="bg-[#10b981] hover:bg-[#00a76f] text-white font-bold py-2 px-4 rounded w-full transition-colors">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-[#e2e8f0] mb-12">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { badge: 'Gold', description: 'Win 5 games in a row', icon: '🥇' },
              { badge: 'Silver', description: 'Reach top 10 on leaderboard', icon: '🥈' },
              { badge: 'Bronze', description: 'Complete your first game', icon: '🥉' },
            ].map((achievement, index) => (
              <div key={index} className="bg-[#1f2937] rounded-lg p-6 text-center hover:scale-105 transition-transform duration-300 group">
                <div className="text-6xl mb-4 group-hover:animate-bounce">{achievement.icon}</div>
                <h3 className="text-xl font-semibold text-[#e2e8f0] mb-2">{achievement.badge}</h3>
                <p className="text-[#94a3b8]">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#10b981] to-[#00a76f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Join the Competition Today!</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-white text-[#10b981] font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-[#10b981] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1a38] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#10b981] mb-4">GameHub</h3>
              <p className="text-[#94a3b8]">The ultimate multiplayer gaming platform for students.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#e2e8f0] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-[#94a3b8] hover:text-white transition-colors">Home</Link></li>
                <li><a href="#games" className="text-[#94a3b8] hover:text-white transition-colors">Games</a></li>
                <li><a href="#leaderboard" className="text-[#94a3b8] hover:text-white transition-colors">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#e2e8f0] mb-4">Account</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-[#94a3b8] hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-[#94a3b8] hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#e2e8f0] mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#94a3b8] hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-[#94a3b8] hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#334155] mt-8 pt-8 text-center">
            <p className="text-[#94a3b8]">&copy; 2026 GameHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

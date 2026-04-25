import { Link, useLocation, useParams } from 'react-router-dom'
import CodingChallengeGame from '../games/CodingChallenge/CodingChallengeGame'
import MemoryMatchGame from '../games/MemoryMatch/MemoryMatchGame'
import QuizBattleGame from '../games/QuizBattle/QuizBattleGame'
import TypingRaceGame from '../games/TypingRace/TypingRaceGame'

const gameMap = {
  quiz: QuizBattleGame,
  coding: CodingChallengeGame,
  memory: MemoryMatchGame,
  typing: TypingRaceGame,
}

const gameTitles = {
  quiz: 'Quiz Battle',
  coding: 'Coding Challenge',
  memory: 'Memory Match',
  typing: 'Typing Race',
}

function PlayGamePage() {
  const { type } = useParams()
  const location = useLocation()
  const GameComponent = gameMap[type]
  const backTo = location.state?.year && location.state?.semester
    ? `/student-games/year/${location.state.year}/semester/${location.state.semester}`
    : '/student-games/year/3/semester/2'

  if (!GameComponent) {
    return (
      <main className="app-shell">
        <div className="page-wrap">
          <div className="status-box">
            <p className="text-2xl font-semibold text-white">Game type not found.</p>
            <Link to={backTo} className="soft-button">
              Back to Semester 2
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#040b1d]">
      {/* Main Navbar - Same as Home.jsx */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-[#a855f7]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                to={backTo}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-[#a855f7]/50 text-white hover:bg-[#a855f7] transition-colors"
                aria-label="Back to semester"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[#a855f7]">GameHub</h1>
                <p className="text-xs text-gray-400">{gameTitles[type] || 'Game'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/student-games"
                className="text-white hover:text-[#a855f7] transition-colors text-sm"
              >
                Games
              </Link>
              <Link
                to="/home"
                className="bg-white text-indigo-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Game Content with top padding for navbar */}
      <div className="pt-20">
        <GameComponent />
      </div>
    </div>
  )
}

export default PlayGamePage

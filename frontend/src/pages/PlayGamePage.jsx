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
    <div className="relative">
      <div className="fixed left-4 top-4 z-50">
        <Link to={backTo} className="outline-button">
          Back to Semester 2
        </Link>
      </div>
      <GameComponent />
    </div>
  )
}

export default PlayGamePage

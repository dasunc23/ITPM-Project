import { useEffect, useMemo, useState } from 'react'
import EndGameScreen from '../../Components/EndGameScreen'
import GameShell from '../../Components/GameShell'
import GameLobby from '../../Components/Lobby/GameLobby'
import RoundTimer from '../../Components/Timer/RoundTimer'
import { gameTypeContent, memoryLevels } from '../gameData'
import { useGameRoom } from '../useGameRoom'
import { useSoundEffects } from '../useSoundEffects'
import MemoryCard from './MemoryCard'

// Get current level's pairs
const getCurrentLevelPairs = (levelIndex) => {
  const level = memoryLevels[levelIndex]
  return level ? level.pairs : memoryLevels[0].pairs
}

const shuffleCards = (pairs) =>
  [...pairs.flatMap((pair) => [
    { id: `${pair.pairId}-a`, pairId: pair.pairId, label: pair.left, category: pair.category },
    { id: `${pair.pairId}-b`, pairId: pair.pairId, label: pair.right, category: pair.category },
  ])].sort(() => Math.random() - 0.5)

function MemoryMatchGame() {
  const {
    currentPlayerId,
    phase,
    countdown,
    players,
    leaderboard,
    isHost,
    startGame,
    updateScore,
    endGame,
    playAgain,
    setStatus,
  } = useGameRoom({ gameType: 'memory', roomId: 'year3-sem2-memory' })

  const sounds = useSoundEffects()
  const [levelIndex, setLevelIndex] = useState(0)
  const [currentPairs, setCurrentPairs] = useState(() => getCurrentLevelPairs(0))
  const [cards, setCards] = useState(() => shuffleCards(getCurrentLevelPairs(0)))
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [timerKey, setTimerKey] = useState(0)

  const currentLevel = memoryLevels[levelIndex]
  const totalPairs = currentPairs.length
  const matchesFound = matched.length / 2

  const prepareBoard = (level = levelIndex) => {
    const pairs = getCurrentLevelPairs(level)
    setCurrentPairs(pairs)
    setCards(shuffleCards(pairs))
    setFlipped([])
    setMatched([])
    setTimerKey((previous) => previous + 1)
    setStatus(`${currentLevel.title} board is live.`)
  }

  const goToNextLevel = () => {
    if (levelIndex < memoryLevels.length - 1) {
      const nextLevel = levelIndex + 1
      setLevelIndex(nextLevel)
      prepareBoard(nextLevel)
      setStatus(`Level ${nextLevel + 1}: ${memoryLevels[nextLevel].title}`)
    } else {
      // All levels complete
      endGame()
    }
  }

  const handleCardClick = (card) => {
    if (phase !== 'playing') {
      return
    }

    if (flipped.includes(card.id) || matched.includes(card.id) || flipped.length === 2) {
      return
    }

    sounds.playClick()
    const nextFlipped = [...flipped, card.id]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      const [firstId, secondId] = nextFlipped
      const firstCard = cards.find((item) => item.id === firstId)
      const secondCard = cards.find((item) => item.id === secondId)

      window.setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          setMatched((previous) => [...previous, firstId, secondId])
          // Different points based on category
          const categoryPoints = {
            'Primary Key': 60,
            'Foreign Key': 50,
            'Relationship': 40,
          }
          const points = categoryPoints[firstCard.category] || 50
          updateScore(currentPlayerId, points)
          sounds.playSuccess()
        } else {
          sounds.playError()
        }
        setFlipped([])
      }, 850)
    }
  }

  // Check if level is complete
  useEffect(() => {
    if (phase === 'playing' && matched.length > 0 && matched.length === cards.length && cards.length > 0) {
      // Level complete - check if there are more levels
      if (levelIndex < memoryLevels.length - 1) {
        const timer = window.setTimeout(() => {
          goToNextLevel()
        }, 1500)
        return () => window.clearTimeout(timer)
      } else {
        // All levels complete
        const timer = window.setTimeout(() => endGame(), 600)
        return () => window.clearTimeout(timer)
      }
    }

    return undefined
  }, [phase, matched, cards, levelIndex])
      const firstCard = cards.find((item) => item.id === firstId)
      const secondCard = cards.find((item) => item.id === secondId)

      window.setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          setMatched((previous) => [...previous, firstId, secondId])
          // Different points based on category
          const categoryPoints = {
            'Primary Key': 60,
            'Foreign Key': 50,
            'Relationship': 40,
          }
          const points = categoryPoints[firstCard.category] || 50
          updateScore(currentPlayerId, points)
          sounds.playSuccess()
        } else {
          sounds.playError()
        }
        setFlipped([])
      }, 850)
    }
  }

  useEffect(() => {
    if (phase === 'playing' && matched.length === cards.length && cards.length > 0) {
      const timer = window.setTimeout(() => endGame(), 600)
      return () => window.clearTimeout(timer)
    }

    return undefined
  }, [phase, matched, cards, endGame])

  const topBar = useMemo(
    () => (
      <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Scoring</p>
        <p className="mt-2 text-sm text-slate-300">Primary Key match = 60 pts</p>
        <p className="text-sm text-slate-300">Foreign Key match = 50 pts</p>
        <p className="text-sm text-slate-300">Relationship match = 40 pts</p>
      </div>
    ),
    [],
  )

  if (phase === 'lobby') {
    return (
      <GameShell
        title={gameTypeContent.memory.title}
        subtitle={gameTypeContent.memory.subtitle}
        phase={phase}
        countdown={countdown}
        leaderboard={leaderboard}
      >
        <GameLobby
          players={players}
          title={gameTypeContent.memory.title}
          subtitle="Flip schema cards, find the matching relationships, and clear the board on your own."
          onStart={() => {
            prepareBoard()
            startGame()
          }}
          isHost={isHost}
        />
      </GameShell>
    )
  }

  if (phase === 'finished') {
    return (
      <GameShell
        title={gameTypeContent.memory.title}
        subtitle="Board completed."
        phase={phase}
        countdown={countdown}
        leaderboard={leaderboard}
        topBar={topBar}
      >
        <EndGameScreen players={leaderboard} onPlayAgain={playAgain} winnerLabel="Final Score" />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={gameTypeContent.memory.title}
      subtitle="Flip cards and match table relationships."
      phase={phase}
      countdown={countdown}
      leaderboard={leaderboard}
      topBar={topBar}
    >
      <RoundTimer duration={120} isRunning={phase === 'playing'} onComplete={endGame} resetKey={timerKey} />
      <div className="glass-card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">Schema Board</h2>
          <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
            Matches Found: {matched.length / 2}/{memoryPairs.length}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              isFlipped={flipped.includes(card.id)}
              isMatched={matched.includes(card.id)}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>
    </GameShell>
  )
}

export default MemoryMatchGame

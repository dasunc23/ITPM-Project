import { useEffect, useMemo, useState } from 'react'
import EndGameScreen from '../../Components/EndGameScreen'
import GameShell from '../../Components/GameShell'
import GameLobby from '../../Components/Lobby/GameLobby'
import RoundTimer from '../../Components/Timer/RoundTimer'
import { gameTypeContent, memoryPairs } from '../gameData'
import { useGameRoom } from '../useGameRoom'
import { useSoundEffects } from '../useSoundEffects'
import MemoryCard from './MemoryCard'

// Get pairs for a specific level (9 pairs = 18 cards)
const getPairsForLevel = (level) => memoryPairs.filter(pair => pair.level === level)

// Shuffle cards for a specific level
const shuffleCardsForLevel = (level) => {
  const levelPairs = getPairsForLevel(level)
  return [...levelPairs.flatMap((pair) => [
    { id: `${pair.pairId}-a`, pairId: pair.pairId, label: pair.left, category: pair.category, level: pair.level },
    { id: `${pair.pairId}-b`, pairId: pair.pairId, label: pair.right, category: pair.category, level: pair.level },
  ])].sort(() => Math.random() - 0.5)
}

function MemoryMatchGame({ roomState, onEndGame }) {
  // Determine if this is a real multiplayer session
  const isMultiplayer = !!(roomState?.room?.roomCode)
  const isHost = isMultiplayer ? roomState.isHost : true

  const {
    currentPlayerId,
    phase,
    countdown,
    players,
    leaderboard,
    startGame,
    updateScore,
    endGame,
    setStatus,
  } = useGameRoom({ gameType: 'memory', roomId: roomState?.room?.roomCode || 'year3-sem2-memory' })

  const sounds = useSoundEffects()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [cards, setCards] = useState(() => shuffleCardsForLevel(1))
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [timerKey, setTimerKey] = useState(0)

  const totalPairs = 8
  const totalLevels = 3

  const prepareBoard = (level = currentLevel) => {
    setCards(shuffleCardsForLevel(level))
    setFlipped([])
    setMatched([])
    setTimerKey((previous) => previous + 1)
    setStatus(`Level ${level} - Schema memory board is live.`)
  }

  const goToNextLevel = () => {
    if (currentLevel < totalLevels) {
      const nextLevel = currentLevel + 1
      setCurrentLevel(nextLevel)
      prepareBoard(nextLevel)
      setStatus(`Level ${nextLevel} - New schema pairs loaded!`)
    } else {
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

  useEffect(() => {
    if (phase === 'playing' && matched.length === cards.length && cards.length > 0) {
      // Check if there are more levels
      if (currentLevel < totalLevels) {
        const timer = window.setTimeout(() => {
          goToNextLevel()
        }, 1500)
        return () => window.clearTimeout(timer)
      } else {
        const timer = window.setTimeout(() => endGame(), 600)
        return () => window.clearTimeout(timer)
      }
    }

    return undefined
  }, [phase, matched, cards, endGame, currentLevel, totalLevels])

  const topBar = useMemo(
    () => (
      <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Level {currentLevel} of {totalLevels}</p>
        <p className="mt-2 text-sm text-slate-300">Primary Key match = 60 pts</p>
        <p className="text-sm text-slate-300">Foreign Key match = 50 pts</p>
        <p className="text-sm text-slate-300">Relationship match = 40 pts</p>
      </div>
    ),
    [currentLevel, totalLevels],
  )

  // Only show internal lobby in solo mode
  if (phase === 'lobby' && !isMultiplayer) {
    return (
      <GameShell
        title={gameTypeContent.memory.title}
        subtitle={gameTypeContent.memory.subtitle}
        phase={phase}
        countdown={countdown}
        leaderboard={displayLeaderboard}
      >
        <GameLobby
          players={players}
          title={gameTypeContent.memory.title}
          subtitle={`Flip schema cards across 3 levels. Each level has 8 pairs (16 cards). Clear all levels to win!`}
          onStart={() => {
            setCurrentLevel(1)
            prepareBoard(1)
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
        leaderboard={displayLeaderboard}
        topBar={topBar}
      >
        <EndGameScreen
          players={displayLeaderboard}
          onEndGame={onEndGame || (() => {})}
          winnerLabel="Final Score"
          isHost={isHost}
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={gameTypeContent.memory.title}
      subtitle="Flip cards and match table relationships."
      phase={phase}
      countdown={countdown}
      leaderboard={displayLeaderboard}
      topBar={topBar}
    >
      <RoundTimer duration={60} isRunning={phase === 'playing'} onComplete={endGame} resetKey={timerKey} />
      <div className="glass-card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">Schema Board</h2>
          <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
            Matches Found: {matched.length / 2}/{totalPairs}
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

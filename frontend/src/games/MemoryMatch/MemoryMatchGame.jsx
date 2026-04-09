import { useEffect, useMemo, useState } from 'react'
import EndGameScreen from '../../Components/EndGameScreen'
import GameShell from '../../Components/GameShell'
import GameLobby from '../../Components/Lobby/GameLobby'
import RoundTimer from '../../Components/Timer/RoundTimer'
import { gameTypeContent, memoryPairs } from '../gameData'
import { useGameRoom } from '../useGameRoom'
import { useSoundEffects } from '../useSoundEffects'
import MemoryCard from './MemoryCard'

const shuffleCards = () =>
  [...memoryPairs.flatMap((pair) => [
    { id: `${pair.pairId}-a`, pairId: pair.pairId, label: pair.left },
    { id: `${pair.pairId}-b`, pairId: pair.pairId, label: pair.right },
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
  const [cards, setCards] = useState(shuffleCards)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [timerKey, setTimerKey] = useState(0)

  const prepareBoard = () => {
    setCards(shuffleCards())
    setFlipped([])
    setMatched([])
    setTimerKey((previous) => previous + 1)
    setStatus('Schema memory board is live.')
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
          updateScore(currentPlayerId, 50)
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
        <p className="mt-2 text-sm text-slate-300">Correct match = 50 pts</p>
        <p className="text-sm text-slate-300">Find all pairs before time ends</p>
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
      <RoundTimer duration={75} isRunning={phase === 'playing'} onComplete={endGame} resetKey={timerKey} />
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

import { useEffect, useMemo, useState } from 'react'
import EndGameScreen from '../../components/EndGameScreen'
import GameShell from '../../components/GameShell'
import GameLobby from '../../components/Lobby/GameLobby'
import RoundTimer from '../../components/Timer/RoundTimer'
import { gameTypeContent, typingRacePrompts } from '../gameData'
import { useGameRoom } from '../useGameRoom'
import { useSoundEffects } from '../useSoundEffects'
import TypingProgress from './TypingProgress'

const calculateAccuracy = (input, expected) => {
  if (!input.length) {
    return 100
  }

  let correctCharacters = 0

  for (let index = 0; index < input.length; index += 1) {
    if (input[index] === expected[index]) {
      correctCharacters += 1
    }
  }

  return Math.round((correctCharacters / input.length) * 100)
}

function TypingRaceGame() {
  const {
    currentPlayerId,
    phase,
    countdown,
    players,
    leaderboard,
    isHost,
    startGame,
    emitRoomEvent,
    setAbsoluteScore,
    endGame,
    playAgain,
  } = useGameRoom({ gameType: 'typing', roomId: 'year3-sem2-typing' })

  const sounds = useSoundEffects()
  const [prompt] = useState(typingRacePrompts[0])
  const [typedText, setTypedText] = useState('')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerKey, setTimerKey] = useState(0)

  useEffect(() => {
    if (phase !== 'playing') {
      return undefined
    }

    setTypedText('')
    setElapsedSeconds(0)
    setTimerKey((previous) => previous + 1)

    const elapsedInterval = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1)
    }, 1000)

    return () => {
      window.clearInterval(elapsedInterval)
    }
  }, [phase])

  const accuracy = calculateAccuracy(typedText, prompt.text)
  const wordsTyped = typedText.trim() ? typedText.trim().split(/\s+/).length : 0
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60)
  const wpm = Math.round(wordsTyped / minutes)
  const progress = Math.round((typedText.length / prompt.text.length) * 100)
  const liveRacePlayers = useMemo(
    () => [
      {
        id: currentPlayerId,
        name: 'You',
        progress: Math.min(progress, 100),
      },
    ],
    [currentPlayerId, progress],
  )

  useEffect(() => {
    const score = Math.round((wpm * Math.max(accuracy, 40)) / 100)
    setAbsoluteScore(currentPlayerId, score)
  }, [currentPlayerId, wpm, accuracy, setAbsoluteScore])

  useEffect(() => {
    if (phase === 'playing' && progress >= 100) {
      sounds.playSuccess()
      endGame()
    }
  }, [phase, progress, endGame, sounds])

  const topBar = useMemo(
    () => (
      <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Stats</p>
        <p className="mt-2 text-sm text-slate-300">WPM: {wpm}</p>
        <p className="text-sm text-slate-300">Accuracy: {accuracy}%</p>
      </div>
    ),
    [wpm, accuracy],
  )

  if (phase === 'lobby') {
    return (
      <GameShell
        title={gameTypeContent.typing.title}
        subtitle={gameTypeContent.typing.subtitle}
        phase={phase}
        countdown={countdown}
        leaderboard={leaderboard}
      >
        <GameLobby
          players={players}
          title={gameTypeContent.typing.title}
          subtitle="Type the SQL query at speed and beat your own WPM and accuracy."
          onStart={startGame}
          isHost={isHost}
        />
      </GameShell>
    )
  }

  if (phase === 'finished') {
    return (
      <GameShell
        title={gameTypeContent.typing.title}
        subtitle="Run completed."
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
      title={gameTypeContent.typing.title}
      subtitle={prompt.title}
      phase={phase}
      countdown={countdown}
      leaderboard={leaderboard}
      topBar={topBar}
    >
      <RoundTimer duration={45} isRunning={phase === 'playing'} onComplete={endGame} resetKey={timerKey} />
      <div className="glass-card space-y-5 p-6">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-sm leading-8 text-slate-100">
          {prompt.text}
        </div>
        <textarea
          value={typedText}
          onChange={(event) => {
            setTypedText(event.target.value)
            emitRoomEvent('sendAnswer', {
              playerId: currentPlayerId,
              progress: Math.min(Math.round((event.target.value.length / prompt.text.length) * 100), 100),
            })
            sounds.playClick()
          }}
          className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-[#101827] p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-indigo-400/50"
          spellCheck="false"
          placeholder="Type the SQL query here..."
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-card space-y-4 p-5">
          <h3 className="text-lg font-semibold text-white">Performance</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">WPM</p>
              <p className="mt-3 text-3xl font-semibold text-white">{wpm}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Accuracy</p>
              <p className="mt-3 text-3xl font-semibold text-white">{accuracy}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Progress</p>
              <p className="mt-3 text-3xl font-semibold text-white">{Math.min(progress, 100)}%</p>
            </div>
          </div>
        </div>
        <TypingProgress players={liveRacePlayers} />
      </div>
    </GameShell>
  )
}

export default TypingRaceGame

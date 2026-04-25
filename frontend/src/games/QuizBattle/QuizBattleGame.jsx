import { useEffect, useMemo, useRef, useState } from 'react'
import EndGameScreen from '../../Components/EndGameScreen'
import GameShell from '../../Components/GameShell'
import GameLobby from '../../Components/Lobby/GameLobby'
import RoundTimer from '../../Components/Timer/RoundTimer'
import { gameTypeContent, quizBattleQuestions } from '../gameData'
import { useGameRoom } from '../useGameRoom'
import { useSoundEffects } from '../useSoundEffects'
import QuestionCard from './QuestionCard'

function QuizBattleGame({ roomState, onEndGame }) {
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
    emitRoomEvent,
    updateScore,
    endGame,
    setStatus,
  } = useGameRoom({ gameType: 'quiz', roomId: roomState?.room?.roomCode || 'year3-sem2-quiz' })

  const sounds = useSoundEffects()
  const [roundIndex, setRoundIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [answerStats, setAnswerStats] = useState({})
  const [fastestPlayer, setFastestPlayer] = useState('')
  const [timerKey, setTimerKey] = useState(0)
  const [roundComplete, setRoundComplete] = useState(false)
  const resolvedRoundRef = useRef(false)
  const currentQuestion = quizBattleQuestions[roundIndex]

  // In multiplayer: skip the internal lobby, start immediately
  useEffect(() => {
    if (isMultiplayer) {
      startGame()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultiplayer])

  // Build leaderboard with real player names in multiplayer
  const multiplayerLeaderboard = useMemo(() => {
    if (!isMultiplayer) return leaderboard
    const roomPlayers = roomState.room.players || []
    return roomPlayers
      .map((p) => ({
        id: p.userId,
        name: p.username,
        score: leaderboard.find((l) => l.id === p.userId)?.score ?? 0,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ ...p, rank: i + 1 }))
  }, [isMultiplayer, roomState, leaderboard])

  const displayLeaderboard = isMultiplayer ? multiplayerLeaderboard : leaderboard

  const resetRound = (nextRoundIndex = roundIndex) => {
    resolvedRoundRef.current = false
    setSelectedIndex(null)
    setRevealAnswer(false)
    setAnswerStats({})
    setFastestPlayer('')
    setRoundComplete(false)
    setTimerKey((previous) => previous + 1)
    setStatus(`Round ${nextRoundIndex + 1} started.`)
  }

  const goToNextRound = () => {
    if (roundIndex === quizBattleQuestions.length - 1) {
      endGame()
      return
    }

    const nextRoundIndex = roundIndex + 1
    emitRoomEvent('nextRound', { roundIndex: nextRoundIndex })
    setRoundIndex(nextRoundIndex)
    resetRound(nextRoundIndex)
  }

  const finishRound = () => {
    if (resolvedRoundRef.current) {
      return
    }

    resolvedRoundRef.current = true
    setRevealAnswer(true)
    setRoundComplete(true)
    sounds.playCountdown()
  }

  const handleSelect = (index) => {
    if (selectedIndex !== null || revealAnswer) {
      return
    }

    sounds.playClick()
    setSelectedIndex(index)
    setAnswerStats({ [index]: 1 })

    const isCorrect = index === currentQuestion.correctIndex

    emitRoomEvent('sendAnswer', {
      playerId: currentPlayerId,
      answerIndex: index,
      correct: isCorrect,
    })

    if (isCorrect) {
      updateScore(currentPlayerId, 150)
      setFastestPlayer('You')
      sounds.playSuccess()
    } else {
      sounds.playError()
    }

    finishRound()
  }

  const topBar = useMemo(
    () => (
      <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Scoring</p>
        <p className="mt-2 text-sm text-slate-300">Correct: 100 pts</p>
        <p className="text-sm text-slate-300">Answer bonus: +50 pts</p>
      </div>
    ),
    [],
  )

  // Only show internal lobby in solo mode
  if (phase === 'lobby' && !isMultiplayer) {
    return (
      <GameShell
        title={gameTypeContent.quiz.title}
        subtitle={gameTypeContent.quiz.subtitle}
        phase={phase}
        countdown={countdown}
        leaderboard={displayLeaderboard}
      >
        <GameLobby
          players={players}
          title={gameTypeContent.quiz.title}
          subtitle="Answer each SQL multiple-choice question without waiting for the timer after you choose."
          onStart={() => {
            setRoundIndex(0)
            resetRound(0)
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
        title={gameTypeContent.quiz.title}
        subtitle="Quiz finished. Review your score."
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
      title={gameTypeContent.quiz.title}
      subtitle={`Question ${roundIndex + 1} of ${quizBattleQuestions.length}.`}
      phase={phase}
      countdown={countdown}
      leaderboard={displayLeaderboard}
      topBar={topBar}
    >
      <RoundTimer
        duration={15}
        isRunning={phase === 'playing' && !roundComplete}
        onComplete={finishRound}
        resetKey={timerKey}
      />
      <QuestionCard
        question={currentQuestion}
        selectedIndex={selectedIndex}
        revealAnswer={revealAnswer}
        onSelect={handleSelect}
        stats={answerStats}
        fastestPlayer={fastestPlayer}
      />
      {revealAnswer ? (
        <div className="glass-card space-y-4 p-5 text-sm leading-7 text-slate-300">
          <div>
            <p className="font-semibold text-white">Correct Answer:</p>
            <p className="mt-2">{currentQuestion.options[currentQuestion.correctIndex]}</p>
            <p className="mt-3 text-slate-400">{currentQuestion.explanation}</p>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={goToNextRound} className="soft-button">
              {roundIndex === quizBattleQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      ) : null}
    </GameShell>
  )
}

export default QuizBattleGame

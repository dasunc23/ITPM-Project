import { useMemo, useRef, useState } from 'react'
import EndGameScreen from '../../components/EndGameScreen'
import GameShell from '../../components/GameShell'
import GameLobby from '../../components/Lobby/GameLobby'
import RoundTimer from '../../components/Timer/RoundTimer'
import { codingChallenges, gameTypeContent } from '../gameData'
import { useGameRoom } from '../useGameRoom'
import { useSoundEffects } from '../useSoundEffects'
import OutputPreview from './OutputPreview'

const normalizeSql = (sql) => sql.trim().replace(/\s+/g, ' ').toLowerCase()

function CodingChallengeGame() {
  const {
    currentPlayerId,
    phase,
    countdown,
    players,
    leaderboard,
    isHost,
    startGame,
    emitRoomEvent,
    updateScore,
    endGame,
    playAgain,
    setStatus,
  } = useGameRoom({ gameType: 'coding', roomId: 'year3-sem2-coding' })

  const sounds = useSoundEffects()
  const [roundIndex, setRoundIndex] = useState(0)
  const [query, setQuery] = useState(codingChallenges[0].starter)
  const [preview, setPreview] = useState({
    columns: codingChallenges[0].previewColumns,
    rows: codingChallenges[0].previewRows,
    status: 'Sample result',
  })
  const [submitted, setSubmitted] = useState(false)
  const [roundComplete, setRoundComplete] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const scoredRoundIdsRef = useRef(new Set())
  const challenge = codingChallenges[roundIndex]

  const prepareRound = (nextRoundIndex = roundIndex) => {
    const nextChallenge = codingChallenges[nextRoundIndex]
    setQuery(nextChallenge.starter)
    setPreview({
      columns: nextChallenge.previewColumns,
      rows: nextChallenge.previewRows,
      status: 'Sample result',
    })
    setSubmitted(false)
    setRoundComplete(false)
    setTimerKey((previous) => previous + 1)
    setStatus(`Challenge ${nextRoundIndex + 1} is live.`)
  }

  const goToNextRound = () => {
    if (roundIndex === codingChallenges.length - 1) {
      endGame()
      return
    }

    const nextRoundIndex = roundIndex + 1
    emitRoomEvent('nextRound', { roundIndex: nextRoundIndex })
    setRoundIndex(nextRoundIndex)
    prepareRound(nextRoundIndex)
  }

  const runQuery = () => {
    sounds.playClick()
    const looksLikeSelect = normalizeSql(query).startsWith('select')
    setPreview({
      columns: challenge.previewColumns,
      rows: looksLikeSelect ? challenge.previewRows : [['Syntax error or unsupported statement']],
      status: looksLikeSelect ? 'Execution preview' : 'Execution failed',
    })
  }

  const finishRound = () => {
    setRoundComplete(true)
  }

  const submitQuery = () => {
    if (submitted) {
      return
    }

    const normalized = normalizeSql(query)
    const isCorrect = challenge.acceptedAnswers.includes(normalized)

    if (!isCorrect) {
      sounds.playError()
      setPreview({
        columns: ['message'],
        rows: [['Query result does not match expected output']],
        status: 'Incorrect solution',
      })
      return
    }

    emitRoomEvent('sendAnswer', {
      playerId: currentPlayerId,
      challengeId: challenge.id,
      submittedAtRank: 1,
    })

    setSubmitted(true)
    setRoundComplete(true)

    if (!scoredRoundIdsRef.current.has(challenge.id)) {
      scoredRoundIdsRef.current.add(challenge.id)
      updateScore(currentPlayerId, 200)
    }

    sounds.playSuccess()
    setPreview({
      columns: challenge.previewColumns,
      rows: challenge.previewRows,
      status: 'Correct solution',
    })
  }

  const topBar = useMemo(
    () => (
      <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Scoring</p>
        <p className="mt-2 text-sm text-slate-300">Correct solution: 200 pts</p>
        <p className="text-sm text-slate-300">Move ahead as soon as you solve it</p>
      </div>
    ),
    [],
  )

  if (phase === 'lobby') {
    return (
      <GameShell
        title={gameTypeContent.coding.title}
        subtitle={gameTypeContent.coding.subtitle}
        phase={phase}
        countdown={countdown}
        leaderboard={leaderboard}
      >
        <GameLobby
          players={players}
          title={gameTypeContent.coding.title}
          subtitle="Solve SQL tasks, preview output, and continue instantly after a correct answer."
          onStart={() => {
            setRoundIndex(0)
            prepareRound(0)
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
        title={gameTypeContent.coding.title}
        subtitle="Coding challenge complete."
        phase={phase}
        countdown={countdown}
        leaderboard={leaderboard}
        topBar={topBar}
      >
        <EndGameScreen
          players={leaderboard}
          onPlayAgain={() => {
            setRoundIndex(0)
            prepareRound(0)
            playAgain()
          }}
          winnerLabel="Final Score"
        />
      </GameShell>
    )
  }

  return (
    <GameShell
      title={gameTypeContent.coding.title}
      subtitle={challenge.title}
      phase={phase}
      countdown={countdown}
      leaderboard={leaderboard}
      topBar={topBar}
    >
      <RoundTimer
        duration={40}
        isRunning={phase === 'playing' && !roundComplete}
        onComplete={finishRound}
        resetKey={timerKey}
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">{challenge.title}</h2>
            {submitted ? (
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                Solved
              </span>
            ) : null}
          </div>
          <p className="text-sm leading-7 text-slate-300">{challenge.prompt}</p>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Expected fields</p>
            <p className="mt-3 text-sm text-slate-200">{challenge.previewColumns.join(', ')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">SQL Editor</h3>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                Modern Practice
              </span>
            </div>
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-[260px] w-full rounded-2xl border border-white/10 bg-[#101827] p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-indigo-400/50"
              spellCheck="false"
            />
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={runQuery} className="outline-button">
                Run Query
              </button>
              <button type="button" onClick={submitQuery} disabled={submitted} className="soft-button">
                Submit Solution
              </button>
              {roundComplete ? (
                <button type="button" onClick={goToNextRound} className="outline-button">
                  {roundIndex === codingChallenges.length - 1 ? 'Finish Challenge' : 'Next Challenge'}
                </button>
              ) : null}
            </div>
          </div>

          <OutputPreview columns={preview.columns} rows={preview.rows} status={preview.status} />
        </div>
      </div>
    </GameShell>
  )
}

export default CodingChallengeGame

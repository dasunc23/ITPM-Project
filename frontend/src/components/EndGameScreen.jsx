import { motion } from 'framer-motion'

function EndGameScreen({ players, onEndGame, winnerLabel = 'Winner', isHost = true }) {
  const winner = players[0]

  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-col justify-between gap-6 p-6 sm:p-8"
      >
        <div>
          <span className="badge">Match Complete</span>
          <h2 className="mt-4 text-3xl font-semibold text-white">{winnerLabel}</h2>
          <p className="mt-3 text-5xl font-bold text-white">{winner?.name}</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {winner?.score} points earned through speed, accuracy, and clean decision-making.
          </p>
        </div>

        {isHost ? (
          <button
            type="button"
            onClick={onEndGame}
            className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:opacity-90 active:scale-95"
          >
            End Game 🏁
          </button>
        ) : (
          <p className="text-center text-sm text-slate-400">
            Waiting for host to end the game...
          </p>
        )}
      </motion.div>

      <div className="glass-card space-y-4 p-6 sm:p-8">
        <h3 className="text-2xl font-semibold text-white">Final Scoreboard</h3>
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
            >
              <div>
                <p className="text-lg font-semibold text-white">
                  #{player.rank} {player.name}
                </p>
                <p className="text-sm text-slate-400">{player.rank === 1 ? 'Champion' : 'Competitor'}</p>
              </div>
              <p className="text-lg font-semibold text-indigo-100">{player.score} pts</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EndGameScreen

import { motion } from 'framer-motion'

function GameLobby({ players, title, subtitle, onStart }) {
  const player = players[0]

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="glass-card space-y-6 p-6 sm:p-8">
        <div>
          <span className="badge">Single Player Mode</span>
          <h2 className="mt-4 text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{subtitle}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${player.accent} text-xl font-bold text-white`}>
            {player.avatar}
          </div>
          <div className="mt-4">
            <p className="text-xl font-semibold text-white">{player.name}</p>
            <p className="mt-1 text-sm text-slate-400">Solo run enabled</p>
          </div>
        </motion.div>
      </div>

      <div className="glass-card flex flex-col justify-between gap-6 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Mode</p>
          <p className="mt-3 text-4xl font-semibold text-white">1 Player</p>
          <p className="mt-2 text-sm text-slate-300">Start instantly and focus on your own score and progress.</p>
        </div>

        <button type="button" onClick={onStart} className="soft-button w-full">
          Start Game
        </button>
      </div>
    </section>
  )
}

export default GameLobby

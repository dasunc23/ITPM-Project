import { motion } from 'framer-motion'

function TypingProgress({ players }) {
  return (
    <div className="glass-card space-y-4 p-5">
      <h3 className="text-lg font-semibold text-white">Progress Track</h3>
      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{player.name}</span>
              <span>{player.progress}%</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${player.progress}%` }}
              />
              <motion.div
                animate={{ left: `${player.progress}%` }}
                transition={{ duration: 0.25 }}
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/25 shadow-lg shadow-indigo-500/30"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TypingProgress

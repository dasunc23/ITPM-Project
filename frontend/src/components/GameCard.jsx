import { Link } from 'react-router-dom'

function GameCard({ game, moduleItem, year = 3, semester = 2 }) {
  return (
    <Link
      to={`/student-games/play/${game.type}`}
      state={{ game, module: moduleItem, year, semester }}
      className="glass-card glass-card-hover group overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          {game.type}
        </span>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">{game.name}</h3>
          <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-indigo-100">
            {game.difficulty}
          </span>
        </div>

        <p className="text-sm leading-7 text-slate-300">{game.description}</p>

        <div className="soft-button w-full">
          Play Now
        </div>
      </div>
    </Link>
  )
}

export default GameCard

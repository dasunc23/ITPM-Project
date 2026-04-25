import { Link } from 'react-router-dom'

function SemesterCard({ year, semester, isActive }) {
  return (
    <Link
      to={`/student-games/year/${year}/semester/${semester}`}
      className="glass-card glass-card-hover group flex min-h-48 flex-col justify-between p-6 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="badge">Semester {semester}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            isActive ? 'bg-emerald-400/15 text-emerald-200' : 'bg-white/5 text-slate-400'
          }`}
        >
          {isActive ? 'Available' : 'Coming soon'}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-white">Semester {semester}</h3>
        <p className="text-sm leading-7 text-slate-300">
          Browse learning modules and launch game-based revision sessions for this semester.
        </p>
      </div>

      <div className="text-sm font-medium text-fuchsia-300 transition-transform duration-300 group-hover:translate-x-1">
        View modules →
      </div>
    </Link>
  )
}

export default SemesterCard

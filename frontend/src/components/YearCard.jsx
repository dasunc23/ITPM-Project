import { Link } from 'react-router-dom'

function YearCard({ year, isFeatured }) {
  return (
    <Link
      to={`/student-games/year/${year}`}
      className="glass-card glass-card-hover group flex min-h-56 flex-col justify-between overflow-hidden p-6 text-left"
    >
      <div className="flex items-center justify-between">
        <span className="badge">{isFeatured ? 'Featured Track' : 'Academic Year'}</span>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {year === 3 ? 'Live now' : 'Preview'}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-white">Year {year}</h3>
        <p className="text-sm leading-7 text-slate-300">
          Explore semester-based modules and multiplayer learning games designed for collaborative practice.
        </p>
      </div>

      <div className="flex items-center justify-between text-sm font-medium text-fuchsia-300">
        <span>Open year</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
      </div>
    </Link>
  )
}

export default YearCard

import { Link } from 'react-router-dom'

function ModuleCard({ moduleItem, year, semester }) {
  return (
    <Link
      to={`/module/${moduleItem._id}`}
      state={{ module: moduleItem, year, semester }}
      className="glass-card glass-card-hover group flex min-h-52 flex-col justify-between p-6 text-left"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="badge">{moduleItem.code}</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
          {moduleItem.name === 'Data Systems' ? 'Core module' : 'Module'}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-white">{moduleItem.name}</h3>
        <p className="text-sm leading-7 text-slate-300">
          Multiplayer gameplay, SQL-focused challenges, and collaborative database learning activities.
        </p>
      </div>

      <div className="flex items-center justify-between text-sm font-medium text-indigo-100">
        <span>Open games</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
      </div>
    </Link>
  )
}

export default ModuleCard

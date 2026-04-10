function LeaderboardSidebar({ players, title = 'Your Score' }) {
  const player = players[0]

  return (
    <aside className="glass-card h-fit space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="badge">Solo</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-5">
        <p className="text-sm text-slate-400">{player?.name}</p>
        <p className="mt-3 text-4xl font-semibold text-white">{player?.score ?? 0}</p>
        <p className="mt-2 text-sm text-slate-300">points earned in this run</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
        <p className="text-sm text-slate-400">Rank</p>
        <p className="mt-2 text-2xl font-semibold text-indigo-100">#1</p>
      </div>
    </aside>
  )
}

export default LeaderboardSidebar

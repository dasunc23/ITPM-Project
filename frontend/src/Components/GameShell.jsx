import CountdownOverlay from './CountdownOverlay'
import LeaderboardSidebar from './Leaderboard/LeaderboardSidebar'

function GameShell({ title, subtitle, phase, countdown, leaderboard, children, topBar }) {
  return (
    <main className="app-shell">
      <CountdownOverlay show={phase === 'countdown'} value={countdown || 1} title="Match Starts In" />
      <div className="page-wrap gap-6">
        <section className="hero-panel">
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="badge">Single Player</span>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{subtitle}</p>
            </div>
            {topBar}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <section className="space-y-6">{children}</section>
          <LeaderboardSidebar players={leaderboard} />
        </div>
      </div>
    </main>
  )
}

export default GameShell

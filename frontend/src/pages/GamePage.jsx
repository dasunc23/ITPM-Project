import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import GameCard from '../components/GameCard'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import { getGames } from '../services/api'

function GamePage() {
  const { id } = useParams()
  const location = useLocation()
  const moduleData = location.state?.module
  const year = location.state?.year
  const semester = location.state?.semester

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getGames({
          moduleId: id,
          moduleName: moduleData?.name,
        })
        setGames(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch games.')
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [id, moduleData?.name])

  return (
    <main className="app-shell">
      <div className="page-wrap gap-8">
        <PageHeader
          eyebrow={moduleData?.code || 'Module Games'}
          title={moduleData?.name || 'Student Multiplayer Games'}
          description="Launch SQL quizzes, coding rounds, schema memory challenges, and typing races from one multiplayer game hub."
          backTo={year && semester ? `/student-games/year/${year}/semester/${semester}` : '/student-games'}
          backLabel={year && semester ? 'Back to modules' : 'Back to games home'}
        />

        {moduleData ? (
          <div className="glass-card flex flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm text-slate-400">Active module</p>
              <p className="text-lg font-semibold text-white">
                {moduleData.name} ({moduleData.code})
              </p>
            </div>
            <Link to="/student-games" className="outline-button">
              Explore another year
            </Link>
          </div>
        ) : null}

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">Available Games</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
              {games.length} games
            </span>
          </div>

          {loading ? <LoadingSpinner label="Loading games..." /> : null}
          {!loading && error ? <ErrorState message={error} /> : null}

          {!loading && !error && games.length === 0 ? (
            <div className="status-box">
              <p className="text-lg font-semibold text-white">No games found for this module.</p>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                Run the backend seed script to insert Data Systems and its four SQL-based multiplayer games.
              </p>
            </div>
          ) : null}

          {!loading && !error && games.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {games.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default GamePage

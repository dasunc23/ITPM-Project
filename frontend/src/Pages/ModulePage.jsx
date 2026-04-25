import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../Components/ErrorState'
import GameCard from '../Components/GameCard'
import LoadingSpinner from '../Components/LoadingSpinner'
import PageHeader from '../Components/PageHeader'
import { semesterTwoFallbackGames, semesterTwoFallbackModule } from '../games/gameData'
import { getGames, getModules } from '../services/api'

function ModulePage() {
  const { year, sem } = useParams()
  const [moduleItem, setModuleItem] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const shouldUseFallback = Number(year) === 3 && Number(sem) === 2
  const visibleModule = moduleItem || (shouldUseFallback ? semesterTwoFallbackModule : null)
  const visibleGames = games.length > 0 ? games : shouldUseFallback ? semesterTwoFallbackGames : []

  useEffect(() => {
    const loadSemesterContent = async () => {
      try {
        setLoading(true)
        setError('')
        setGames([])
        setModuleItem(null)

        const moduleData = await getModules(year, sem)
        const dataSystemsModule = moduleData.find((item) => item.name === 'Data Systems') || moduleData[0]
        setModuleItem(dataSystemsModule || null)

        if (dataSystemsModule?._id) {
          const gameData = await getGames({
            moduleId: dataSystemsModule._id,
          })
          setGames(gameData)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch semester content.')
      } finally {
        setLoading(false)
      }
    }

    loadSemesterContent()
  }, [year, sem])

  return (
    <div className="min-h-screen bg-[#040b1d]">
      {/* Main Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-[#a855f7]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/home" className="text-2xl font-bold text-[#a855f7]">GameHub</Link>
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-white hover:text-[#a855f7] transition-colors text-sm">Home</Link>
              <Link to="/student-games" className="text-[#a855f7] hover:text-[#ec4899] transition-colors text-sm font-semibold">Games</Link>
              <Link to="/dashboard" className="text-white hover:text-[#a855f7] transition-colors text-sm">Dashboard</Link>
              <Link to="/payment" className="text-white hover:text-[#a855f7] transition-colors text-sm">Payment</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="app-shell pt-20">
      <div className="page-wrap gap-8">
        <PageHeader
          eyebrow={`Year ${year} / Semester ${sem}`}
          title="Year 3 Semester 2 Games"
          description="This page is connected to the Data Systems game flow for Year 3 Semester 2."
          backTo={`/student-games/year/${year}`}
          backLabel="Back to semesters"
        />

        {loading ? <LoadingSpinner label="Loading Year 3 Semester 2 games..." /> : null}
        {!loading && error && !shouldUseFallback ? <ErrorState message={error} /> : null}

        {!loading && !visibleModule ? (
          <div className="status-box">
            <p className="text-lg font-semibold text-white">Data Systems module not found.</p>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Seed the backend so Year 3 Semester 2 contains the Data Systems module and its game list.
            </p>
          </div>
        ) : null}

        {!loading && visibleModule ? (
          <section className="glass-card space-y-4 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  {moduleItem ? 'Connected backend module' : 'Semester 2 module'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{visibleModule.name}</h2>
              </div>
              <span className="badge">{visibleModule.code}</span>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              {moduleItem
                ? 'All games below are loaded from the backend for the Data Systems module in Year 3 Semester 2.'
                : 'The four Data Systems games are shown here for Year 3 Semester 2 while backend data is unavailable.'}
            </p>
          </section>
        ) : null}

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">Games</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
              {visibleGames.length} game{visibleGames.length === 1 ? '' : 's'}
            </span>
          </div>

          {!loading && visibleGames.length === 0 ? (
            <div className="status-box">
              <p className="text-lg font-semibold text-white">No games available yet.</p>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                Seed the backend to load SQL Quiz Battle, SQL Coding Challenge, Schema Memory Match, and SQL Typing Race.
              </p>
            </div>
          ) : null}

          {!loading && visibleGames.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {visibleGames.map((game) => (
                <GameCard
                  key={game._id}
                  game={game}
                  moduleItem={visibleModule}
                  year={Number(year)}
                  semester={Number(sem)}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
    </div>
  )
}

export default ModulePage

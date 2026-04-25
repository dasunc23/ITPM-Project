import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGameAccessStatus } from '../services/api'

function GameCard({ game, moduleItem, year = 3, semester = 2 }) {
  const navigate = useNavigate()
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)
  const [error, setError] = useState('')

  const handlePlayClick = async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null')

    if (!user?._id) {
      navigate('/login')
      return
    }

    const createRoomPath = `/create?game=${game.type}&gameName=${encodeURIComponent(game.name)}`
    const navigationState = { game, module: moduleItem, year, semester }

    setIsCheckingAccess(true)
    setError('')

    try {
      const access = await getGameAccessStatus(user._id)

      if (access.requiresPayment) {
        navigate('/payment', {
          state: {
            source: 'game-entry',
            access,
            game,
            module: moduleItem,
            year,
            semester,
            returnTo: createRoomPath,
            returnState: navigationState,
          },
        })
        return
      }

      navigate(createRoomPath, { state: navigationState })
    } catch (err) {
      const access = err.response?.data?.access

      if (err.response?.status === 403 && access?.requiresPayment) {
        navigate('/payment', {
          state: {
            source: 'game-entry',
            access,
            game,
            module: moduleItem,
            year,
            semester,
            returnTo: createRoomPath,
            returnState: navigationState,
          },
        })
        return
      }

      setError(err.response?.data?.message || 'Unable to check game access right now.')
    } finally {
      setIsCheckingAccess(false)
    }
  }

  return (
    <div className="glass-card glass-card-hover group overflow-hidden">
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
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="button"
          onClick={handlePlayClick}
          disabled={isCheckingAccess}
          className="soft-button w-full text-left disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCheckingAccess ? 'Checking access...' : 'Play Now'}
        </button>
      </div>
    </div>
  )
}

export default GameCard

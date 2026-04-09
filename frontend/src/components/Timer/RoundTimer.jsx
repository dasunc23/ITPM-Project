import { useEffect, useRef, useState } from 'react'

function RoundTimer({ duration, isRunning, onComplete, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const completeRef = useRef(false)

  useEffect(() => {
    setTimeLeft(duration)
    completeRef.current = false
  }, [duration, resetKey])

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setTimeLeft((previous) => {
        const nextValue = Math.max(previous - 1, 0)

        if (nextValue === 0 && !completeRef.current) {
          completeRef.current = true
          window.setTimeout(() => onComplete?.(), 0)
        }

        return nextValue
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning, onComplete])

  const percentage = Math.max((timeLeft / duration) * 100, 0)

  return (
    <div className="glass-card space-y-3 p-4">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>Round Timer</span>
        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white">{timeLeft}s</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default RoundTimer

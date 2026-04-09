import { useCallback, useRef } from 'react'

const createTone = (frequency, duration = 0.08) => {
  const context = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.value = 0.02
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration)
}

export const useSoundEffects = () => {
  const enabledRef = useRef(true)

  const safePlay = useCallback((frequency) => {
    try {
      if (enabledRef.current && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        createTone(frequency)
      }
    } catch {
      enabledRef.current = false
    }
  }, [])

  return {
    playClick: () => safePlay(360),
    playSuccess: () => safePlay(620),
    playError: () => safePlay(180),
    playCountdown: () => safePlay(440),
  }
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getSocket } from '../services/socket'
import { multiplayerPlayers } from './gameData'

const clonePlayers = () => multiplayerPlayers.map((player) => ({ ...player }))

export const useGameRoom = ({ gameType, roomId }) => {
  const currentPlayerId = 'p1'
  const [phase, setPhase] = useState('lobby')
  const [countdown, setCountdown] = useState(3)
  const [players, setPlayers] = useState(clonePlayers)
  const [status, setStatus] = useState('Ready to start.')
  const socketRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const roomCode = roomId || `ds-${gameType}-solo`

  const leaderboard = useMemo(
    () =>
      [...players]
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
        .map((player, index) => ({ ...player, rank: index + 1 })),
    [players],
  )

  useEffect(() => {
    const socket = getSocket()
    socketRef.current = socket
    socket.emit('joinRoom', { roomId: roomCode, gameType, playerId: currentPlayerId, mode: 'solo' })

    const handleScore = ({ playerId, score }) => {
      setPlayers((previous) =>
        previous.map((player) => (player.id === playerId ? { ...player, score } : player)),
      )
    }

    socket.on('updateScore', handleScore)

    return () => {
      socket.off('updateScore', handleScore)
      clearInterval(countdownIntervalRef.current)
    }
  }, [gameType, roomCode])

  const emitRoomEvent = useCallback(
    (eventName, payload = {}) => {
      socketRef.current?.emit(eventName, {
        roomId: roomCode,
        gameType,
        ...payload,
      })
    },
    [gameType, roomCode],
  )

  const updateScore = useCallback(
    (playerId, delta) => {
      setPlayers((previous) => {
        const nextPlayers = previous.map((player) =>
          player.id === playerId ? { ...player, score: player.score + delta } : player,
        )
        const changedPlayer = nextPlayers.find((player) => player.id === playerId)
        emitRoomEvent('updateScore', {
          playerId,
          score: changedPlayer?.score ?? 0,
        })
        return nextPlayers
      })
    },
    [emitRoomEvent],
  )

  const setAbsoluteScore = useCallback(
    (playerId, score) => {
      setPlayers((previous) => {
        const nextPlayers = previous.map((player) =>
          player.id === playerId ? { ...player, score } : player,
        )
        emitRoomEvent('updateScore', { playerId, score })
        return nextPlayers
      })
    },
    [emitRoomEvent],
  )

  const startGame = useCallback(() => {
    setPhase('countdown')
    setCountdown(3)
    setStatus('Countdown started.')
    emitRoomEvent('startGame', { playerId: currentPlayerId })
    clearInterval(countdownIntervalRef.current)
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(countdownIntervalRef.current)
          setPhase('playing')
          setStatus('Game in progress.')
          return 0
        }
        return previous - 1
      })
    }, 1000)
  }, [currentPlayerId, emitRoomEvent])

  const endGame = useCallback(() => {
    setPhase('finished')
    emitRoomEvent('endGame', {
      scoreboard: players.map(({ id, score }) => ({ id, score })),
    })
  }, [emitRoomEvent, players])

  const playAgain = useCallback(() => {
    clearInterval(countdownIntervalRef.current)
    setPlayers(clonePlayers)
    setPhase('lobby')
    setCountdown(3)
    setStatus('Ready for another run.')
  }, [])

  return {
    currentPlayerId,
    phase,
    countdown,
    players,
    leaderboard,
    status,
    roomCode,
    isHost: true,
    setPlayerReady: () => {},
    startGame,
    emitRoomEvent,
    updateScore,
    setAbsoluteScore,
    endGame,
    playAgain,
    setStatus,
  }
}

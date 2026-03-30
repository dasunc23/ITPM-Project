import React from 'react';

const PlayerList = ({ players, hostId }) => {
  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <div
          key={player._id}
          className="flex items-center justify-between bg-slate-700 rounded-xl px-4 py-3 border border-slate-600"
          style={{ animation: `fadeIn 0.3s ease ${index * 0.1}s both` }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {player.username.charAt(0).toUpperCase()}
            </div>
            {/* Username */}
            <span className="text-white font-medium">{player.username}</span>
          </div>

          {/* Host / Player Badge */}
          {player.isHost ? (
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              👑 HOST
            </span>
          ) : (
            <span className="bg-slate-600 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">
              Player
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
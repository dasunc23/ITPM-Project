import React from 'react';

const PlayerList = ({ players }) => {
  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <div
          key={player.id || index}
          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${index % 2 === 0 ? 'from-[#a855f7] to-[#ec4899]' : 'from-[#6366f1] to-[#a855f7]'}`}>
              {player.username ? player.username.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{player.username || 'Anonymous Player'}</p>
              <p className="text-xs text-slate-400">{player.isHost ? 'Host' : 'Ready'}</p>
            </div>
          </div>
          {player.isHost && (
            <span className="px-2 py-1 rounded-md bg-[#a855f7]/20 text-[#a855f7] text-[10px] font-bold uppercase tracking-wider">
              Host
            </span>
          )}
        </div>
      ))}
      {players.length === 0 && (
        <div className="text-center py-6 text-slate-500 text-sm">
          No players in lobby yet...
        </div>
      )}
    </div>
  );
};

export default PlayerList;

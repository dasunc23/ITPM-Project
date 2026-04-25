import React from 'react';

/**
 * PlayerList Component
 * Displays a list of players in a game lobby with a premium aesthetic.
 */
const PlayerList = ({ players = [] }) => {
  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {players.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-white/5 rounded-xl border border-dashed border-white/10">
          No players have joined yet...
        </div>
      ) : (
        players.map((player, index) => (
          <div
            key={player.id || index}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#a855f7]/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              {/* Avatar with dynamic gradient */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${
                index % 3 === 0 ? 'bg-gradient-to-br from-[#a855f7] to-[#6366f1]' :
                index % 3 === 1 ? 'bg-gradient-to-br from-[#ec4899] to-[#f43f5e]' :
                'bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]'
              }`}>
                {(player.username || player.name || 'P')?.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <p className="font-semibold text-white flex items-center gap-2">
                  {player.username || player.name || `Player ${index + 1}`}
                  {player.isHost && (
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30 font-bold tracking-tighter">
                      HOST
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Ready to play</p>
                </div>
              </div>
            </div>
            
            {/* Online Status Indicator */}
            <div className="flex flex-col items-end gap-1">
              <div className="px-2 py-0.5 rounded-md bg-[#10b981]/10 border border-[#10b981]/20 group-hover:bg-[#10b981]/20 transition-colors">
                <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
        ))
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PlayerList;

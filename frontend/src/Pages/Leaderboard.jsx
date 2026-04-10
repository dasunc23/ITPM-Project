import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const GAME_OPTIONS = [
  "All Games",
  "Quiz Battle",
  "Typing Speed",
  "Coding Arena",
  "Memory Match",
];

const Leaderboard = () => {
  // Dummy data (replace with API later)
  const leaderboardRows = useMemo(
    () => [
      { id: "q1", game: "Quiz Battle", rank: 1, username: "AlexGamer", wins: 38, points: 2450 },
      { id: "q2", game: "Quiz Battle", rank: 2, username: "QuizMaster", wins: 35, points: 2380 },
      { id: "q3", game: "Quiz Battle", rank: 3, username: "BrainBoost", wins: 20, points: 2010 },
      { id: "t1", game: "Typing Speed", rank: 1, username: "TypeFast", wins: 44, points: 2600 },
      { id: "t2", game: "Typing Speed", rank: 2, username: "RapidFire", wins: 39, points: 2410 },
      { id: "t3", game: "Typing Speed", rank: 3, username: "AceStudent", wins: 24, points: 2140 },
      { id: "c1", game: "Coding Arena", rank: 1, username: "CodeNinja", wins: 32, points: 2320 },
      { id: "c2", game: "Coding Arena", rank: 2, username: "LogicLegend", wins: 23, points: 2105 },
      { id: "c3", game: "Coding Arena", rank: 3, username: "PixelPro", wins: 26, points: 2190 },
      { id: "m1", game: "Memory Match", rank: 1, username: "MemoryKing", wins: 29, points: 2250 },
      { id: "m2", game: "Memory Match", rank: 2, username: "SharpMind", wins: 21, points: 2055 },
      { id: "m3", game: "Memory Match", rank: 3, username: "FocusFox", wins: 18, points: 1975 },
    ],
    []
  );

  const [game, setGame] = useState("All Games");
  const [usernameQuery, setUsernameQuery] = useState("");
  const [minPoints, setMinPoints] = useState("");

  // Simple validations (client-side)
  const usernameError = useMemo(() => {
    if (!usernameQuery) return "";
    if (usernameQuery.length < 2) return "Username search must be at least 2 characters.";
    if (!/^[a-zA-Z0-9_ ]+$/.test(usernameQuery)) return "Username search can only contain letters, numbers, spaces, and underscore.";
    return "";
  }, [usernameQuery]);

  const minPointsError = useMemo(() => {
    if (minPoints === "") return "";
    const n = Number(minPoints);
    if (!Number.isFinite(n)) return "Minimum points must be a number.";
    if (!Number.isInteger(n)) return "Minimum points must be a whole number.";
    if (n < 0) return "Minimum points cannot be negative.";
    if (n > 100000) return "Minimum points is too large.";
    return "";
  }, [minPoints]);

  const filteredRows = useMemo(() => {
    const q = usernameQuery.trim().toLowerCase();
    const min = minPoints === "" ? null : Number(minPoints);

    return leaderboardRows
      .filter((r) => (game === "All Games" ? true : r.game === game))
      .filter((r) => (q ? r.username.toLowerCase().includes(q) : true))
      .filter((r) => (min == null ? true : r.points >= min))
      .sort((a, b) => {
        if (a.game !== b.game) return a.game.localeCompare(b.game);
        return a.rank - b.rank;
      });
  }, [game, leaderboardRows, minPoints, usernameQuery]);

  const visibleGames = useMemo(() => {
    if (game !== "All Games") return [game];
    return GAME_OPTIONS.filter((g) => g !== "All Games");
  }, [game]);

  return (
    <div className="min-h-screen bg-[#040b1d] text-white">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#a855f7]">GameHub</h1>
          <Link
            to="/home"
            className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white px-5 py-2 rounded-full font-semibold hover:opacity-95 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Leaderboard</h2>
          <p className="text-center text-gray-300 mb-8">
            Separate leaderboards for each game mode.
          </p>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="text-sm text-gray-300">Game</label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                >
                  {GAME_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300">Search username</label>
                <input
                  value={usernameQuery}
                  onChange={(e) => setUsernameQuery(e.target.value)}
                  placeholder="e.g. AlexGamer"
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                />
                {usernameError ? (
                  <p className="text-xs text-red-300 mt-2">{usernameError}</p>
                ) : null}
              </div>

              <div>
                <label className="text-sm text-gray-300">Minimum points</label>
                <input
                  value={minPoints}
                  onChange={(e) => setMinPoints(e.target.value)}
                  inputMode="numeric"
                  placeholder="e.g. 2000"
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                />
                {minPointsError ? (
                  <p className="text-xs text-red-300 mt-2">{minPointsError}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {visibleGames.map((g) => {
              const gameRows = filteredRows.filter((r) => r.game === g);
              return (
                <div key={g} className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-[#a855f7]">{g}</h3>
                    <span className="text-xs text-gray-300 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                      {gameRows.length} players
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Username</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Wins</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameRows.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-6 text-sm text-gray-300">
                              No results for this filter.
                            </td>
                          </tr>
                        ) : (
                          gameRows.map((player) => (
                            <tr key={player.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 text-sm text-white">#{player.rank}</td>
                              <td className="px-6 py-4 text-sm text-white">{player.username}</td>
                              <td className="px-6 py-4 text-sm text-gray-200">{player.wins}</td>
                              <td className="px-6 py-4 text-sm text-gray-200">{player.points}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;


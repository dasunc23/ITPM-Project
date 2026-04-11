import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Achievements = () => {
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch {
      return null;
    }
  }, []);

  const currentUserLabel =
    loggedInUser?.name || loggedInUser?.username || loggedInUser?.email || "You";

  // Dummy earned achievements (replace with API later)
  const earned = useMemo(
    () => [
      { id: "e1", title: "Gold Streak", game: "Quiz Battle", badge: "🥇", earnedAt: "2026-03-20", earnedBy: "AlexGamer" },
      { id: "e2", title: "Speed Typist", game: "Typing Speed", badge: "🥈", earnedAt: "2026-03-18", earnedBy: "QuizMaster" },
      { id: "e3", title: "First Win", game: "Memory Match", badge: "🥉", earnedAt: "2026-03-12", earnedBy: "MemoryKing" },
      { id: "e4", title: "Fast Thinker", game: "Quiz Battle", badge: "🥈", earnedAt: "2026-03-10", earnedBy: "CodeNinja" },
      { id: "e5", title: "Bug Hunter", game: "Coding Arena", badge: "🥇", earnedAt: "2026-03-05", earnedBy: "PixelPro" },
    ],
    []
  );

  const games = useMemo(() => {
    const unique = Array.from(new Set(earned.map((e) => e.game)));
    return ["All", ...unique];
  }, [earned]);

  const [gameFilter, setGameFilter] = useState("All");
  const [searchTitle, setSearchTitle] = useState("");

  // Validations
  const searchTitleError = useMemo(() => {
    if (!searchTitle) return "";
    if (searchTitle.trim().length < 2) return "Search must be at least 2 characters.";
    if (searchTitle.length > 40) return "Search is too long (max 40 characters).";
    return "";
  }, [searchTitle]);

  const filtered = useMemo(() => {
    const q = searchTitle.trim().toLowerCase();
    return earned
      .filter((e) => (gameFilter === "All" ? true : e.game === gameFilter))
      .filter((e) => (q ? e.title.toLowerCase().includes(q) : true));
  }, [earned, gameFilter, searchTitle]);

  const yourCount = useMemo(
    () => earned.filter((e) => e.earnedBy === currentUserLabel).length,
    [earned, currentUserLabel]
  );

  return (
    <div className="min-h-screen bg-[#040b1d] text-white">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#a855f7]">GameHub</h1>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-200">
              {yourCount} earned
            </span>
            <Link
              to="/home"
              className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white px-5 py-2 rounded-full font-semibold hover:opacity-95 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Achievements</h2>
          <p className="text-center text-gray-300 mb-8">
            Achievements earned in each game mode.
          </p>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Filter by game</label>
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                >
                  {games.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300">Search achievement</label>
                <input
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="e.g. Gold Streak"
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                />
                {searchTitleError ? (
                  <p className="text-xs text-red-300 mt-2">{searchTitleError}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="bg-white/10 border border-white/10 rounded-2xl p-6 text-gray-200">
                No achievements found for this filter.
              </div>
            ) : (
              filtered.map((a) => {
                const isYou = a.earnedBy === currentUserLabel;
                return (
                  <div
                    key={a.id}
                    className={
                      "bg-white/10 border border-white/10 rounded-2xl p-6 hover:scale-[1.01] transition-transform " +
                      (isYou ? "ring-2 ring-[#a855f7]/60" : "")
                    }
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{a.badge}</div>
                      <span className="text-xs px-3 py-1 rounded-full bg-black/30 border border-white/10 text-gray-200">
                        {a.game}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{a.title}</h3>
                    <p className="text-sm text-gray-300 mt-2">
                      Earned by{" "}
                      <span className={isYou ? "text-[#a855f7] font-semibold" : "text-white"}>
                        {a.earnedBy}
                      </span>{" "}
                      on {a.earnedAt}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievements;


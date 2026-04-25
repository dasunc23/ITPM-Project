import { motion } from 'framer-motion'

function QuestionCard({ question, selectedIndex, revealAnswer, onSelect, stats, fastestPlayer }) {
  return (
    <div className="glass-card space-y-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="badge">Level {question.level || 1}</span>
          <span className="text-xs text-slate-400">Question {question.level || 1} of 10</span>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-slate-300">
          Fastest: {fastestPlayer || 'Waiting...'}
        </span>
      </div>

      <h2 className="text-2xl font-semibold text-white sm:text-3xl">{question.prompt}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const isCorrect = revealAnswer && index === question.correctIndex
          const isWrongSelection = revealAnswer && selectedIndex === index && index !== question.correctIndex

          return (
            <motion.button
              key={option}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onSelect(index)}
              disabled={selectedIndex !== null || revealAnswer}
              className={`rounded-2xl border px-5 py-5 text-left transition ${
                isCorrect
                  ? 'border-emerald-400/50 bg-emerald-400/15 text-white'
                  : isWrongSelection
                    ? 'border-rose-400/50 bg-rose-400/15 text-white'
                    : selectedIndex === index
                      ? 'border-indigo-300/40 bg-indigo-500/15 text-white'
                      : 'border-white/10 bg-black/20 text-slate-100 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-base font-medium">{option}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  {stats[index] || 0}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionCard

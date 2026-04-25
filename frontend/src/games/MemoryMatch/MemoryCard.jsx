import { motion } from 'framer-motion'

const categoryColors = {
  'Primary Key': { bg: 'from-blue-500/30 to-indigo-500/20', border: 'border-blue-400/50', text: 'text-blue-200' },
  'Foreign Key': { bg: 'from-amber-500/30 to-orange-500/20', border: 'border-amber-400/50', text: 'text-amber-200' },
  'Relationship': { bg: 'from-emerald-500/30 to-teal-500/20', border: 'border-emerald-400/50', text: 'text-emerald-200' },
}

function MemoryCard({ card, isFlipped, isMatched, onClick }) {
  const category = card.category || 'Primary Key'
  const colors = categoryColors[category] || categoryColors['Primary Key']

  return (
    <motion.button
      whileHover={!isMatched ? { y: -4, scale: 1.02 } : undefined}
      type="button"
      onClick={onClick}
      className="relative aspect-[4/3] [perspective:1000px]"
    >
      <motion.div
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.45 }}
        className="relative h-full w-full rounded-2xl [transform-style:preserve-3d]"
      >
        {/* Card Back - Question Mark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-purple-500/20 text-3xl text-white [backface-visibility:hidden]">
          <span className="text-5xl font-bold text-white/60">?</span>
          <span className="mt-1 text-xs text-white/40">Schema Match</span>
        </div>
        
        {/* Card Front - Content */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          {/* Category Badge */}
          <span className={`mb-2 rounded-full border ${colors.border} px-2 py-0.5 text-[10px] uppercase tracking-wider ${colors.text}`}>
            {category}
          </span>
          
          {/* Card Label */}
          <span className={`text-sm font-bold leading-tight ${isMatched ? 'text-emerald-200' : 'text-white'}`}>
            {card.label}
          </span>
        </div>
      </motion.div>
    </motion.button>
  )
}

export default MemoryCard

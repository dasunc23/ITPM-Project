import { motion } from 'framer-motion'

function MemoryCard({ card, isFlipped, isMatched, onClick }) {
  return (
    <motion.button
      whileHover={!isMatched ? { y: -4 } : undefined}
      type="button"
      onClick={onClick}
      className="relative aspect-[4/3] [perspective:1000px]"
    >
      <motion.div
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.45 }}
        className="relative h-full w-full rounded-2xl [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/25 to-purple-500/20 text-3xl text-white [backface-visibility:hidden]">
          ?
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-4 text-center text-sm font-semibold text-slate-100 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className={isMatched ? 'text-emerald-200' : 'text-white'}>{card.label}</span>
        </div>
      </motion.div>
    </motion.button>
  )
}

export default MemoryCard

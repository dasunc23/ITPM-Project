import { AnimatePresence, motion } from 'framer-motion'

function CountdownOverlay({ show, value, title = 'Get Ready' }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
        >
          <motion.div
            key={value}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            className="glass-card flex h-56 w-56 flex-col items-center justify-center rounded-full text-center"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{title}</p>
            <p className="mt-3 text-7xl font-bold text-white">{value}</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default CountdownOverlay

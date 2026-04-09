function LoadingSpinner({ label = 'Loading content...' }) {
  return (
    <div className="status-box">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-indigo-400" />
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  )
}

export default LoadingSpinner

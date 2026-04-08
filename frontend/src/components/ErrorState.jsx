function ErrorState({ message }) {
  return (
    <div className="status-box">
      <div className="rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200">
        Unable to load data
      </div>
      <p className="max-w-md text-sm leading-7 text-slate-300">{message}</p>
    </div>
  )
}

export default ErrorState

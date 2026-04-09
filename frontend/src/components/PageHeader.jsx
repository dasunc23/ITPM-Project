import { Link } from 'react-router-dom'

function PageHeader({ eyebrow, title, description, backTo, backLabel }) {
  return (
    <div className="hero-panel">
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="badge">{eyebrow}</span>
          {backTo ? (
            <Link to={backTo} className="outline-button">
              {backLabel}
            </Link>
          ) : null}
        </div>

        <div className="space-y-4">
          <h1 className="section-title">{title}</h1>
          <p className="section-copy">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

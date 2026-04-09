import PageHeader from '../components/PageHeader'
import YearCard from '../components/YearCard'

const years = [1, 2, 3]

function HomePage() {
  return (
    <main className="app-shell">
      <div className="page-wrap gap-8">
        <PageHeader
          eyebrow="Student Multiplayer Game Platform"
          title="Choose your academic year and enter a game-driven learning space."
          description="Explore semester-based learning paths across the platform. Year 3 Semester 2 contains the Data Systems multiplayer games."
        />

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Academic Years</h2>
              <p className="mt-2 text-sm text-slate-300">
                Year 3 is the active track for the Data Systems multiplayer game experience.
              </p>
            </div>
          </div>

          <div className="card-grid">
            {years.map((year) => (
              <YearCard key={year} year={year} isFeatured={year === 3} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage

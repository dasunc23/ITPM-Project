import { Link } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import YearCard from '../Components/YearCard'

const years = [1, 2, 3]

function HomePage() {
  return (
    <div className="min-h-screen bg-[#040b1d]">
      {/* Main Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-[#a855f7]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/home" className="text-2xl font-bold text-[#a855f7]">GameHub</Link>
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-white hover:text-[#a855f7] transition-colors text-sm">Home</Link>
              <Link to="/student-games" className="text-[#a855f7] hover:text-[#ec4899] transition-colors text-sm font-semibold">Games</Link>
              <Link to="/dashboard" className="text-white hover:text-[#a855f7] transition-colors text-sm">Dashboard</Link>
              <Link to="/payment" className="text-white hover:text-[#a855f7] transition-colors text-sm">Payment</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="app-shell pt-20">
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
    </div>
  )
}

export default HomePage

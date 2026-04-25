import { Link, useParams } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import SemesterCard from '../Components/SemesterCard'

function SemesterPage() {
  const { year } = useParams()
  const semesterItems = [
    { semester: 1, isActive: false },
    { semester: 2, isActive: Number(year) === 3 },
  ]

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
            eyebrow={`Year ${year}`}
            title={`Select a semester for Year ${year}.`}
            description="This project uses two semesters only, and Semester 2 contains the Data Systems multiplayer quizzes and games."
            backTo="/student-games"
            backLabel="Back to home"
          />

          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-white">Semesters</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {semesterItems.map((item) => (
                <SemesterCard
                  key={item.semester}
                  year={year}
                  semester={item.semester}
                  isActive={item.isActive}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default SemesterPage

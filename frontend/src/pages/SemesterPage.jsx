import { useParams } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import SemesterCard from '../Components/SemesterCard'

function SemesterPage() {
  const { year } = useParams()
  const semesterItems = [
    { semester: 1, isActive: false },
    { semester: 2, isActive: Number(year) === 3 },
  ]

  return (
    <main className="app-shell">
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
  )
}

export default SemesterPage

export const multiplayerPlayers = [
  { id: 'p1', name: 'You', avatar: 'Y', isHost: true, score: 0, ready: true, accent: 'from-indigo-400 to-purple-500' },
]

export const quizBattleQuestions = [
  {
    id: 'q1',
    prompt: 'Which SQL clause is used to filter grouped records after aggregation?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'],
    correctIndex: 1,
    explanation: 'HAVING filters results after GROUP BY has already aggregated rows.',
  },
  {
    id: 'q2',
    prompt: 'Which JOIN returns all rows from the left table and matched rows from the right table?',
    options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'CROSS JOIN'],
    correctIndex: 2,
    explanation: 'LEFT JOIN keeps all records from the left side even when no match exists.',
  },
  {
    id: 'q3',
    prompt: 'Which query correctly counts the number of rows in the Enrollments table?',
    options: [
      'SELECT SUM(*) FROM Enrollments;',
      'SELECT COUNT(*) FROM Enrollments;',
      'SELECT TOTAL(*) FROM Enrollments;',
      'SELECT LENGTH(*) FROM Enrollments;',
    ],
    correctIndex: 1,
    explanation: 'COUNT(*) is the standard way to count all rows in a table.',
  },
]

export const codingChallenges = [
  {
    id: 'c1',
    title: 'Find all active students',
    prompt: 'Write a query to return student_id, full_name, and level from Students where status is ACTIVE ordered by full_name ascending.',
    starter: 'SELECT student_id, full_name, level\nFROM Students\nWHERE status = \'ACTIVE\'\nORDER BY full_name ASC;',
    acceptedAnswers: [
      "select student_id, full_name, level from students where status = 'active' order by full_name asc;",
      'select student_id, full_name, level from students where status="active" order by full_name asc;',
    ],
    previewColumns: ['student_id', 'full_name', 'level'],
    previewRows: [
      ['ST001', 'Alicia Fernando', 'L3'],
      ['ST014', 'Kavindu Perera', 'L3'],
      ['ST020', 'Mihiri Silva', 'L3'],
    ],
  },
  {
    id: 'c2',
    title: 'Count enrollments by module',
    prompt: 'Write a query to list module_code and total_enrollments from Enrollments grouped by module_code, sorted by total_enrollments descending.',
    starter: 'SELECT module_code, COUNT(*) AS total_enrollments\nFROM Enrollments\nGROUP BY module_code\nORDER BY total_enrollments DESC;',
    acceptedAnswers: [
      'select module_code, count(*) as total_enrollments from enrollments group by module_code order by total_enrollments desc;',
      'select module_code, count(*) total_enrollments from enrollments group by module_code order by total_enrollments desc;',
    ],
    previewColumns: ['module_code', 'total_enrollments'],
    previewRows: [
      ['DS301', '120'],
      ['SE304', '102'],
      ['CS320', '95'],
    ],
  },
]

export const memoryPairs = [
  { pairId: 'm1', left: 'Students', right: 'PK: student_id' },
  { pairId: 'm2', left: 'Modules', right: 'PK: module_code' },
  { pairId: 'm3', left: 'Enrollments', right: 'FK: student_id -> Students.student_id' },
  { pairId: 'm4', left: 'Results', right: 'FK: module_code -> Modules.module_code' },
  { pairId: 'm5', left: 'Lecturers', right: 'PK: lecturer_id' },
  { pairId: 'm6', left: 'Schedules', right: 'FK: lecturer_id -> Lecturers.lecturer_id' },
]

export const typingRacePrompts = [
  {
    id: 't1',
    title: 'Enrollment Summary Query',
    text: 'SELECT module_code, COUNT(*) AS total_enrollments FROM Enrollments GROUP BY module_code ORDER BY total_enrollments DESC;',
  },
]

export const gameTypeContent = {
  quiz: { title: 'SQL Quiz Battle', subtitle: 'Fastest correct answer wins the speed bonus.' },
  coding: { title: 'SQL Coding Challenge', subtitle: 'Write the correct query and submit before your rivals.' },
  memory: { title: 'Schema Memory Match', subtitle: 'Flip relationship cards and score table-key matches.' },
  typing: { title: 'SQL Typing Race', subtitle: 'Type the query cleanly and race other players to the finish line.' },
}

export const semesterTwoFallbackModule = {
  _id: 'data-systems-fallback',
  name: 'Data Systems',
  code: 'DS301',
}

export const semesterTwoFallbackGames = [
  {
    _id: 'fallback-quiz',
    name: 'SQL Quiz Battle',
    type: 'quiz',
    description: 'Compete in fast SQL theory rounds and beat your classmates on speed and accuracy.',
    difficulty: 'Intermediate',
    thumbnail:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'fallback-coding',
    name: 'SQL Coding Challenge',
    type: 'coding',
    description: 'Write live SQL queries to solve practical database problems under time pressure.',
    difficulty: 'Advanced',
    thumbnail:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'fallback-memory',
    name: 'Schema Memory Match',
    type: 'memory',
    description: 'Match tables, keys, and schema relationships in a visual multiplayer memory game.',
    difficulty: 'Beginner',
    thumbnail:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: 'fallback-typing',
    name: 'SQL Typing Race',
    type: 'typing',
    description: 'Race to type SQL commands correctly and finish complex query patterns before others.',
    difficulty: 'Intermediate',
    thumbnail:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  },
]

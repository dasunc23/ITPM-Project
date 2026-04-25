export const multiplayerPlayers = [
  { id: 'p1', name: 'You', avatar: 'Y', isHost: true, score: 0, ready: true, accent: 'from-indigo-400 to-purple-500' },
]

export const quizBattleQuestions = [
  // Level 1 - Basic SELECT
  {
    id: 'q1',
    level: 1,
    prompt: 'Which SQL clause is used to filter grouped records after aggregation?',
    options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'],
    correctIndex: 1,
    explanation: 'HAVING filters results after GROUP BY has already aggregated rows.',
  },
  // Level 2 - JOINs
  {
    id: 'q2',
    level: 2,
    prompt: 'Which JOIN returns all rows from the left table and matched rows from the right table?',
    options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'CROSS JOIN'],
    correctIndex: 2,
    explanation: 'LEFT JOIN keeps all records from the left side even when no match exists.',
  },
  // Level 3 - COUNT
  {
    id: 'q3',
    level: 3,
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
  // Level 4 - DISTINCT
  {
    id: 'q4',
    level: 4,
    prompt: 'Which keyword eliminates duplicate rows from query results?',
    options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'REMOVE'],
    correctIndex: 1,
    explanation: 'DISTINCT removes duplicate values from the result set.',
  },
  // Level 5 - ORDER BY
  {
    id: 'q5',
    level: 5,
    prompt: 'How do you sort results in descending order?',
    options: ['SORT BY', 'ORDER BY DESC', 'ORDER DESC', 'SORT DESC'],
    correctIndex: 1,
    explanation: 'ORDER BY column DESC sorts in descending order (highest to lowest).',
  },
  // Level 6 - GROUP BY
  {
    id: 'q6',
    level: 6,
    prompt: 'Which clause groups rows that have the same values into summary rows?',
    options: ['GROUP BY', 'AGGREGATE BY', 'COLLECT BY', 'COMBINE BY'],
    correctIndex: 0,
    explanation: 'GROUP BY groups rows with the same values into summary rows.',
  },
  // Level 7 - Subqueries
  {
    id: 'q7',
    level: 7,
    prompt: 'What is a subquery?',
    options: [
      'A query inside another query',
      'A query that deletes data',
      'A query that updates data',
      'A query that creates a table',
    ],
    correctIndex: 0,
    explanation: 'A subquery is a query nested inside another query, often in WHERE or FROM clause.',
  },
  // Level 8 - NULL values
  {
    id: 'q8',
    level: 8,
    prompt: 'Which operator checks if a value is NULL?',
    options: ['= NULL', 'IS NULL', 'NULL()', 'CHECK NULL'],
    correctIndex: 1,
    explanation: 'IS NULL checks for NULL values; = NULL will not work correctly.',
  },
  // Level 9 - Aggregate functions
  {
    id: 'q9',
    level: 9,
    prompt: 'Which aggregate function calculates the average value of a numeric column?',
    options: ['SUM()', 'AVG()', 'MEAN()', 'AVERAGE()'],
    correctIndex: 1,
    explanation: 'AVG() calculates the arithmetic mean of a numeric column.',
  },
  // Level 10 - Complex JOIN
  {
    id: 'q10',
    level: 10,
    prompt: 'Which JOIN returns only the rows where there is a match in both tables?',
    options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'],
    correctIndex: 2,
    explanation: 'INNER JOIN returns only the rows with matching values in both tables.',
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
  // Level 1 - Primary Keys (9 pairs total for the level)
  { pairId: 'm1', left: 'Students', right: 'PK: student_id (UUID)', category: 'Primary Key' },
  { pairId: 'm2', left: 'Modules', right: 'PK: module_code (VARCHAR)', category: 'Primary Key' },
  { pairId: 'm3', left: 'Enrollments', right: 'PK: enrollment_id (SERIAL)', category: 'Primary Key' },
  { pairId: 'm4', left: 'Results', right: 'PK: result_id (SERIAL)', category: 'Primary Key' },
  { pairId: 'm5', left: 'Lecturers', right: 'PK: lecturer_id (UUID)', category: 'Primary Key' },
  { pairId: 'm6', left: 'Schedules', right: 'PK: schedule_id (SERIAL)', category: 'Primary Key' },
  { pairId: 'm7', left: 'Courses', right: 'PK: course_id (VARCHAR)', category: 'Primary Key' },
  { pairId: 'm8', left: 'Departments', right: 'PK: dept_id (SERIAL)', category: 'Primary Key' },
  { pairId: 'm9', left: 'Programs', right: 'PK: program_id (SERIAL)', category: 'Primary Key' },
]

// Level configurations for Schema Memory Match
export const memoryLevels = [
  {
    level: 1,
    title: 'Primary Keys',
    description: 'Match table names with their Primary Key definitions',
    pairs: [
      { pairId: 'l1-m1', left: 'Students', right: 'PK: student_id (UUID)', category: 'Primary Key' },
      { pairId: 'l1-m2', left: 'Modules', right: 'PK: module_code (VARCHAR)', category: 'Primary Key' },
      { pairId: 'l1-m3', left: 'Enrollments', right: 'PK: enrollment_id (SERIAL)', category: 'Primary Key' },
      { pairId: 'l1-m4', left: 'Results', right: 'PK: result_id (SERIAL)', category: 'Primary Key' },
      { pairId: 'l1-m5', left: 'Lecturers', right: 'PK: lecturer_id (UUID)', category: 'Primary Key' },
      { pairId: 'l1-m6', left: 'Schedules', right: 'PK: schedule_id (SERIAL)', category: 'Primary Key' },
      { pairId: 'l1-m7', left: 'Courses', right: 'PK: course_id (VARCHAR)', category: 'Primary Key' },
      { pairId: 'l1-m8', left: 'Departments', right: 'PK: dept_id (SERIAL)', category: 'Primary Key' },
      { pairId: 'l1-m9', left: 'Programs', right: 'PK: program_id (SERIAL)', category: 'Primary Key' },
    ],
  },
  {
    level: 2,
    title: 'Foreign Keys',
    description: 'Match tables with their Foreign Key relationships',
    pairs: [
      { pairId: 'l2-m1', left: 'Enrollments', right: 'FK: student_id → Students', category: 'Foreign Key' },
      { pairId: 'l2-m2', left: 'Enrollments', right: 'FK: module_code → Modules', category: 'Foreign Key' },
      { pairId: 'l2-m3', left: 'Results', right: 'FK: enrollment_id → Enrollments', category: 'Foreign Key' },
      { pairId: 'l2-m4', left: 'Results', right: 'FK: module_code → Modules', category: 'Foreign Key' },
      { pairId: 'l2-m5', left: 'Schedules', right: 'FK: lecturer_id → Lecturers', category: 'Foreign Key' },
      { pairId: 'l2-m6', left: 'Schedules', right: 'FK: module_code → Modules', category: 'Foreign Key' },
      { pairId: 'l2-m7', left: 'Modules', right: 'FK: dept_id → Departments', category: 'Foreign Key' },
      { pairId: 'l2-m8', left: 'Courses', right: 'FK: dept_id → Departments', category: 'Foreign Key' },
      { pairId: 'l2-m9', left: 'Students', right: 'FK: program_id → Programs', category: 'Foreign Key' },
    ],
  },
  {
    level: 3,
    title: 'Relationships',
    description: 'Match table relationships with their cardinality',
    pairs: [
      { pairId: 'l3-m1', left: 'Students 1:N Enrollments', right: 'One Student has Many Enrollments', category: 'Relationship' },
      { pairId: 'l3-m2', left: 'Modules 1:N Enrollments', right: 'One Module has Many Enrollments', category: 'Relationship' },
      { pairId: 'l3-m3', left: 'Enrollments 1:1 Results', right: 'One Enrollment has One Result', category: 'Relationship' },
      { pairId: 'l3-m4', left: 'Lecturers 1:N Schedules', right: 'One Lecturer has Many Schedules', category: 'Relationship' },
      { pairId: 'l3-m5', left: 'Modules 1:N Schedules', right: 'One Module has Many Schedules', category: 'Relationship' },
      { pairId: 'l3-m6', left: 'Departments 1:N Modules', right: 'One Dept has Many Modules', category: 'Relationship' },
      { pairId: 'l3-m7', left: 'Programs 1:N Students', right: 'One Program has Many Students', category: 'Relationship' },
      { pairId: 'l3-m8', left: 'Courses 1:N Modules', right: 'One Course has Many Modules', category: 'Relationship' },
      { pairId: 'l3-m9', left: 'Modules N:M Courses', right: 'Many Modules belong to Many Courses', category: 'Relationship' },
    ],
  },
]

export const typingRacePrompts = [
  {
    id: 't1',
    title: 'Basic SELECT',
    text: 'SELECT * FROM Students WHERE status = \'ACTIVE\' ORDER BY full_name ASC;',
  },
  {
    id: 't2',
    title: 'JOIN Query',
    text: 'SELECT s.full_name, m.module_name FROM Students s JOIN Enrollments e ON s.student_id = e.student_id JOIN Modules m ON e.module_code = m.module_code;',
  },
  {
    id: 't3',
    title: 'Aggregate Query',
    text: 'SELECT module_code, COUNT(*) AS total_students FROM Enrollments GROUP BY module_code HAVING COUNT(*) > 10;',
  },
  {
    id: 't4',
    title: 'Subquery',
    text: 'SELECT full_name FROM Students WHERE student_id IN (SELECT student_id FROM Enrollments WHERE grade > 85);',
  },
  {
    id: 't5',
    title: 'Complex JOIN',
    text: 'SELECT l.lecturer_name, m.module_name, s.time_slot FROM Lecturers l JOIN Schedules s ON l.lecturer_id = s.lecturer_id JOIN Modules m ON s.module_code = m.module_code WHERE s.day = \'Monday\';',
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

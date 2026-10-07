import {
  Layers3, PieChart, Clock3, Trophy, BookOpen, ClipboardCheck, CheckCircle2, Code2,
  Medal, Library, Mail, ListChecks, Settings, FileCheck2, Moon,
} from '../icons/index.js';

export const stats = [
  { icon: Layers3, value: '12', label: 'Courses Enrolled', hint: 'Keep it up!', pill: 'View all', color: 'blue' },
  { icon: PieChart, value: '68%', label: 'Overall Progress', hint: '', pill: 'This Week', color: 'green' },
  { icon: Clock3, value: '14h 30m', label: 'Study Time', hint: '', pill: 'Great!', color: 'blue' },
  { icon: Trophy, value: '85%', label: 'Avg. Quiz Score', hint: '', pill: 'Great Job!', color: 'green' },
];

export const assistantModes = [
  'Doubt solver',
  'Writing',
  'Code',
  'Translator',
  'Mind map',
  'Quiz',
  'Summary',
];

export const assignments = [
  { subject: 'Maths - Algebra Basics', status: 'Completed', tone: 'green' },
  { subject: 'Science - Force & Motion', status: 'Completed', tone: 'green' },
  { subject: 'English - Tenses in Use', status: 'Completed', tone: 'green' },
  { subject: 'Python Basics', status: 'In Progress', tone: 'blue' },
  { subject: 'Coding - Python Basics', status: 'Pending', tone: 'orange' },
];

export const courses = [
  { title: 'Science - Force & Motion', teacher: 'Ms. Priya Sharma', progress: 78 },
  { title: 'Maths - Linear Equations', teacher: 'Mr. Rohit Verma', progress: 64 },
  { title: 'English - Tenses in Use', teacher: 'Ms. Neha Singh', progress: 86 },
  { title: 'Coding - Python Basics', teacher: 'Mr. Aarav Mehta', progress: 42 },
];

// Single source of truth for books available in Teacher Course.
// Assessment creation uses this catalog, so only teacher-course books appear there.
export const teacherCourseBooks = [
  {
    name: 'CodeGPT V4',
    subject: 'Computer Science',
    classes: Array.from({ length: 8 }, (_, index) => `Class ${index + 1}`),
  },
];

export const week = [
  { day: 'Mon', value: 7 },
  { day: 'Tue', value: 6, active: true },
  { day: 'Wed', value: 5 },
  { day: 'Thu', value: 8 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 3 },
  { day: 'Sun', value: 2 },
];
export const activities = [
  { title: "Quiz 'Algebra Basics'", meta: 'Today, 10:30 AM', status: 'Completed', tone: 'green' },
  { title: "Assignment 'Force & Motion'", meta: 'Today, 09:15 AM', status: 'Submitted', tone: 'green' },
  { title: 'Study doubt solved', meta: 'Python basics - 08:45 AM', status: 'Solved', tone: 'blue' },
  { title: 'New course note opened', meta: 'Science - 08:30 AM', status: 'Viewed', tone: 'blue' },
];

const storedStudentAccount = (() => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') || {};
  } catch {
    return {};
  }
})();

// Compatibility view backed only by the authenticated API account.
export const studentProfile = {
  name: storedStudentAccount.student_name || storedStudentAccount.name || '',
  className: storedStudentAccount.class?.class_name || '',
  rollNo: storedStudentAccount.roll_no || '',
  admissionNo: storedStudentAccount.admission_no || '',
  attendance: storedStudentAccount.attendance || '',
  nextClass: storedStudentAccount.next_class || '',
};

export const timetable = [
  { time: '09:00 AM', subject: 'Science', teacher: 'Ms. Priya Sharma', room: 'Room 204' },
  { time: '10:30 AM', subject: 'Maths', teacher: 'Mr. Rohit Verma', room: 'Room 108' },
  { time: '12:00 PM', subject: 'English', teacher: 'Ms. Neha Singh', room: 'Room 112' },
];

export const studentAnnouncements = [
  { title: 'Unit test starts Monday', meta: 'Syllabus shared in Library', status: 'Important', tone: 'orange' },
  { title: 'Science project upload open', meta: 'Submit before 5 July 2026', status: 'New', tone: 'green' },
  { title: 'Parent-teacher meeting', meta: 'Saturday, 10:00 AM', status: 'Notice', tone: 'blue' },
];

export const studentDashboardStats = [
  { label: 'My Classes', value: '6', hint: 'Active Classes', tone: 'blue', icon: BookOpen },
  { label: 'Assignments', value: '8', hint: 'Pending Tasks', tone: 'green', icon: ClipboardCheck },
  { label: 'Average Grade', value: '85%', hint: 'This Semester', tone: 'purple', icon: Medal },
  { label: 'Attendance', value: '92%', hint: 'This Month', tone: 'orange', icon: FileCheck2 },
];

export const studentRecentAssignments = [
  { title: 'Math Problem Set 5', subject: 'Mathematics', dueLabel: 'Due Today', dueTone: 'red', time: '11:59 PM', iconTone: 'blue' },
  { title: 'Physics Lab Report', subject: 'Physics', dueLabel: 'Due Tomorrow', dueTone: 'orange', time: '11:59 PM', iconTone: 'green' },
  { title: 'English Essay', subject: 'English Literature', dueLabel: 'Due in 3 Days', dueTone: 'gray', time: '11:59 PM', iconTone: 'purple' },
  { title: 'Python Programming Task', subject: 'Computer Science', dueLabel: 'Due in 5 Days', dueTone: 'gray', time: '11:59 PM', iconTone: 'orange' },
];

export const studentProgressBreakdown = [
  { label: 'Exams', value: 85, tone: 'green' },
  { label: 'Assignments', value: 90, tone: 'blue' },
  { label: 'Quizzes', value: 80, tone: 'purple' },
  { label: 'Participation', value: 88, tone: 'orange' },
];

export const studentTodaySchedule = [
  { time: '09:00 AM', subject: 'Mathematics', room: 'Room 201', tone: 'blue' },
  { time: '10:30 AM', subject: 'Physics', room: 'Room 302', tone: 'green' },
  { time: '01:00 PM', subject: 'English Literature', room: 'Room 105', tone: 'purple' },
  { time: '02:30 PM', subject: 'Computer Science', room: 'Lab 1', tone: 'orange' },
  { time: '04:00 PM', subject: 'Chemistry', room: 'Room 303', tone: 'blue' },
];

export const studentDashboardAnnouncements = [
  {
    title: 'Sports Day is Coming!',
    date: 'May 15, 2024',
    description: 'Annual sports day will be held on May 25th. Register for your favorite events!',
    isNew: true,
    tone: 'blue',
    icon: 'megaphone',
  },
  {
    title: 'Library Hours Updated',
    date: 'May 12, 2024',
    description: 'Library will now be open until 8 PM on weekdays.',
    isNew: false,
    tone: 'green',
    icon: 'library',
  },
];

export const studentUpcomingDeadlines = [
  { title: 'Math Problem Set 5', subject: 'Mathematics', dueLabel: 'Today', dueTone: 'red', iconTone: 'blue' },
  { title: 'Physics Lab Report', subject: 'Physics', dueLabel: 'Tomorrow', dueTone: 'orange', iconTone: 'green' },
  { title: 'English Essay', subject: 'English Literature', dueLabel: 'May 20', dueTone: 'gray', iconTone: 'purple' },
];

export const studentDashboardCalendar = {
  month: 7,
  year: 2024,
  selectedDay: 14,
  eventDays: [
    { day: 3, tone: 'blue' },
    { day: 8, tone: 'green' },
    { day: 12, tone: 'orange' },
    { day: 14, tone: 'blue' },
    { day: 18, tone: 'purple' },
    { day: 22, tone: 'green' },
    { day: 25, tone: 'orange' },
  ],
};

export const students = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', className: 'Class 8', progress: 76, quiz: 84, studyTime: '13h 20m', pending: 2, attendance: '94%', lastActive: 'Today, 11:15 AM', risk: 'Good', status: 'Active' },
  { name: 'Ananya Singh', email: 'ananya.singh@gmail.com', className: 'Class 8', progress: 81, quiz: 89, studyTime: '15h 05m', pending: 1, attendance: '96%', lastActive: 'Today, 10:40 AM', risk: 'Excellent', status: 'Active' },
  { name: 'Rohan Verma', email: 'rohan.verma@gmail.com', className: 'Class 8', progress: 64, quiz: 72, studyTime: '10h 10m', pending: 3, attendance: '86%', lastActive: 'Today, 09:50 AM', risk: 'Good', status: 'Active' },
  { name: 'Priya Kapoor', email: 'priya.kapoor@gmail.com', className: 'Class 8', progress: 88, quiz: 93, studyTime: '17h 25m', pending: 0, attendance: '98%', lastActive: 'Today, 11:30 AM', risk: 'Excellent', status: 'Active' },
  { name: 'Aditya Joshi', email: 'aditya.joshi@gmail.com', className: 'Class 8', progress: 71, quiz: 80, studyTime: '12h 40m', pending: 2, attendance: '91%', lastActive: 'Today, 08:55 AM', risk: 'Good', status: 'Active' },
  { name: 'Aryan Sharma', className: 'Class 8', progress: 68, quiz: 85, studyTime: '14h 30m', pending: 2, attendance: '92%', lastActive: 'Today, 10:30 AM', risk: 'Good', status: 'Active' },
  { name: 'Neha Patel', className: 'Class 8', progress: 82, quiz: 91, studyTime: '16h 10m', pending: 1, attendance: '96%', lastActive: 'Today, 09:20 AM', risk: 'Excellent', status: 'Active' },
  { name: 'Rohan Mehta', className: 'Class 7', progress: 57, quiz: 69, studyTime: '8h 45m', pending: 5, attendance: '78%', lastActive: 'Yesterday, 06:00 PM', risk: 'Needs Help', status: 'Needs Help' },
  { name: 'Sara Khan', className: 'Class 8', progress: 74, quiz: 88, studyTime: '12h 05m', pending: 3, attendance: '89%', lastActive: 'Today, 08:45 AM', risk: 'Good', status: 'Active' },
];

export const starterAssignments = [{
  id: "category-wise-general-practice",
  student: "All Students",
  className: "Class 1",
  subject: "General Studies",
  type: "Homework",
  title: "General Knowledge & Science Practice",
  due: "2026-08-30",
  priority: "High",
  points: 50,
  status: "Assigned",
  chapter: "Science, Mathematics and General Knowledge",
  homeworkType: "Worksheet",
  brief: "Complete all five sections. Select the correct options and write clear answers.",
  attachment: null,
  questions: [
    { type: "MCQ", text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "1", marks: "1", saved: true },
    { type: "MCQ", text: "What is the largest organ in the human body?", options: ["Heart", "Brain", "Skin", "Liver"], correctAnswer: "2", marks: "1", saved: true },
    { type: "MCQ", text: "Which gas do plants mainly use for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correctAnswer: "2", marks: "1", saved: true },
    { type: "MCQ", text: "What is 15 × 4?", options: ["45", "50", "60", "75"], correctAnswer: "2", marks: "1", saved: true },
    { type: "MCQ", text: "Which is the largest ocean in the world?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], correctAnswer: "3", marks: "1", saved: true },
    { type: "Fill in the Blank", text: "The Sun rises in the ________.", marks: "1", saved: true },
    { type: "Fill in the Blank", text: "Water freezes at ________ °C.", marks: "1", saved: true },
    { type: "Fill in the Blank", text: "The capital of India is ________.", marks: "1", saved: true },
    { type: "Fill in the Blank", text: "A triangle has ________ sides.", marks: "1", saved: true },
    { type: "Fill in the Blank", text: "Plants prepare their food through a process called ________.", marks: "1", saved: true },
    { type: "True / False", text: "The Earth revolves around the Sun.", marks: "1", saved: true },
    { type: "True / False", text: "There are 30 days in every month.", marks: "1", saved: true },
    { type: "True / False", text: "Humans need oxygen to survive.", marks: "1", saved: true },
    { type: "True / False", text: "The Moon is a star.", marks: "1", saved: true },
    { type: "True / False", text: "100 is greater than 50.", marks: "1", saved: true },
    { type: "Short Answer", text: "What is photosynthesis?", marks: "2", saved: true },
    { type: "Short Answer", text: "Why do we need water?", marks: "2", saved: true },
    { type: "Short Answer", text: "What are the three states of matter?", marks: "2", saved: true },
    { type: "Short Answer", text: "What is the importance of trees?", marks: "2", saved: true },
    { type: "Short Answer", text: "What is a computer?", marks: "2", saved: true },
    { type: "Long Answer", text: "Explain the process of photosynthesis in detail.", marks: "5", saved: true },
    { type: "Long Answer", text: "Describe the importance of water in our daily life.", marks: "5", saved: true },
    { type: "Long Answer", text: "Explain the different states of matter with suitable examples.", marks: "5", saved: true },
    { type: "Long Answer", text: "Write a detailed note on the importance of trees and forests.", marks: "5", saved: true },
    { type: "Long Answer", text: "Explain how computers are useful in education and everyday life.", marks: "5", saved: true },
  ],
}];

const currentScheduleDate = (() => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; })();

export const starterCalendarEvents = [
  { title: 'Maths revision class', date: currentScheduleDate, time: '10:30', className: 'Class 8 - A', type: 'Class', note: 'Linear equations doubt session.' },
  { title: 'Science project review', date: currentScheduleDate, time: '12:00', className: 'Class 8 - A', type: 'Review', note: 'Check force and motion models.' },
  { title: 'English creative writing', date: currentScheduleDate, time: '09:30', className: 'Class 8 - A', type: 'Class', note: 'Story planning and vocabulary workshop.' },
];

export const pageData = {
  'My Courses': {
    icon: BookOpen,
    subtitle: 'Continue your enrolled subjects and track completion.',
    items: courses.map((course) => ({
      title: course.title,
      meta: `${course.teacher} - ${course.progress}% complete`,
      status: 'Open',
      tone: course.progress > 70 ? 'green' : 'blue',
    })),
  },
  'Study Helper': {
    icon: BookOpen,
    subtitle: 'Choose a smart helper for doubts, writing, code, summaries, and study support.',
    items: assistantModes.map((tool) => ({ title: tool, meta: 'Ready to help', status: 'Start', tone: 'blue' })),
  },
  Homework: {
    icon: ClipboardCheck,
    subtitle: 'View homework assigned by your teacher with due dates and attachments.',
    items: assignments.map((item) => ({ title: item.subject, meta: 'Class task', status: item.status, tone: item.tone })),
  },
  Practice: {
    icon: CheckCircle2,
    subtitle: 'Daily quizzes and quick revision sets.',
    items: [
      { title: 'Algebra Basics Practice', meta: '15 questions', status: 'Start', tone: 'blue' },
      { title: 'Science Motion Quiz', meta: '12 questions', status: 'Start', tone: 'blue' },
      { title: 'English Tenses Drill', meta: '10 questions', status: 'Start', tone: 'green' },
    ],
  },
  'Coding Lab': {
    icon: Code2,
    subtitle: 'Practice programming problems and review solutions.',
    items: [
      { title: 'Python Variables', meta: 'Beginner lab', status: 'Open', tone: 'green' },
      { title: 'Loops Challenge', meta: '8 exercises', status: 'Open', tone: 'blue' },
      { title: 'Mini Calculator', meta: 'Project task', status: 'Pending', tone: 'orange' },
    ],
  },
  Progress: {
    icon: PieChart,
    subtitle: 'Weekly learning performance and study consistency.',
    items: week.map((day) => ({
      title: `${day.day} progress`,
      meta: `${day.value} learning points`,
      status: day.active ? 'Today' : 'Done',
      tone: day.active ? 'blue' : 'green',
    })),
  },
  Certificates: {
    icon: Medal,
    subtitle: 'Your earned and upcoming course certificates.',
    items: [
      { title: 'Python Basics Certificate', meta: '86% completed', status: 'Soon', tone: 'blue' },
      { title: 'Algebra Foundation', meta: 'Completed', status: 'Ready', tone: 'green' },
      { title: 'Science Motion Badge', meta: '2 tasks left', status: 'Locked', tone: 'orange' },
    ],
  },
  Leaderboard: {
    icon: Trophy,
    subtitle: 'Class ranking based on XP and completed tasks.',
    items: [
      { title: 'Aryan Sharma', meta: '1,840 XP', status: '#1', tone: 'green' },
      { title: 'Neha Patel', meta: '1,720 XP', status: '#2', tone: 'blue' },
      { title: 'Rohan Mehta', meta: '1,610 XP', status: '#3', tone: 'blue' },
    ],
  },
  Library: {
    icon: Library,
    subtitle: 'Study notes, saved resources, and reading material.',
    items: [
      { title: 'Math Formula Sheet', meta: 'PDF notes', status: 'Read', tone: 'blue' },
      { title: 'Python Cheat Sheet', meta: 'Saved resource', status: 'Read', tone: 'green' },
      { title: 'Science Diagrams', meta: 'Image notes', status: 'Open', tone: 'blue' },
    ],
  },
  Messages: {
    icon: Mail,
    subtitle: 'Teacher updates and study reminders.',
    items: [
      { title: 'Ms. Priya Sharma', meta: 'Science assignment feedback shared', status: 'New', tone: 'green' },
      { title: 'Mr. Aarav Mehta', meta: 'Python lab opens today', status: 'New', tone: 'blue' },
      { title: 'Student Panel', meta: 'Your weekly report is ready', status: 'View', tone: 'blue' },
    ],
  },
};

export const teacherFeatureData = {
  'Teacher Course': {
    icon: BookOpen,
    subtitle: 'Manage lessons, course progress, and classroom learning material.',
    items: courses.map((course) => ({
      title: course.title,
      meta: `${course.teacher} - ${course.progress}% class progress`,
      status: course.progress > 70 ? 'On Track' : 'Review',
      tone: course.progress > 70 ? 'green' : 'blue',
    })),
  },
  'Test & Exam': {
    icon: ListChecks,
    subtitle: 'Create exam schedules, quick tests, and revision checks for students.',
    items: [],
  },
  'Coding Lab': {
    icon: Code2,
    subtitle: 'Assign coding practice, check submissions, and track programming progress.',
    items: [
      { title: 'Python Variables Lab', meta: 'Beginner - 8 tasks - Class 8', status: 'Open', tone: 'green' },
      { title: 'Loops Challenge', meta: 'Practice set - 12 tasks', status: 'Assign', tone: 'blue' },
      { title: 'Mini Calculator Project', meta: 'Project - rubric based grading', status: 'Review', tone: 'orange' },
    ],
  },
  Messages: {
    icon: Mail,
    subtitle: 'Send class updates, answer student questions, and review parent messages.',
    items: [
      { title: 'Aryan Sharma', meta: 'Asked about Maths homework submission', status: 'Reply', tone: 'orange' },
      { title: 'Class 8 - A', meta: 'Science project reminder ready to send', status: 'Broadcast', tone: 'blue' },
      { title: 'Parent Message', meta: 'Attendance update requested', status: 'New', tone: 'green' },
    ],
  },
  Settings: {
    icon: Settings,
    subtitle: 'Control class details, notification rules, grading preferences, and account settings.',
    items: [
      { title: 'Class Profile', meta: 'Class 8 - A, 48 students, CBSE board', status: 'Edit', tone: 'blue' },
      { title: 'Notification Rules', meta: 'Homework, submissions, and exam reminders', status: 'Manage', tone: 'green' },
      { title: 'Grading Preferences', meta: 'Marks, rubrics, late submission policy', status: 'Review', tone: 'orange' },
    ],
  },
};

export const starterExamPlans = [];

export const codingLabs = [
  { id: 'html', name: 'HTML Lab', subtitle: 'HyperText Markup Language', badge: 'Runs in browser', action: 'HTML', mark: 'HTML', tone: 'html', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { id: 'python', name: 'Python Lab', subtitle: 'Python', badge: 'Runs in browser', action: 'Python', mark: 'Py', tone: 'python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { id: 'java', name: 'Java Lab', subtitle: 'Java', badge: 'External compiler', action: 'Java', mark: 'Java', tone: 'java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { id: 'sql', name: 'SQL Lab', subtitle: 'Structured Query Language', badge: 'Runs in browser', action: 'SQL', mark: 'SQL', tone: 'sql', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { id: 'scratch', name: 'Scratch Lab', subtitle: 'Scratch Programming', badge: 'Embedded player', action: 'Scratch', mark: 'S', tone: 'scratch', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/scratch.svg' },
  { id: 'phet', name: 'PhET Simulation', subtitle: 'Science and Math Simulations', badge: 'Interactive simulations', action: 'Simulation', mark: 'Sim', tone: 'phet', logo: 'https://phet.colorado.edu/images/phet-logo-trademarked.svg' },
];

export const phetSimulations = {
  'Circuit Construction Kit AC': 'https://phet.colorado.edu/sims/html/circuit-construction-kit-ac/latest/circuit-construction-kit-ac_all.html',
  'Circuit Construction Kit DC': 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html',
};

export const phetProjectPages = {
  'Circuit Construction Kit AC': 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-ac-virtual-lab',
  'Circuit Construction Kit DC': 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc-virtual-lab',
};

export const defaultHtmlCode = `<h1>Hello Coding Lab</h1>
<p>Edit this HTML and click Run.</p>
<button>HTML is working</button>`;

export const defaultPythonCode = `print("Hello Python Lab")
print("2 + 3 =", 2 + 3)`;

export const defaultJavaCode = `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java Lab");
    System.out.println("2 + 3 = " + (2 + 3));
  }
}`;

export const defaultSqlCode = `SELECT * FROM students;
SELECT name, className FROM students;`;

export const sampleSqlStudents = [
  { name: 'Aryan Sharma', className: 'Class 8', progress: 68, quiz: 85 },
  { name: 'Neha Patel', className: 'Class 8', progress: 82, quiz: 91 },
  { name: 'Rohan Mehta', className: 'Class 7', progress: 57, quiz: 69 },
  { name: 'Sara Khan', className: 'Class 8', progress: 74, quiz: 88 },
];

export const studentCodingExercises = [
  {
    id: 'html-basics',
    title: 'HTML Lab',
    subtitle: 'HyperText Markup Language',
    language: 'html',
    badge: 'Open',
    task: 'Create a small web page and run it in the live preview.',
    starterCode: defaultHtmlCode,
  },
  {
    id: 'python-variables',
    title: 'Python Lab',
    subtitle: 'Python',
    language: 'python',
    badge: 'Open',
    task: 'Create two variables and print their total.',
    starterCode: `name = "Aryan"
score = 10
bonus = 5
print(name)
print("Total =", score + bonus)`,
  },
  {
    id: 'java-basics',
    title: 'Java Lab',
    subtitle: 'Java',
    language: 'java',
    badge: 'Open',
    task: 'Run a basic Java print program and edit the output.',
    starterCode: defaultJavaCode,
  },
  {
    id: 'sql-query',
    title: 'SQL Lab',
    subtitle: 'Structured Query Language',
    language: 'sql',
    badge: 'Open',
    task: 'Query the sample students table and filter class progress.',
    starterCode: defaultSqlCode,
  },
  {
    id: 'scratch-plan',
    title: 'Scratch Lab',
    subtitle: 'Scratch Programming',
    language: 'scratch',
    badge: 'Pending',
    task: 'Write a Scratch block plan for a sprite animation.',
    starterCode: `when green flag clicked
say "Hello Coding Lab" for 2 seconds
move 10 steps
turn 15 degrees`,
  },
];

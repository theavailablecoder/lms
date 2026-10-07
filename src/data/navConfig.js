import {
  Gauge, BookOpen, ClipboardCheck, CheckCircle2, Code2, Medal, Trophy,
  Mail, Sparkles, ListChecks, CalendarDays, SearchCheck,   FileCheck2, Settings, CircleUserRound,
} from '../icons/index.js';
import orangeClassroomLogo from '../assets/Classroom logo_01.png';

export { orangeClassroomLogo };

export const studentNavGroups = [
  {
    label: 'Dashboard',
    items: [
      { icon: Gauge, label: 'Student Dashboard', page: 'Dashboard' },
      { icon: BookOpen, label: 'My Courses' },
      { icon: BookOpen, label: 'Study Helper' },
      { icon: ClipboardCheck, label: 'Homework' },
      { icon: ListChecks, label: 'Assessment' },
    ],
  },
  {
    label: 'Quizzes',
    items: [
      { icon: CheckCircle2, label: 'Practice' },
      { icon: Code2, label: 'Coding Lab' },
      { icon: Medal, label: 'Certificates' },
      { icon: Trophy, label: 'Leaderboard' },
    ],
  },
  {
    label: '',
    items: [
      { icon: Mail, label: 'Messages' },
      { icon: CircleUserRound, label: 'Profile' },
    ],
  },
];

export const teacherNav = [
  { icon: Gauge, label: 'Teacher Dashboard' },
  { icon: BookOpen, label: 'Teacher Course' },
  { icon: Sparkles, label: 'AI Study Box', featured: true },
  { icon: ListChecks, label: 'Assessment' },
  { icon: CalendarDays, label: 'Calendar' },
  { icon: ClipboardCheck, label: 'Assignment' },
  { icon: Code2, label: 'Coding Lab' },
  { icon: SearchCheck, label: 'Monitor Student' },
  { icon: FileCheck2, label: 'Grading System' },
  { icon: Mail, label: 'Messages' },
  { icon: Settings, label: 'Settings' },
];

export const teacherNavGroups = [
  {
    label: 'Dashboard',
    items: [
      { icon: Gauge, label: 'Teacher Dashboard' },
      { icon: BookOpen, label: 'Teacher Course' },
      { icon: Sparkles, label: 'AI Study Box' },
    ],
  },
  {
    label: 'Teaching',
    items: [
      { icon: ListChecks, label: 'Assessment' },
      { icon: CalendarDays, label: 'Calendar' },
      { icon: ClipboardCheck, label: 'Assignment' },
      { icon: Code2, label: 'Coding Lab' },
      { icon: SearchCheck, label: 'Monitor Student' },
      { icon: FileCheck2, label: 'Grading System' },
    ],
  },
  {
    label: 'Other',
    items: [
      { icon: Mail, label: 'Messages' },
      { icon: CircleUserRound, label: 'Profile' },
      { icon: Settings, label: 'Settings' },
    ],
  },
];

export const studentRouteMap = {
  Dashboard: 'dashboard',
  'My Courses': 'courses',
  'Study Helper': 'study-helper',
  Homework: 'homework',
  Assessment: 'assessment',
  Practice: 'practice',
  'Coding Lab': 'coding-lab',
  Progress: 'progress',
  Certificates: 'certificates',
  Leaderboard: 'leaderboard',
  Library: 'library',
  Messages: 'messages',
  Profile: 'profile',
};

export const teacherRouteMap = {
  'Teacher Dashboard': 'dashboard',
  'AI Study Box': 'ai-study-box',
  'Test & Exam': 'test-exam',
  Assessment: 'test-exam',
  Calendar: 'calendar',
  'Home Work and Assignment': 'homework',
  Assignment: 'homework',
  'Coding Lab': 'coding-lab',
  'Monitor Student': 'monitor',
  'Grading System': 'grading',
  Messages: 'messages',
  Profile: 'profile',
  'Teacher Course': 'course',
  Settings: 'settings',
};

export const studentPathToPage = Object.fromEntries(
  Object.entries(studentRouteMap).map(([page, route]) => [route, page])
);

export const teacherPathToPage = Object.fromEntries(
  Object.entries(teacherRouteMap).map(([page, route]) => [route, page])
);

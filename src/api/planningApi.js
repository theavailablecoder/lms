import { starterCalendarEvents, starterExamPlans } from '../data/mockData.js';
import { demoClient } from './demoClient.js';

const examsStorageKey = 'lms-assessments';
const demoAssessmentIds = new Set(['demo-mixed-assessment']);
const demoAssessmentTitles = new Set([
  'Computer Fundamentals Assessment',
  'Science Motion Quiz',
  'English Grammar Exam',
]);
const removeDemoAssessments = (items) => items.filter((item) => (
  !demoAssessmentIds.has(item?.id) && !demoAssessmentTitles.has(item?.title)
));

const readSavedExams = () => {
  try {
    const saved = localStorage.getItem(examsStorageKey);
    if (!saved) return structuredClone(starterExamPlans);

    const parsed = JSON.parse(saved);
    const cleaned = Array.isArray(parsed) ? removeDemoAssessments(parsed) : [];
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(examsStorageKey, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return structuredClone(starterExamPlans);
  }
};

let calendarEvents = structuredClone(starterCalendarEvents);
let exams = readSavedExams();

export const planningApi = {
  getCalendarEvents: () => demoClient.get(calendarEvents),
  addCalendarEvent: async (event) => {
    calendarEvents = [{ ...event, id: event.id || crypto.randomUUID() }, ...calendarEvents];
    return demoClient.mutate(calendarEvents);
  },
  getExams: () => demoClient.get(exams),
  getInitialExams: () => structuredClone(exams),
  saveExams: async (nextExams) => {
    exams = structuredClone(nextExams);
    localStorage.setItem(examsStorageKey, JSON.stringify(exams));
    return demoClient.mutate(exams);
  },
};

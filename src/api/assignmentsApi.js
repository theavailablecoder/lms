import { starterAssignments } from '../data/mockData.js';
import { demoClient } from './demoClient.js';

const storageKey = 'orange360.assignments';

function readAssignments() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    const savedItems = Array.isArray(saved) ? saved : [];
    const missingStarterItems = starterAssignments.filter((starter) => !savedItems.some((item) => item.id === starter.id));
    const items = [...missingStarterItems, ...savedItems];
    return items.map((item) => ({ ...item, id: item.id || crypto.randomUUID() }));
  } catch {
    return structuredClone(starterAssignments).map((item) => ({ ...item, id: crypto.randomUUID() }));
  }
}

function saveAssignments(items) {
  assignments = items;
  localStorage.setItem(storageKey, JSON.stringify(items));
}

let assignments = readAssignments();

export const assignmentsApi = {
  list: () => demoClient.get(assignments),
  create: async (assignment) => {
    assignments = [{ ...assignment, id: assignment.id || crypto.randomUUID() }, ...assignments];
    saveAssignments(assignments);
    return demoClient.mutate(assignments);
  },
  update: async (id, assignment) => {
    assignments = assignments.map((item) => item.id === id ? { ...item, ...assignment, id } : item);
    saveAssignments(assignments);
    return demoClient.mutate(assignments);
  },
  remove: async (id) => {
    assignments = assignments.filter((item) => item.id !== id);
    saveAssignments(assignments);
    return demoClient.mutate(assignments);
  },
  submit: async (sourceIndex, submission) => {
    assignments = assignments.map((item, index) => {
      if (index !== sourceIndex) return item;
      const existing = item.submissions || (item.submission ? [item.submission] : []);
      const sameStudent = (entry) => (
        (submission.studentId && entry.studentId === submission.studentId) ||
        (submission.studentName && entry.studentName?.trim().toLowerCase() === submission.studentName.trim().toLowerCase())
      );
      const matchingSubmissions = existing.filter(sameStudent);
      if (matchingSubmissions.some((entry) => entry.teacherReview)) return item;
      const mergedSubmission = { ...Object.assign({}, ...matchingSubmissions), ...submission };
      const submissions = [...existing.filter((entry) => !sameStudent(entry)), mergedSubmission];
      return { ...item, submissions, submission };
    });
    saveAssignments(assignments);
    return demoClient.mutate(assignments);
  },
  review: async (sourceIndex, teacherReview) => {
    assignments = assignments.map((item, index) => {
      if (index !== sourceIndex) return item;
      const submissions = (item.submissions || (item.submission ? [item.submission] : [])).map((submission) => (
        (teacherReview.studentId ? submission.studentId === teacherReview.studentId : submission.studentName === teacherReview.studentName) || (!submission.studentId && !submission.studentName && item.student === 'All Students')
          ? { ...submission, studentId: teacherReview.studentId, studentName: teacherReview.studentName, teacherReview }
          : submission
      ));
      return { ...item, submissions, submission: submissions.find((entry) => entry.studentName === teacherReview.studentName) || item.submission };
    });
    saveAssignments(assignments);
    return demoClient.mutate (assignments);
  },
};

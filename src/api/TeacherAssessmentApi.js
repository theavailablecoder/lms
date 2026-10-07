import { API } from "./apiClient.js";

export async function getSubjects(teacher_id) {
  try {
    const response = await API.get(
      `/teacher/assigned-tests/subjects/${teacher_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getBooks(subject_id, teacher_id) {
  try {
    const response = await API.get(
      `/teacher/assigned-tests/books/${subject_id}/${teacher_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getClassByBookId(book_id) {
  try {
    const response = await API.get(`/teacher/assigned-tests/books/${book_id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getSections(class_id) {
  try {
    const response = await API.get(`/sections/${class_id}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getTests(book_id) {
  try {
    const response = await API.get(`/teacher/assigned-tests/tests/${book_id}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function createAssessment(data) {
  try {
    const response = await API.post(`/teacher/assigned-tests/create`, data);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getAssessments(teacher_id) {
  try {
    const response = await API.get(
      `teacher/assigned-tests/all-assigned/${teacher_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAssessment(assignment_id) {
  try {
    const response = await API.get(
      `teacher/assigned-tests/assigned/delete/${assignment_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
} 

export async function getClasses(teacher_id){
  try {
    const response = await API.get(
      `teacher/assessment/class/${teacher_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}


export async function updateAssessment(assignment_id, data){
  try {
    const response = await API.post(
      `teacher/assigned-tests/assigned/edit/${assignment_id}`, data
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function submittedAssessment(teacher_id, bookId, sectionId){
  try {
    const response = await API.get(
      `teacher/assigned-tests/submittedassessment/${teacher_id}/${bookId}/${sectionId}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function updateSubmittedAssessment(assessmentId, studentId, data){
  try {
    const response = await API.post(
      `teacher/assigned-tests/updateassessment/${assessmentId}/${studentId}`, data
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}
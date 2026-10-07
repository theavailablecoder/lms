import { API } from "./apiClient.js";

export async function getSubjects(teacher_id) {
  try {
    const response = await API.get(
      `/teacher/assignments/subjects/${teacher_id}`,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getBooks(teacher_id, subject_id) {
  try {
    const response = await API.get(
      `/teacher/assignments/books/${teacher_id}/${subject_id}`,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getClassByBookId(book_id) {
  try {
    const response = await API.get(`/teacher/assignments/classes/${book_id}`);
    return response?.data?.data;
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

export async function getAssignments(teacher_id) {
  try {
    const response = await API.get(
      `/teacher/assignments/all-assigned/${teacher_id}`,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getAssignmentQuestions(assignment_id) {
  try {
    const response = await API.get(
      `/teacher/assignments/questions/${assignment_id}`,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function createAssignment(data) {
  try {
    const response = await API.post(`/teacher/assignments/create`, data);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAssignment(assignment_id) {
  try {
    const response = await API.get(
      `teacher/assignments/assigned/delete/${assignment_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function updateAssignment(assignment_id, data) {
  try {
    const response = await API.post(
      `/teacher/assignments/assigned/edit/${assignment_id}`,
      data,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getSubmittedAssignments(teacher_id, book_id, class_id) {
  try {
    const response = await API.get(
      `/teacher/assignments/studentanswers/${teacher_id}/${book_id}/${class_id}`,
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

import { API } from "./apiClient.js";

export async function getTeacherAssessment(teacher_id, book_id, section_id) {
  try {
    const response = await API.get(
      `/student/assigned-tests/all-assigned/${teacher_id}/${book_id}/${section_id}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getTestQuestions(assessmentId) {
  try {
    const response = await API.get(
      `/student/assigned-tests/question/${assessmentId}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function studentAttempt(assessmentId, studentId, data) {
  try {
    const response = await API.post(
      `/student/assigned-tests/attempt/${assessmentId}/${studentId}`,
      data,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function studentAttemptAnswer(attemptId) {
  try {
    const response = await API.get(
      `/student/assigned-tests/answers/${attemptId}`
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

import { API } from "./apiClient.js";

const data = (response) => response?.data?.data ?? response?.data;

export async function getTeacherByStudent(studentId) {
  return data(await API.get(`student/courses/${studentId}`));
}

export async function getBoardsByStudent(studentId, teacherId) {
  try {
    const response = await API.get(
      `student/courses/boards/${studentId}/${teacherId}`,
    );
    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

export async function getSubjectsByStudent(teacherId, boardId) {
  try {
    const response = await API.get(
      `student/courses/subjects/${teacherId}/${boardId}`,
    );
    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

export async function getClassesByStudent(studentId, teacherId) {
  try {
    const response = await API.get(
      `student/courses/classes/${studentId}/${teacherId}`,
    );
    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

export async function getCategoriesByStudent(teacherId, subjectId, classId) {
  try {
    const response = await API.get(`student/courses/contents/${teacherId}/${subjectId}/${classId}`);
    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

export async function getStudentContent(teacherId, classId, subjectId, contentId) {
  try{
    const response = await API.get(
      `student/courses/content-files/${teacherId}/${classId}/${subjectId}/${contentId}`,
    );
    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}
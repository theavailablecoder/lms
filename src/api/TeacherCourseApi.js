import { API } from "./apiClient.js";

export async function getBoardByTeacher(teacherId) {
  try {
    const response = await API.get(`teacher/course/boards/${teacherId}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching boards by teacher:", error);
    throw error;
  }
}

export async function getSubjectsByTeacher(teacherId) {
  try {
    const response = await API.get(`teacher/course/subjects/${teacherId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getBooksByTeacher(subjectId, teacherId) {
  try {
    const response = await API.get(
      `teacher/course/books/${subjectId}/${teacherId}`,
    );
console.log(response);
    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

export async function getClassByTeacher(bookId, teacherId) {
  try {
    const response = await API.get(
      `teacher/course/classes/${bookId}/${teacherId}`,
    );
    
    return response?.data?.data || [];

  } catch (error) {
    throw error;
  }
}

export async function getContentsByTeacher(bookId, teacherId) {
  try {
    const response = await API.get(
      `teacher/course/contents/${bookId}/${teacherId}`,
    );

    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

export async function getContentFiles(bookId, contentId) {
  try {
    const response = await API.get(
      `teacher/course/content-files/${bookId}/${contentId}`,
    );

    return response?.data?.data || [];
  } catch (error) {
    throw error;
  }
}

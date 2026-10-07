import { API } from "./apiClient.js";

export async function login(loginData) {
  try {
    const response = await API.post("/login", loginData);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const response = await API.post("/logout");
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function teacher(teacherData) {
  try {
    const response = await API.post("/teachers", teacherData);
    return response?.data;
  } catch (error) {
    throw error;
  }
}
export async function student(studentData) {
  try {
    const response = await API.post("/students", studentData);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getBoards() {
  try {
    const response = await API.get("/boards");
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getSubjects(boardId) {
  try {
    const response = await API.get(`/subjects/${boardId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getBooks(subjectId) {
  try {
    const response = await API.get(`/books/${subjectId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getClasses() {
  try {
    const response = await API.get("/classes");
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getSections(classId) {
  try {
    const response = await API.get(`/sections/${classId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

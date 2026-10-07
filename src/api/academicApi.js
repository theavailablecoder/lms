import { API } from "./apiClient.js";

export async function getBoards() {
  try {
    const response = await API.get("/boards");
    return response.data.data || [];
  } catch (error) {
    console.error("Boards API error:", error);
    throw error;
  }
}

export async function getClasses() {
  try {
    const response = await API.get("/classes");
    return response.data.data || [];
  } catch (error) {
    console.error("Classes API error:", error);
    throw error;
  }
}

export async function getSubjects(boardId) {
  try {
    const response = await API.get(`/subjects/${boardId}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Subjects API error:", error);
    throw error;
  }
}

export async function getBooks(subjectId) {
  try {
    const response = await API.get(`/books/${subjectId}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Books API error:", error);
    throw error;
  }
}

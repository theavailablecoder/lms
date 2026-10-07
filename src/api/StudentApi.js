import { API } from "./apiClient.js";

export async function student(userId) {
  if (!Number.isInteger(Number(userId)) || Number(userId) <= 0) {
    throw new Error("A valid student ID is required.");
  }

  try {
    const response = await API.get(`/students/${userId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}


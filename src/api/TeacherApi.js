import { API } from "./apiClient.js";

export async function teacher(userId) {
  try {
    const response = await API.get(`/teachers/${userId}`);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

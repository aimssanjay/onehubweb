import { API_BASE_URL } from "../../services/api";
import { getToken } from "../../services/auth";

export const saveCategories = async (categories: string[]) => {
  const token = getToken();

  return fetch(`${API_BASE_URL}/user/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categories }),
  });
};
import { API_BASE_URL } from "../../services/api";
import { getToken } from "../../services/auth";

export const useSocials = () => {
  const saveSocials = async (socials: any) => {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/user/socials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(socials),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    }

    return { success: false, message: data.message };
  };

  return { saveSocials };
};
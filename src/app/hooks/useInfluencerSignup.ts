import { useState } from "react";
import { API_BASE_URL } from "../../services/api";
import { setToken } from "../../services/auth";
export const useInfluencerSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async (payload: any) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ TOKEN SAVE
        setToken(data.token);

        return { success: true };
      }

      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Server error" };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};
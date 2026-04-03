import { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../../services/api";

export const useBrandSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Brand Signup Response:", data); // 👈 check this

      if (response.ok) {
        const token =
          data.token ||
          data.access_token ||
          data.data?.token ||
          data.data?.access_token;

        console.log("Token found:", token); // 👈 check this

        if (token) {
          localStorage.setItem("brand_token", token);
          localStorage.setItem("brand_user", JSON.stringify(data.data));
        } else {
          console.warn("No token in response:", data);
        }

        return { success: true, data };
      }

      return {
        success: false,
        message: data?.message || "Signup failed",
      };

    } catch (err) {
      setError("Network error");
      return { success: false, message: "Network error" };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};
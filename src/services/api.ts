const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const normalizedBaseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : undefined;

export const API_BASE_URL = normalizedBaseUrl || "https://api.onehub.ae/api";

export const API_ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
CATEGORY: "/get-all-categories",
SOCIALACCOUNT:"/add-social-account"
};

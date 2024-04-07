export const API_URL = import.meta.env.PROD
  ? (process.env.BACKEND_API_URL as string)
  : "http://localhost:8000";

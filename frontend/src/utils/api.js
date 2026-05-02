// Base API URL — uses VITE_API_URL env variable in production,
// falls back to localhost for local development.
let API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Ensure no trailing slash
if (API_BASE_URL.endsWith("/")) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

export default API_BASE_URL;

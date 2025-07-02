// Example in React (e.g., in a config.js file or directly in your API calls)
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-api.vercel.app/api"
    : "http://localhost:5000/api";

export default BASE_URL;

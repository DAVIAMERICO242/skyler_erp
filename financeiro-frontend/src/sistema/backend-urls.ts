let BACKEND_URL: string;

if (import.meta.env.VITE_PROD_ENV === "TRUE") {
  BACKEND_URL = `https://${import.meta.env.VITE_BACKEND_REVERSE_PROXY}`;
} else {
  BACKEND_URL = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`;
}

export default BACKEND_URL;
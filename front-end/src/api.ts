// src/api.ts
import axios from "axios";

const baseURL = (() => {
        const configured = import.meta.env.VITE_API_BASE_URL?.trim();
        if (configured) {
                return configured.replace(/\/?$/, "");
        }
        return "/api";
})();

export const api = axios.create({
        baseURL,
        withCredentials: true
});

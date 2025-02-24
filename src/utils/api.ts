const API_BASE_URL = "http://51.75.17.127:3000";

export const api = {
    login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Erreur de connexion");
        }

        return res.json();
    },

    getStations: async (token: string) => {
        const res = await fetch(`${API_BASE_URL}/stations`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les stations");
        }

        return res.json();
    },
};

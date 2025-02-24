const API_BASE_URL = "http://51.75.17.127:3000";
import { StationsService } from "./station_api";
import { UserService } from "./user_api";

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
    // Attach the exported StationsService as a property.
    stations: StationsService(API_BASE_URL),
    users: UserService(API_BASE_URL),
};

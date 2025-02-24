export const StationsService = (API_BASE_URL : string) => ({
    // Stations
    getStations: async (token : string) => {
        const res = await fetch(`${API_BASE_URL}/stations`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les stations");
        }

        return res.json();
    },
    getLastMeasurement: async (stationId: number, token: string) => {
        const res = await fetch(`${API_BASE_URL}/data/sensor-readings/${stationId}/last-measurement`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            return null; // Aucune donnée trouvée
        }

        const data = await res.json();
        return data.lastMeasurement || null;
    }
});
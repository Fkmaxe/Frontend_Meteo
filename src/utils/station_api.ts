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
});
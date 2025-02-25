export const StationsService = (API_BASE_URL: string) => ({
    // Récupère toutes les stations
    getStations: async (token: string) => {
        const res = await fetch(`${API_BASE_URL}/stations`, {
            headers: {Authorization: `Bearer ${token}`},
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les stations");
        }

        return res.json();
    },

    // Récupère la dernière mesure pour une station
    getLastMeasurement: async (stationId: number, token: string) => {
        const res = await fetch(`${API_BASE_URL}/data/sensor-readings/${stationId}/last-measurement`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            return null; // Aucune donnée trouvée
        }

        const data = await res.json();
        return data.lastMeasurement || null;
    },

    // Récupère les détails d'une station spécifique
    getStation: async (stationId: number, token: string) => {
        const res = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les détails de la station");
        }

        return res.json();
    },

    // Récupère les mesures d'une station spécifique
    getMeasurements: async (stationId: number, token: string, params = {}) => {
        let url = `${API_BASE_URL}/data/sensor-readings`;

        // Ajouter le filtre de station à la liste des paramètres
        const queryParams = new URLSearchParams({
            station_id: stationId.toString(),
            ...params
        });

        url += `?${queryParams.toString()}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les mesures");
        }

        return res.json();
    },

    // Récupère les capteurs actifs pour une station
    getSensors: async (stationId: number, token: string) => {
        const res = await fetch(`${API_BASE_URL}/stations/${stationId}/active-sensors`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les capteurs actifs");
        }

        return res.json();
    },

    // Récupère les notes associées à une station
    getStationNotes: async (stationId: number, token: string) => {
        const res = await fetch(`${API_BASE_URL}/station-notes?station_id=${stationId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de récupérer les notes de la station");
        }

        return res.json();
    },

    // Crée une note pour une station
    createStationNote: async (stationId: number, noteData: {title: string, note_content: string, user_id: number}, token: string) => {
        const res = await fetch(`${API_BASE_URL}/station-notes`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                station_id: stationId,
                title: noteData.title,
                note_content: noteData.note_content,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de créer la note");
        }

        return res.json();
    },

    delStationNote: async (noteId: number, token: string) => {
        const res = await fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Impossible de supprimer la note");
        }

        return res.json();
    }
});
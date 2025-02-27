import { ApiCall, handleApiError } from "@/utils/apiUtils";

interface ApiError extends Error {
    code?: string;
    status?: number;
    originalMessage?: string;
}

interface StationNote {
    id: number;
    station_id: number;
    title: string;
    note_content: string;
    created_at: string;
    updated_at: string;
}

export const StationsService = (API_BASE_URL: string, getToken: () => string | null) => ({
    getStations: async (router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/stations`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error("Get stations error:", error);

            const stationsErrorMessages = {
                403: "Vous n'avez pas les droits nécessaires pour accéder aux stations",
                404: "Liste des stations indisponible",
                500: "Erreur serveur lors de la récupération des stations"
            };

            handleApiError(error, 'stations', undefined, stationsErrorMessages);
        }
    },

    getStation: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/stations/${stationId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Get station ${stationId} error:`, error);

            const stationErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour accéder à la station ${stationId}`,
                404: `Station ${stationId} introuvable`,
                500: `Erreur serveur lors de la récupération de la station ${stationId}`
            };

            handleApiError(error, 'station', stationId, stationErrorMessages);
        }
    },

    getStationNotes: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/station-notes/station/${stationId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Get station notes for station ${stationId} error:`, error);

            const notesErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour accéder aux notes de la station ${stationId}`,
                404: `Notes de la station ${stationId} introuvables`,
                500: `Erreur serveur lors de la récupération des notes de la station ${stationId}`
            };

            handleApiError(error, 'notes de la station', stationId, notesErrorMessages);
        }
    },

    createStationNote: async (
        stationId: number,
        noteData: { title: string; note_content: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/station-notes`, {
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
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Create note for station ${stationId} error:`, error);

            const createNoteErrorMessages = {
                400: "Données de note invalides. Veuillez vérifier les informations saisies.",
                403: `Vous n'avez pas les droits nécessaires pour créer une note pour la station ${stationId}`,
                404: `Station ${stationId} introuvable`,
                500: "Erreur serveur lors de la création de la note"
            };

            handleApiError(error, 'création de note', stationId, createNoteErrorMessages);
        }
    },

    delStationNote: async (noteId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Delete note ${noteId} error:`, error);

            const deleteNoteErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour supprimer la note ${noteId}`,
                404: `Note ${noteId} introuvable`,
                500: `Erreur serveur lors de la suppression de la note ${noteId}`
            };

            handleApiError(error, 'suppression de note', noteId, deleteNoteErrorMessages);
        }
    },

    modifyStationNote: async (
        noteId: number,
        noteData: { title: string; note_content: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData),
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Modify note ${noteId} error:`, error);

            const modifyNoteErrorMessages = {
                400: "Données de note invalides. Veuillez vérifier les informations saisies.",
                403: `Vous n'avez pas les droits nécessaires pour modifier la note ${noteId}`,
                404: `Note ${noteId} introuvable`,
                500: `Erreur serveur lors de la modification de la note ${noteId}`
            };

            handleApiError(error, 'modification de note', noteId, modifyNoteErrorMessages);
        }
    },

    getLastMeasurement: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/data/sensor-readings/${stationId}/last-measurement`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Get last measurement for station ${stationId} error:`, error);

            const measurementErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour accéder aux mesures de la station ${stationId}`,
                404: `Mesures récentes pour la station ${stationId} introuvables`,
                500: `Erreur serveur lors de la récupération des dernières mesures de la station ${stationId}`
            };

            handleApiError(error, 'dernières mesures', stationId, measurementErrorMessages);
        }
    },

    getSensors: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/stations/${stationId}/active-sensors`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Get sensors for station ${stationId} error:`, error);

            const sensorsErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour accéder aux capteurs de la station ${stationId}`,
                404: `Capteurs pour la station ${stationId} introuvables`,
                500: `Erreur serveur lors de la récupération des capteurs de la station ${stationId}`
            };

            handleApiError(error, 'capteurs', stationId, sensorsErrorMessages);
        }
    },

    createStation: async (
        stationData: { name: string; location: string; description?: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/stations`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(stationData),
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Create station error:`, error);

            const createStationErrorMessages = {
                400: "Données de station invalides. Veuillez vérifier les informations saisies.",
                403: "Vous n'avez pas les droits nécessaires pour créer une station",
                409: "Une station avec ce nom existe déjà",
                500: "Erreur serveur lors de la création de la station"
            };

            handleApiError(error, 'création de station', undefined, createStationErrorMessages);
        }
    },

    updateStation: async (
        stationId: number,
        stationData: { name?: string; location?: string; description?: string; status?: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/stations/${stationId}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(stationData),
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Update station ${stationId} error:`, error);

            const updateStationErrorMessages = {
                400: "Données de station invalides. Veuillez vérifier les informations saisies.",
                403: `Vous n'avez pas les droits nécessaires pour modifier la station ${stationId}`,
                404: `Station ${stationId} introuvable`,
                409: "Une station avec ce nom existe déjà",
                500: `Erreur serveur lors de la modification de la station ${stationId}`
            };

            handleApiError(error, 'modification de station', stationId, updateStationErrorMessages);
        }
    },

    deleteStation: async (
        stationId: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/stations/${stationId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Delete station ${stationId} error:`, error);

            const deleteStationErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour supprimer la station ${stationId}`,
                404: `Station ${stationId} introuvable`,
                409: `Impossible de supprimer la station ${stationId} car elle contient des données associées`,
                500: `Erreur serveur lors de la suppression de la station ${stationId}`
            };

            handleApiError(error, 'suppression de station', stationId, deleteStationErrorMessages);
        }
    },
});
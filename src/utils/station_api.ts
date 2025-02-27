import { ApiCall, handleApiError } from "@/utils/apiUtils";

interface ApiError extends Error {
    code?: string;
    status?: number;
}

export const StationsService = (API_BASE_URL: string, getToken: () => string | null) => ({
    getStations: async (router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            return await ApiCall(
                fetch(`${API_BASE_URL}/stations`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );
        } catch (error) {
            handleApiError(error as ApiError, 'stations');
        }
    },

    getStation: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            return await ApiCall(
                fetch(`${API_BASE_URL}/stations/${stationId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );
        } catch (error) {
            handleApiError(error as ApiError, 'station', stationId);
        }
    },

    getStationNotes: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            return await ApiCall(
                fetch(`${API_BASE_URL}/station-notes/station/${stationId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );
        } catch (error) {
            handleApiError(error as ApiError, 'station notes', stationId);
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

            return await ApiCall(
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
        } catch (error) {
            handleApiError(error as ApiError, 'note creation');
        }
    },

    delStationNote: async (noteId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            return await ApiCall(
                fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );
        } catch (error) {
            handleApiError(error as ApiError, 'note deletion', noteId);
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

            const result = await ApiCall(
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

            if (!result) {
                throw new Error('Unauthorized access');
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'Unauthorized access':
                        throw new Error('Vous n\'avez pas la permission de modifier cette note');
                    case `StationNote with ID ${noteId} not found`:
                        throw new Error('Note introuvable');
                    default:
                        throw new Error('Échec de la modification de la note');
                }
            }
            throw new Error('Une erreur inattendue est survenue');
        }
    },

    getLastMeasurement: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            return await ApiCall(
                fetch(`${API_BASE_URL}/data/sensor-readings/${stationId}/last-measurement`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );
        } catch (error) {
            handleApiError(error as ApiError, 'last measurement', stationId);
        }
    },

    getSensors: async (stationId: number, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            return await ApiCall(
                fetch(`${API_BASE_URL}/stations/${stationId}/active-sensors`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                router
            );
        } catch (error) {
            handleApiError(error as ApiError, 'sensors', stationId);
        }
    },
});
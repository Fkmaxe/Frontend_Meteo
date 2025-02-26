import {ApiCall} from './apiUtils';
export const StationsService = (API_BASE_URL: string) => ({
    // Récupère toutes les stations


    getStations: async (token: string, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/stations`,
                {
                headers: { Authorization: `Bearer ${token}` },
                }
            ),
            router
        );
    },

    // Retrieves the last measurement for a station.
    // If redirection is desired on failure, pass the router instance.
    getLastMeasurement: async (
        stationId: number,
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(
                `${API_BASE_URL}/data/sensor-readings/${stationId}/last-measurement`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            ),
            router
        ).catch(() => null);
    },

    // Retrieves details for a specific station.
    getStation: async (
        stationId: number,
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/stations/${stationId}`,
                {
                headers: { Authorization: `Bearer ${token}` },
                }
            ),
            router
        );
    },

// Retrieves measurements for a specific station.
    getMeasurements: async (
        stationId: number,
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>,
        params = {}
    ) => {
        let url = `${API_BASE_URL}/data/sensor-readings`;
        const queryParams = new URLSearchParams({
            station_id: stationId.toString(),
            ...params,
        });
        url += `?${queryParams.toString()}`;

        return ApiCall(
            fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            router
        );
    },


    // Retrieves active sensors for a station.
    getSensors: async (
        stationId: number,
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/stations/${stationId}/active-sensors`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            router
        );
    },


    // Retrieves station notes.
    getStationNotes: async (
        stationId: number,
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes/station/${stationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            router
        );
    },

    // Creates a note for a station.
    createStationNote: async (
        stationId: number,
        noteData: { title: string; note_content: string },
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
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
    },


    // Deletes a station note.
    delStationNote: async (
        noteId: number,
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }),
            router
        );
    },


    // Modifies a station note.
    modifyStationNote: async (
        noteId: number,
        noteData: { title: string; note_content: string },
        token: string,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: noteData.title,
                    note_content: noteData.note_content,
                }),
            }),
            router
        );
    },
});
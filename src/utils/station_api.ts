import {ApiCall} from './apiUtils';
export const StationsService = (API_BASE_URL: string, getToken: () => string | null) => ({
    // Récupère toutes les stations


    getStations: async (
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/stations`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        );
    },

    // Retrieves the last measurement for a station.
    // If redirection is desired on failure, pass the router instance.
    getLastMeasurement: async (
        stationId: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/data/sensor-readings/${stationId}/last-measurement`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        ).catch(() => null);
    },

    // Retrieves details for a specific station.
    getStation: async (
        stationId: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/stations/${stationId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        );
    },

// Retrieves measurements for a specific station.
    // not used in the current version of the app
    getMeasurements: async (
        stationId: number,
        router: ReturnType<typeof import('next/navigation').useRouter>,
        params = {}
    ) => {

        // may need some tinkering to get this to work as i didn't use it in the app, so may not work as expected
        let url = `${API_BASE_URL}/data/sensor-readings`;
        const queryParams = new URLSearchParams({
            station_id: stationId.toString(),
            ...params,
        });
        url += `?${queryParams.toString()}`;

        return ApiCall(
            fetch(url, {
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        );
    },

    // Retrieves active sensors for a station.
    getSensors: async (
        stationId: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/stations/${stationId}/active-sensors`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        );
    },


    // Retrieves station notes.
    getStationNotes: async (
        stationId: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes/station/${stationId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        );
    },

    // Creates a note for a station.
    createStationNote: async (
        stationId: number,
        noteData: { title: string; note_content: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            }),
            router
        );
    },


    // Modifies a station note.
    // work in progress s
    modifyStationNote: async (
        noteId: number,
        noteData: { title: string; note_content: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/station-notes/${noteId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
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
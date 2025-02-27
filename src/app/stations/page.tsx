"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import StationCard, { Station } from "@/components/station/StationCard";
import StationSearchBar from "@/components/station/StationSearchBar";

export default function Stations() {
    const [stations, setStations] = useState<Station[]>([]);
    const [filteredStations, setFilteredStations] = useState<Station[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Non autorisé");

                const stationsData: Station[] = await api.stations.getStations(router);

                // Enrich each station with its last measurement
                const enrichedStations: Station[] = await Promise.all(
                    stationsData.map(async (station) => {
                        const lastMeasurement = await api.stations.getLastMeasurement(station.station_id, router);
                        return { ...station, lastMeasurement };
                    })
                );

                setStations(enrichedStations);
                setFilteredStations(enrichedStations);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            }
        };

        fetchStations();
    }, [router]);

    // Filter stations when search input changes
    useEffect(() => {
        const results = stations.filter((station) =>
            station.name_station.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStations(results);
    }, [search, stations]);

    // Determine the status color for a station
    const getStatusColor = (station: Station) => {
        if (!station.active) return "bg-red-500";
        if (station.statuts === "not_emitting") return "bg-orange-500";
        return "bg-green-500";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-bordeaux mb-6 text-center">Stations Météo</h1>

            {/* Search bar */}
            <StationSearchBar search={search} onSearchChange={setSearch} />

            {/* Display error if any */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Display station cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.length > 0 ? (
                    filteredStations.map((station) => (
                        <StationCard key={station.station_id} station={station} getStatusColor={getStatusColor} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucune station trouvée.</p>
                )}
            </div>
        </div>
    );
}

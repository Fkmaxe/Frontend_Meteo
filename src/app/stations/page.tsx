"use client";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";

// Définition du type Station
interface Station {
    station_id: number;
    name_station: string;
    name: string;
    active: boolean;
    statuts: "emitting" | "not_emitting";
    lastMeasurement?: string | null;
}

export default function Stations() {
    const [stations, setStations] = useState<Station[]>([]);
    const [filteredStations, setFilteredStations] = useState<Station[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Non autorisé");

                const stationsData: Station[] = await api.stations.getStations(token);

                // Récupérer la dernière mesure pour chaque station
                const enrichedStations: Station[] = await Promise.all(
                    stationsData.map(async (station) => {
                        const lastMeasurement = await api.stations.getLastMeasurement(station.station_id, token);
                        return { ...station, lastMeasurement };
                    })
                );

                setStations(enrichedStations);
                setFilteredStations(enrichedStations);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchStations();
    }, []);

    // Fonction de filtrage en fonction du champ de recherche
    useEffect(() => {
        const results = stations.filter((station) =>
            station.name_station.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStations(results);
    }, [search, stations]);

    // Fonction pour déterminer la couleur du statut
    const getStatusColor = (station: Station) => {
        if (!station.active) return "bg-red-500"; // 🔴 Station désactivée
        if (station.statuts === "not_emitting") return "bg-orange-500"; // 🟠 Station active mais ne transmet pas
        return "bg-green-500"; // 🟢 Station émet
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-bordeaux mb-6 text-center">Stations Météo</h1>

            {/* Champ de recherche */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Rechercher une station..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                />
            </div>

            {/* Affichage des erreurs */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Affichage des stations filtrées */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.length > 0 ? (
                    filteredStations.map((station) => (
                        <div
                            key={station.station_id}
                            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-bordeaux">{station.name_station}</h2>
                                {/* Indicateur de statut */}
                                <span className={`w-4 h-4 rounded-full ${getStatusColor(station)}`} />
                            </div>
                            <p className="text-gray-600">{station.name}</p>

                            {/* Dernière date de mesure */}
                            <p className="text-gray-500 text-sm mt-2">
                                Dernière mesure : {station.lastMeasurement ? new Date(station.lastMeasurement).toLocaleString() : "Aucune donnée"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucune station trouvée.</p>
                )}
            </div>
        </div>
    );
}

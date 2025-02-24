"use client";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function Stations() {
    const [stations, setStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Non autorisé");

                const data = await api.stations.getStations(token);
                setStations(data);
                setFilteredStations(data); // Par défaut, toutes les stations sont affichées
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchStations();
    }, []);

    // Fonction de filtrage en fonction du champ de recherche
    useEffect(() => {
        const results = stations.filter((station: any) =>
            station.name_station.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredStations(results);
    }, [search, stations]);

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
                    filteredStations.map((station: any) => (
                        <div
                            key={station.station_id}
                            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                        >
                            <h2 className="text-xl font-semibold text-bordeaux">{station.name_station}</h2>
                            <p className="text-gray-600">{station.name}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucune station trouvée.</p>
                )}
            </div>
        </div>
    );
}

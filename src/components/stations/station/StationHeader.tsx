"use client";
import BaseCard from "../../BaseCard";

export interface Station {
    station_id: number;
    name_station: string;
    name: string;
    active: boolean;
    statuts: "emitting" | "not_emitting";
}

interface StationHeaderProps {
    station: Station;
    getStatusColor: (station: Station) => string;
    getStationStatusText: (station: Station) => string;
}

export default function StationHeader({ station, getStatusColor, getStationStatusText }: StationHeaderProps) {
    return (
        <BaseCard className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-bordeaux">{station.name_station}</h1>
                <span className={`w-4 h-4 rounded-full ${getStatusColor(station)}`} />
            </div>
            <p className="text-gray-600 text-lg">{station.name}</p>
            <p className="text-gray-500 mt-2">Statut: {getStationStatusText(station)}</p>
        </BaseCard>
    );
}

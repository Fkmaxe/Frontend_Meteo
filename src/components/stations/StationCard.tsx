"use client";
import Link from "next/link";
import BaseCard from "../BaseCard";

export interface Station {
    station_id: number;
    name_station: string;
    name: string;
    active: boolean;
    statuts: "emitting" | "not_emitting";
    lastMeasurement?: string | null;
}

interface StationCardProps {
    station: Station;
    getStatusColor: (station: Station) => string;
}

export default function StationCard({ station, getStatusColor }: StationCardProps) {
    return (
        <Link href={`/stations/${station.station_id}`} className="block">
            <BaseCard>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-bordeaux">{station.name_station}</h2>
                    <span className={`w-4 h-4 rounded-full ${getStatusColor(station)}`} />
                </div>
                <p className="text-gray-600">{station.name}</p>
                <p className="text-gray-500 text-sm mt-2">
                    Dernière mesure :{" "}
                    {station.lastMeasurement
                        ? new Date(station.lastMeasurement).toLocaleString()
                        : "Aucune donnée"}
                </p>
            </BaseCard>
        </Link>
    );
}

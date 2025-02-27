"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface Sensor {
    station_id: number;
    sensor_id: number;
    start_date: string;
    sensor_order: number;
    end_date: string | null;
    sensor_type: {
        sensor_name: string;
        units: string;
        description: string;
    };
}

interface SortableSensorItemProps {
    sensor: Sensor;
    isDragging: boolean;
}

export default function SortableSensorItem({ sensor, isDragging }: SortableSensorItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: sensor.sensor_id.toString(),
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
    };

    return (
        <div
            ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-grab flex justify-between items-start"
    >
    <div className="flex flex-col">
    <p className="text-gray-700 font-medium">{sensor.sensor_type.sensor_name}</p>
        <p className="text-gray-500 text-sm">{sensor.sensor_type.units}</p>
        <p className="text-gray-500 text-sm">
        Depuis le {new Date(sensor.start_date).toLocaleString()}
    </p>
    {sensor.end_date && (
        <p className="text-gray-500 text-sm">
            Jusqu&#39;au {new Date(sensor.end_date).toLocaleString()}
    </p>
    )}
    </div>
    <div className="text-right flex items-center">
    <p className="text-gray-500 font-medium">{sensor.sensor_order}</p>
        </div>
        </div>
);
}

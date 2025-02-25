"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Définition des types
interface Station {
    station_id: number;
    name_station: string;
    name: string;
    active: boolean;
    statuts: "emitting" | "not_emitting";
}

interface Sensor {
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

interface StationNote {
    note_id: number;
    station_id: number;
    note: string;
    created_at: string;
    created_by: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};

export default function StationDetail() {
    const params = useParams();
    const router = useRouter();
    const stationId = Number(params.station_id);

    const [station, setStation] = useState<Station | null>(null);
    const [activeSensors, setActiveSensors] = useState<Sensor[]>([]);
    const [inactiveSensors, setInactiveSensors] = useState<Sensor[]>([]);
    const [originalActiveSensors, setOriginalActiveSensors] = useState<Sensor[]>([]);
    const [notes, setNotes] = useState<StationNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showInactive, setShowInactive] = useState(false);
    const [draggingSensorId, setDraggingSensorId] = useState<number | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [noteTitle, setNoteTitle] = useState("");

    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        const fetchStationDetails = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const stationData = await api.stations.getStation(stationId, token);
                setStation(stationData);

                const allSensorsData = await api.stations.getSensors(stationId, token);

                const active = allSensorsData.filter((sensor: Sensor) => !sensor.end_date);
                const inactive = allSensorsData.filter((sensor: Sensor) => sensor.end_date);

                active.sort((a, b) => a.sensor_order - b.sensor_order);
                inactive.sort((a, b) => a.sensor_order - b.sensor_order);

                setActiveSensors(active);
                setInactiveSensors(inactive);
                setOriginalActiveSensors(active); // Store original order

                const notesData = await api.stations.getStationNotes(stationId, token);
                setNotes(notesData);

                setLoading(false);
            } catch (err: any) {
                console.error("Erreur lors du chargement des données:", err);
                setError(err.message || "Une erreur est survenue");
                setLoading(false);
            }
        };

        if (stationId) {
            fetchStationDetails();
        }
    }, [stationId, router]);

    const getStatusColor = (station: Station) => {
        if (!station.active) return "bg-red-500";
        if (station.statuts === "not_emitting") return "bg-orange-500";
        return "bg-green-500";
    };

    const handleDragStart = (event: any) => {
        setDraggingSensorId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setActiveSensors((items) => {
                const oldIndex = items.findIndex((item) => item.sensor_id === active.id);
                const newIndex = items.findIndex((item) => item.sensor_id === over.id);
                const updatedItems = arrayMove(items, oldIndex, newIndex);
                updatedItems.forEach((item, index) => {
                    item.sensor_order = index + 1;
                });
                setIsModified(true); // Mark as modified
                return updatedItems;
            });
        }
        setDraggingSensorId(null);
    };

    const handleConfirm = async () => {
        // Logic to save changes to the database
        console.log("Confirmed new order:", activeSensors);
        // Reset modification state
        setIsModified(false);
        setOriginalActiveSensors(activeSensors);
    };

    const handleRollback = () => {
        const rolledBackSensors = originalActiveSensors.map((sensor, index) => ({
            ...sensor,
            sensor_order: index + 1,
        }));
        setActiveSensors(rolledBackSensors);
        setIsModified(false);
    };

    const handleAddNote = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/login");
            return;
        }
        /*
        const noteData = {
            title : notetitle,
            note_content: newNote,
            user_id: "User", // don't know how to get the id of the user for now
        };

        try {
            const response = await api.stations.createStationNote(stationId, noteData, token);
            setNotes([response, ...notes]);
            setNewNote("");
        } catch (err: any) {
            console.error("Erreur lors de l'ajout de la note:", err);
        }
        */
    };

    const handleDeleteNote = async (noteId: number) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/login");
            return;
        }
        /*
        try {
            await api.stations.delStationNote(noteId, token);
            setNotes(notes.filter((note) => note.note_id !== noteId));
        } catch (err: any) {
            console.error("Erreur lors de la suppression de la note:", err);
        }
        */
    };

    const getStationStatusText = (station: Station): string => {
        if (!station.active) return "Désactivée";
        return station.statuts === "emitting" ? "En émission" : "Inactive (ne transmet pas)";
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
                Chargement...
            </div>
        );
    if (error)
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
                        <p className="text-gray-700">{error}</p>
                        <button
                            onClick={() => router.push("/stations")}
                            className="mt-6 px-4 py-2 bg-bordeaux text-white rounded-md hover:bg-opacity-90"
                        >
                            Retour à la liste des stations
                        </button>
                    </div>
                </div>
            </div>
        );
    if (!station)
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-2xl font-bold text-gray-700 mb-4">Station non trouvée</h1>
                        <button
                            onClick={() => router.push("/stations")}
                            className="mt-4 px-4 py-2 bg-bordeaux text-white rounded-md hover:bg-opacity-90"
                        >
                            Retour à la liste des stations
                        </button>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/stations"
                    className="mb-6 inline-block text-bordeaux hover:underline font-medium"
                >
                    &larr; Retour à la liste des stations
                </Link>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-bordeaux">{station.name_station}</h1>
                        <span className={`w-4 h-4 rounded-full ${getStatusColor(station)}`} />
                    </div>
                    <p className="text-gray-600 text-lg">{station.name}</p>
                    <p className="text-gray-500 mt-2">
                        Statut: {getStationStatusText(station)}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-bordeaux mb-4">Capteurs actifs</h2>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <SortableContext items={activeSensors} strategy={verticalListSortingStrategy}>
                            {activeSensors.map((sensor) => (
                                <SortableItem
                                    key={sensor.sensor_id}
                                    sensor={sensor}
                                    isDragging={draggingSensorId === sensor.sensor_id}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={handleRollback}
                            disabled={!isModified}
                            className="px-4 py-2 bg-gray-300 text-bordeaux rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!isModified}
                            className="px-4 py-2 bg-bordeaux text-white rounded hover:bg-bordeaux-dark"
                        >
                            Confirmer
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-bordeaux font-semibold py-2 px-4 rounded mb-4"
                >
                    {showInactive ? "Masquer les capteurs inactifs" : "Afficher les capteurs inactifs"}
                </button>

                {showInactive && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-bordeaux mb-4">Capteurs inactifs</h2>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <SortableContext items={inactiveSensors} strategy={verticalListSortingStrategy}>
                                {inactiveSensors.map((sensor) => (
                                    <SortableItem
                                        key={sensor.sensor_id}
                                        sensor={sensor}
                                        isDragging={draggingSensorId === sensor.sensor_id}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-bordeaux mb-4">Notes</h2>
                    <div className="mb-4 space-y-4">
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="Titre de la note"
                            className="w-full p-2 border rounded-md text-gray-700"
                        />
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Contenu de la note"
                            className="w-full p-2 border rounded-md text-gray-700 min-h-[100px]"
                        />
                        <button
                            onClick={handleAddNote}
                            className="mt-2 px-4 py-2 bg-bordeaux text-white rounded hover:bg-bordeaux-dark"
                        >
                            Ajouter une note
                        </button>
                    </div>
                </div>
                <div>
                    {notes && notes.length > 0 ? (
                        <div className="space-y-4">
                            {notes.map((note) => (
                                <div key={note.note_id} className="border-b pb-4">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Par: {note.created_by}</span>
                                        <span>{formatDate(note.created_at)}</span>
                                    </div>
                                    <p className="text-gray-700">{note.note}</p>
                                    <button
                                        onClick={() => handleDeleteNote(note.note_id)}
                                        className="mt-2 text-red-500 hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Aucune note pour cette station.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const SortableItem = ({ sensor, isDragging }: { sensor: Sensor; isDragging: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sensor.sensor_id });
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
                <p className="text-gray-500 text-sm">Depuis le {formatDate(sensor.start_date)}</p>
                {sensor.end_date && (<p className="text-gray-500 text-sm">Jusqu&#39;au {formatDate(sensor.end_date)}</p>)}
            </div>
        <div className="text-right flex items-center">
            <p className="text-gray-500 font-medium">{sensor.sensor_order}</p>
            </div>
        </div>
    );
};

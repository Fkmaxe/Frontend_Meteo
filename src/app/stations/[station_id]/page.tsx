"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { arrayMove } from "@dnd-kit/sortable";
import { api } from "@/utils/api";

import StationHeader, { Station } from "@/components/stations/station/StationHeader";
import ActiveSensorsList from "@/components/stations/station/ActiveSensorList";
import InactiveSensorsList from "@/components/stations/station/InactiveSensorComponent";
import AddNoteForm from "@/components/stations/station/AddNoteForm";
import NoteList from "@/components/stations/station/NoteList";
import NoteEditModal from "@/components/stations/station/StationNoteEditModal";

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

export interface StationNote {
    note_id: number;
    title: string;
    note_content: string;
    created_at: string;
    station_id: number;
    user: { name: string };
    user_id: number;
}

const getStationStatusText = (station: Station): string => {
    if (!station.active) return "Désactivée";
    return station.statuts === "emitting" ? "En émission" : "Inactive (ne transmet pas)";
};

const getStatusColor = (station: Station) => {
    if (!station.active) return "bg-red-500";
    if (station.statuts === "not_emitting") return "bg-orange-500";
    return "bg-green-500";
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
    const [editingNote, setEditingNote] = useState<StationNote | null>(null);

    useEffect(() => {
        const fetchStationDetails = async () => {
            try {
                const stationData = await api.stations.getStation(stationId, router);
                setStation(stationData);

                const allSensorsData = await api.stations.getSensors(stationId, router);
                const active = allSensorsData.filter((sensor: Sensor) => !sensor.end_date);
                const inactive = allSensorsData.filter((sensor: Sensor) => sensor.end_date);

                // Fix the implicit any types in sort functions
                active.sort((a: Sensor, b: Sensor) => a.sensor_order - b.sensor_order);
                inactive.sort((a: Sensor, b: Sensor) => a.sensor_order - b.sensor_order);

                setActiveSensors(active);
                setInactiveSensors(inactive);
                setOriginalActiveSensors(active);

                const notesData = await api.stations.getStationNotes(stationId, router);
                setNotes(notesData);

                setLoading(false);
            } catch (err: unknown) {
                console.error("Erreur lors du chargement des données:", err);
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
                setLoading(false);
            }
        };

        if (stationId) {
            fetchStationDetails();
        }
    }, [stationId, router]);

    const handleDragStartAction = (id: string) => {
        setDraggingSensorId(Number(id));
    };

    const handleDragEndAction = (activeId: string, overId: string) => {
        const activeNumId = Number(activeId);
        const overNumId = Number(overId);

        if (activeNumId !== overNumId) {
            setActiveSensors((items) => {
                const oldIndex = items.findIndex((item) => item.sensor_id === activeNumId);
                const newIndex = items.findIndex((item) => item.sensor_id === overNumId);
                const updatedItems = arrayMove(items, oldIndex, newIndex);
                updatedItems.forEach((item, index) => {
                    item.sensor_order = index + 1;
                });
                setIsModified(true);
                return updatedItems;
            });
        }
        setDraggingSensorId(null);
    };


    const handleConfirm = async () => {
        console.log("Confirmed new order:", activeSensors);
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
        const noteData = {
            title: noteTitle,
            note_content: newNote,
        };
        try {
            const response = await api.stations.createStationNote(stationId, noteData, router);
            if (!response.user) {
                console.warn("User data missing in response, setting to Unknown");
                response.user = { name: "Unknown" };
            }
            setNotes([response, ...notes]);
            setNewNote("");
            setNoteTitle("");
        } catch (err: unknown) {
            console.error("Erreur lors de l'ajout de la note:", err);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            router.push("/login");
            return;
        }
        try {
            await api.stations.delStationNote(noteId, router);
            setNotes(notes.filter((note) => note.note_id !== noteId));
        } catch (err: unknown) {
            console.error("Erreur lors de la suppression de la note:", err);
        }
    };

    const handleModifyNote = (noteId: number) => {
        const noteToEdit = notes.find(note => note.note_id === noteId);
        if (noteToEdit) {
            setEditingNote(noteToEdit);
        }
    };

    const handleUpdateNote = async (formData: Record<string, string>) => {
        if (!editingNote) return;

        try {
            const updatedNoteData = {
                title: formData.title,
                note_content: formData.content
            };

            await api.stations.modifyStationNote(editingNote.note_id, updatedNoteData, router);

            // Update the notes list with the modified note
            setNotes(notes.map(note =>
                note.note_id === editingNote.note_id
                    ? {
                        ...note,
                        title: formData.title,
                        note_content: formData.content
                    }
                    : note
            ));

            setEditingNote(null);
        } catch (err: unknown) {
            console.error("Erreur lors de la modification de la note:", err);
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        }
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
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
                <Link href="/stations" className="mb-6 inline-block text-bordeaux hover:underline font-medium">
                    &larr; Retour à la liste des stations
                </Link>
                <StationHeader station={station} getStatusColor={getStatusColor} getStationStatusText={getStationStatusText} />
                <ActiveSensorsList
                    sensors={activeSensors}
                    draggingSensorId={draggingSensorId}
                    onDragStartAction={handleDragStartAction}
                    onDragEndAction={handleDragEndAction}
                    onConfirmAction={handleConfirm}
                    onRollbackAction={handleRollback}
                    isModified={isModified}
                />
                <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-bordeaux font-semibold py-2 px-4 rounded mb-4"
                >
                    {showInactive ? "Masquer les capteurs inactifs" : "Afficher les capteurs inactifs"}
                </button>
                {showInactive && (
                    <InactiveSensorsList
                        sensors={inactiveSensors}
                        draggingSensorId={draggingSensorId}
                        onDragStartAction={handleDragStartAction}
                        onDragEndAction={handleDragEndAction}
                    />
                )}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-bordeaux mb-4">Notes</h2>
                    <AddNoteForm
                        noteTitle={noteTitle}
                        newNote={newNote}
                        onTitleChange={setNoteTitle}
                        onNoteChange={setNewNote}
                        onAddNote={handleAddNote}
                    />
                    <NoteList
                        notes={notes}
                        onDeleteNoteAction={handleDeleteNote}
                        onModifyNoteAction={handleModifyNote}
                    />
                </div>
                {editingNote && (
                    <NoteEditModal
                        note={editingNote}
                        onSubmitAction={handleUpdateNote}
                        onCancelAction={handleCancelEdit}
                    />
                )}
            </div>
        </div>
    );
}

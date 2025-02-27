"use client";
import BaseCard from "../../BaseCard";

export interface StationNote {
    note_id: number;
    title: string;
    note_content: string;
    created_at: string;
    station_id: number;
    user: { name: string };
    user_id: number;
}

interface NoteCardProps {
    note: StationNote;
    onDeleteAction: (noteId: number) => void;
    onModifyAction: (noteId: number) => void;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleString();


export default function NoteCard({ note, onDeleteAction, onModifyAction }: Readonly<NoteCardProps>) {
    return (
        <BaseCard className="mb-4 p-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Par: {note.user.name}</span>
                <span>{formatDate(note.created_at)}</span>
            </div>
            <hr className="border-gray-200 my-2" />
            <h4 className="text-gray-800 text-3xl">{note.title}</h4>
            <p className="text-gray-600">{note.note_content}</p>
            <div className="flex justify-between">
                <button
                    onClick={() => onDeleteAction(note.note_id)}
                    className="mt-2 text-red-500 hover:underline"
                >
                    Supprimer
                </button>

                <button
                    onClick={() => onModifyAction(note.note_id)}
                    className="mt-2 text-red-500 hover:underline"
                >
                    Modifier
                </button>
            </div>
        </BaseCard>
    );
}

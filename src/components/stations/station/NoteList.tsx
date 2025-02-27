"use client";
import NoteCard, { StationNote } from "./NoteCard";

interface NoteListProps {
    notes: StationNote[];
    onDeleteNote: (noteId: number) => void;
    onModifyNote: (noteId: number) => void;
}

export default function NoteList({ notes, onDeleteNote, onModifyNote }: NoteListProps) {
    return (
        <div className="space-y-4">
            {notes.map((note) => (
                <NoteCard key={note.note_id} note={note} onDelete={onDeleteNote} onModify={onModifyNote} />
            ))}
        </div>
    );
}

"use client";
import NoteCard, { StationNote } from "./NoteCard";

interface NoteListProps {
    notes: StationNote[];
    onDeleteNoteAction: (noteId: number) => void;
    onModifyNoteAction: (noteId: number) => void;
}

export default function NoteList({ notes, onDeleteNoteAction, onModifyNoteAction }: Readonly<NoteListProps>) {
    return (
        <div className="space-y-4">
            {notes.map((note) => (
                <NoteCard key={note.note_id} note={note} onDeleteAction={onDeleteNoteAction} onModifyAction={onModifyNoteAction} />
            ))}
        </div>
    );
}

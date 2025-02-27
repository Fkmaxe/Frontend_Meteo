"use client";
import BaseInput from "../../BaseInput";

interface AddNoteFormProps {
    noteTitle: string;
    newNote: string;
    onTitleChange: (value: string) => void;
    onNoteChange: (value: string) => void;
    onAddNote: () => void;
}

export default function AddNoteForm({
                                        noteTitle,
                                        newNote,
                                        onTitleChange,
                                        onNoteChange,
                                        onAddNote,
                                    }: AddNoteFormProps) {
    return (
        <div className="mb-4 space-y-4">
        <BaseInput
            type="text"
    value={noteTitle}
    onChange={(e) => onTitleChange(e.target.value)}
    placeholder="Titre de la note"
    className="p-2 border rounded-md text-gray-700"
    />
    <textarea
        value={newNote}
    onChange={(e) => onNoteChange(e.target.value)}
    placeholder="Contenu de la note"
    className="w-full p-2 border rounded-md text-gray-700 min-h-[100px]"
    />
    <button onClick={onAddNote} className="mt-2 px-4 py-2 bg-bordeaux text-white rounded hover:bg-bordeaux-dark">
        Ajouter une note
    </button>
    </div>
);
}

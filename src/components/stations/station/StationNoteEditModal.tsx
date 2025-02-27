"use client";
import React from "react";
import Modal from "@/components/Modal";
import DynamicForm, {Field} from "@/components/DynamicForm";

export interface StationNote {
    note_id: number;
    title: string;
    note_content: string;
    created_at: string;
    station_id: number;
    user: { name: string };
    user_id: number;
}

interface StationNoteEditModalProps {
    note: StationNote;
    onSubmitAction: (data: Record<string, string>) => void;
    onCancelAction: () => void;
}

export default function NoteEditModal({ note, onSubmitAction, onCancelAction} : Readonly<StationNoteEditModalProps>) {
    const fields: Field[] = [
        {
            name: "title",
            label: "Titre",
            placeholder: "Entrez le titre",
            required: true,
            defaultValue: note.title,
        },
        {
            name: "content",
            label: "Contenu",
            placeholder: "Entrez le contenu",
            required: true,
            defaultValue: note.note_content,
        }
    ]

    const handleSubmit = (formData: Record<string, string>) => {
        onSubmitAction(formData);
    }

    return (
        <Modal onClose={onCancelAction} className="w-96">
            <h2 className="text-2xl font-semibold text-bordeaux mb-4">
                Modifier la note
            </h2>
            <DynamicForm fields={fields} onSubmit={handleSubmit} buttonText="Appliquer" />
            <button
                onClick={onCancelAction}
                className="mt-4 w-full bg-gray-400 text-white rounded-md px-4 py-2 rounded"
            >
                Annuler
            </button>
        </Modal>
    )
}
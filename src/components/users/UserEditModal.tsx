"use client";
import React from "react";
import Modal from "../Modal";
import DynamicForm, { Field } from "../DynamicForm";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface UserEditModalProps {
    user: User;
    onSubmitAction: (data: Record<string, string>) => void;
    onCancelAction: () => void;
}

export default function UserEditModal({ user, onSubmitAction, onCancelAction }: Readonly<UserEditModalProps>) {
    const fields: Field[] = [
        {
            name: "username",
            label: "Nom d'utilisateur",
            placeholder: "Entrez le nom",
            required: true,
            defaultValue: user.username,
        },
        {
            name: "email",
            label: "Email",
            placeholder: "Entrez l'email",
            type: "email",
            required: true,
            defaultValue: user.email,
        },
        {
            name: "role",
            label: "Rôle",
            placeholder: "Entrez le rôle",
            required: true,
            defaultValue: user.role,
        },
        {
            name: "newPassword",
            label: "Nouveau mot de passe",
            placeholder: "Laisser vide pour ne pas changer",
            type: "password",
            required: false,
            defaultValue: "",
        },
        {
            name: "confirmPassword",
            label: "Confirmer le mot de passe",
            placeholder: "Laisser vide pour ne pas changer",
            type: "password",
            required: false,
            defaultValue: "",
        },
    ];

    const handleSubmit = (formData: Record<string, string>) => {
        onSubmitAction(formData);
    };

    return (
        <Modal onClose={onCancelAction} className="w-96">
            <h2 className="text-2xl font-semibold text-bordeaux mb-4">
                Modifier l&#39;utilisateur
            </h2>
            <DynamicForm fields={fields} onSubmit={handleSubmit} buttonText="Appliquer" />
            <button
                onClick={onCancelAction}
                className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded"
            >
                Annuler
            </button>
        </Modal>
    );
}

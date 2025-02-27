"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicForm, { Field } from "../DynamicForm";
import { api } from "@/utils/api";

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}

interface UserDynamicFormProps {
    onUserCreatedAction: () => void;
}

export default function UserDynamicForm({ onUserCreatedAction }: Readonly<UserDynamicFormProps>) {
    const router = useRouter();
    const [error, setError] = useState("");

    const fields: Field[] = [
        { name: "username", label: "Nom d'utilisateur", placeholder: "Entrez le nom", required: true },
        { name: "email", label: "Email", placeholder: "Entrez l'email", type: "email", required: true },
        { name: "password", label: "Mot de passe", placeholder: "Entrez le mot de passe", type: "password", required: true },
        { name: "role", label: "Rôle", placeholder: "Entrez le rôle", required: true },
    ];

    const handleSubmit = async (formData: Record<string, string>) => {
        try {
            const userData: Omit<User, "id"> = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            const createdUser = await api.users.createUser(userData, router);
            if (createdUser) {
                onUserCreatedAction();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <h2 className="text-2xl font-semibold text-bordeaux mb-4">Créer un Utilisateur</h2>
            <DynamicForm fields={fields} onSubmit={handleSubmit} buttonText="Créer Utilisateur" />
        </div>
    );
}
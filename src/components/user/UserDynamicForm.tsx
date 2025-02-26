"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicForm, { Field } from "../DynamicForm";
import { api } from "@/utils/api";

export default function UserDynamicForm() {
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
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Non autorisé");
            const createdUser = await api.users.createUser(formData, router);
            console.log("Utilisateur créé:", createdUser);
            // Optionnel : mettre à jour l'état global ou afficher un message de succès
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <h2 className="text-2xl font-semibold text-bordeaux mb-4">Créer un Utilisateur</h2>
            <DynamicForm fields={fields} onSubmit={handleSubmit} buttonText="Créer Utilisateur" />
        </div>
    );
}

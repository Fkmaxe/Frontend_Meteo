"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicForm, { Field } from "../DynamicForm";
import { api } from "@/utils/api";

export default function LoginDynamicForm() {
    const router = useRouter();
    const [error, setError] = useState("");

    const fields: Field[] = [
        {
            name: "email",
            label: "Email",
            placeholder: "Enter your email",
            type: "email",
            required: true,
        },
        {
            name: "password",
            label: "Password",
            placeholder: "Enter your password",
            type: "password",
            required: true,
        },
    ];

    const handleSubmit = async (formData: Record<string, string>) => {
        try {
            const data = await api.users.login(formData.email, formData.password, router);
            localStorage.setItem("jwtToken", data.token);
            router.replace("/stations");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <h2 className="text-2xl font-semibold text-bordeaux mb-4">Connexion</h2>
            <DynamicForm fields={fields} onSubmit={handleSubmit} buttonText="Se connecter" />
        </div>
    );
}


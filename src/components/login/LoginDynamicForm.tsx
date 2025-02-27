"use client";
import DynamicForm, { Field } from "../DynamicForm";
import { JSX } from "react";

interface LoginDynamicFormProps {
    handleSubmit?: (formData: Record<string, string>) => Promise<void>;
}

export default function LoginDynamicForm({ handleSubmit }: Readonly<LoginDynamicFormProps>): JSX.Element {
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

    // Provide a fallback function if handleSubmit is undefined.
    const onSubmit = (formData: Record<string, string>): void => {
        if (handleSubmit) {
            handleSubmit(formData).catch((error) => {
                console.error(error);
            });
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-bordeaux mb-4">Connexion</h2>
            <DynamicForm fields={fields} onSubmit={onSubmit} buttonText="Se connecter" />
        </div>
    );
}
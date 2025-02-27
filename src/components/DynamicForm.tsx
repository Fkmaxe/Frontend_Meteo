import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import BaseInput from "@/components/BaseInput";

export interface Field {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
    props?: Record<string, any>;
}

interface DynamicFormProps {
    fields: Field[];
    onSubmit: (formData: Record<string, string>) => void;
    buttonText?: string;
}

export default function DynamicForm({
                                        fields,
                                        onSubmit,
                                        buttonText = "Soumettre",
                                    }: DynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        const initialData: Record<string, string> = {};
        fields.forEach((field) => {
            initialData[field.name] = field.defaultValue || "";
        });
        setFormData(initialData);
    }, [fields]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="dynamic-form space-y-4">
            {fields.map((field) => (
                <div className="form-group" key={field.name}>
                    <label htmlFor={field.name} className="block font-medium text-gray-700">
                        {field.label}
                    </label>

                    <BaseInput
                        type={field.type || "text"}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        {...field.props}
                    />
                </div>
            ))}
            <button type="submit" className="submit-button bg-bordeaux text-white py-2 px-4 rounded">
                {buttonText}
            </button>
        </form>
    );
}

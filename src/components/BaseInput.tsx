import React, { InputHTMLAttributes } from "react";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function BaseInput({ className = "", ...props }: BaseInputProps) {
    return (
        <input
            className={`w-full border border-gray-400 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-bordeaux ${className}`}
            {...props}
        />
    );
}

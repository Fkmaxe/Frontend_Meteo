import React from "react";

interface BaseCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function BaseCard({ children, className = "" }: BaseCardProps) {
    return (
        <div
            className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300 ${className}`}
        >
            {children}
        </div>
    );
}

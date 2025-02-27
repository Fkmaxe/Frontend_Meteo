"use client";
import React, { useEffect } from "react";

interface StatusPopupProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const StatusPopup: React.FC<StatusPopupProps> = ({
    message,
    type,
    onClose,
}) => {
    useEffect(() => {
    }, [onClose]);

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        )
    };

    return (
        <div
            className={`
                fixed top-4 left-4 z-50 p-4 m-2 rounded-lg shadow-lg
                ${type === "success" ? "bg-green-500" : "bg-red-500"}
                flex items-center gap-3 min-w-[300px]
                transition-all duration-300 transform hover:scale-102
                border border-white/20 backdrop-blur-sm bg-opacity-90
            `}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <span className="flex-grow text-white font-medium">
                {message}
            </span>
            <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full
                         hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close notification"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default StatusPopup;
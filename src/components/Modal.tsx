import React from "react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
}

export default function Modal({ children, onClose, className = "" }: ModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white p-8 rounded-lg shadow-xl ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

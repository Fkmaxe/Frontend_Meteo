"use client";
import React from "react";
import BaseCard from "../BaseCard";

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface UserCardProps {
    user: User;
    onDeleteAction: (id: number) => void;
    onModifyAction: (user: User) => void;
}

export default function UserCard({ user, onDeleteAction, onModifyAction }: Readonly<UserCardProps>) {
    return (
        <BaseCard >
            <h2 className="text-2xl font-semibold text-bordeaux mb-2">{user.username}</h2>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-gray-600 mb-4">{user.role}</p>
            <div className="flex justify-between">
                <button
                    onClick={() => onDeleteAction(user.id)}
                    className="bg-bordeaux text-white rounded-md px-4 py-2"
                >
                    Supprimer
                </button>
                <button
                    onClick={() => onModifyAction(user)}
                    className="bg-blue-400 text-white rounded-md px-4 py-2"
                >
                    Modifier
                </button>
            </div>
        </BaseCard>
    );
}

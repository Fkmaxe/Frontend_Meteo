"use client";
import BaseInput from "../BaseInput";

interface StationSearchBarProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function StationSearchBar({ search, onSearchChange }: StationSearchBarProps) {
    return (
        <div className="mb-6 flex justify-center">
            <BaseInput
                type="text"
                placeholder="Rechercher une station..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            router.replace("/stations"); // Redirige vers les stations si connecté
        } else {
            router.replace("/login"); // Redirige vers login si non connecté
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold text-bordeaux">Redirection en cours...</h1>
        </div>
    );
}

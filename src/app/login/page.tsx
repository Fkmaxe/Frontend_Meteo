"use client";
import { useState } from "react";
import { api } from "@/utils/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const data = await api.login(email, password);
            localStorage.setItem("jwtToken", data.token);
            window.location.href = "/stations";
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-bordeaux mb-6">Se Connecter</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre email"
                            className="w-full border border-gray-900 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Votre mot de passe"
                            className="w-full border border-gray-700 rounded-md px-4 py-2 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-bordeaux text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
                    >
                        Se Connecter
                    </button>
                </form>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
        </div>
    );
}

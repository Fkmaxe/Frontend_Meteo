// File: src/app/users/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface NewUser {
    username: string;
    email: string;
    password: string;
    role: string;
}

interface UpdateUser extends Partial<User> {
    newPassword?: string;
    confirmPassword?: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<NewUser>({
        username: "",
        email: "",
        password: "",
        role: "",
    });
    const [error, setError] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UpdateUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) throw new Error("Non autorisé");

                const data = await api.users.getUsers(router);
                setUsers(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            }
        };

        fetchUsers().then((r) => r);
    }, [router]);

    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Non autorisé");

            const createdUser = await api.users.createUser(newUser, router);
            setUsers([...users, createdUser]);
            // Reset new user state (id is managed by the backend)
            setNewUser({ username: "", email: "", password: "", role: "" });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Non autorisé");

            const response = await api.users.deleteUser(id, router);
            console.log(response)
            if (response === true) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handleModifyUser = (user: User) => {
        setSelectedUser({ ...user, newPassword: "", confirmPassword: "" });
        setIsModalOpen(true);
    };

    const handleModifySubmit = async () => {
        if (!selectedUser) return;

        const { newPassword, confirmPassword, ...userData } = selectedUser;

        if (newPassword && newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Non autorisé");

            const updatedUser = await api.users.updateUser(
                selectedUser.id!,
                userData,
                router
            );
            setUsers(
                users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-5xl font-bold text-center text-bordeaux mb-8">
                Gestion des Utilisateurs
            </h1>

            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                    role="alert"
                >
                    <strong className="font-bold">Erreur:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-bordeaux mb-4">
                    Créer un Utilisateur
                </h2>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={newUser.username}
                    onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                />
                <input
                    type="text"
                    placeholder="Rôle"
                    value={newUser.role}
                    onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                />
                <button
                    onClick={handleCreateUser}
                    className="w-full bg-bordeaux text-white rounded-md px-4 py-2"
                >
                    Créer Utilisateur
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-bordeaux mb-2">
                                {user.username}
                            </h2>
                            <p className="text-gray-600 mb-1">{user.email}</p>
                            <p className="text-gray-600 mb-4">{user.role}</p>
                            <div className="flex justify-between mb-4">
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-bordeaux text-white rounded-md px-4 py-2"
                                >
                                    Supprimer
                                </button>
                                <button
                                    onClick={() => handleModifyUser(user)}
                                    className="bg-blue-400 text-white rounded-md px-4 py-2"
                                >
                                    Modifier
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        Aucun utilisateur trouvé.
                    </p>
                )}
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-semibold text-bordeaux mb-4">
                            Modifier l&#39;utilisateur
                        </h2>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={selectedUser.username ?? ""}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    username: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={selectedUser.email ?? ""}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    email: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                        />
                        <input
                            type="text"
                            placeholder="Rôle"
                            value={selectedUser.role ?? ""}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    role: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                        />
                        <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={selectedUser.newPassword ?? ""}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    newPassword: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                        />
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={selectedUser.confirmPassword ?? ""}
                            onChange={(e) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    confirmPassword: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-gray-700 focus:ring-2 focus:ring-bordeaux"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white rounded-md px-4 py-2"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleModifySubmit}
                                className="bg-blue-800 text-white rounded-md px-4 py-2"
                            >
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
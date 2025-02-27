"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import UserDynamicForm from "@/components/user/UserDynamicForm";
import UserCard, { User } from "@/components/user/UserCard";
import UserEditModal from "@/components/user/UserEditModal";

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.users.getUsers(router);
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
            }
        };
        fetchUsers();
    }, [router]);

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await api.users.deleteUser(id, router);
            if (response === true) {
                setUsers((prev) => prev.filter((user) => user.id !== id));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        }
    };

    const handleModifyUser = (user: User) => {
        setEditingUser(user);
    };

    const handleUpdateUser = async (formData: Record<string, string>) => {
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            const { confirmPassword, ...userData } = formData;
            const updatedUser = await api.users.updateUser(editingUser!.id, userData, router);
            setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
            setEditingUser(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    return (
        <div >
            <h1 className="text-5xl font-bold text-center text-bordeaux mb-8">
                Gestion des Utilisateurs
            </h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <strong className="font-bold">Erreur:</strong>
                    <span className="ml-2">{error}</span>
                </div>
            )}
            <div className="w-3/4 items-center justify-center mx-auto">
                {/* Creation form */}
                <UserDynamicForm />
            </div>
            {/* User list */}
            <h2 className="text-3xl font-semibold text-bordeaux mt-8">Liste des Utilisateurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {users.length > 0 ? (
                    users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onDelete={handleDeleteUser}
                            onModify={handleModifyUser}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucun utilisateur trouvé.</p>
                )}
            </div>
            {/* Edit modal */}
            {editingUser && (
                <UserEditModal user={editingUser} onSubmit={handleUpdateUser} onCancel={handleCancelEdit} />
            )}
        </div>
    );
}

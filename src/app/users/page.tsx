"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import UserDynamicForm from "@/components/users/UserDynamicForm";
import UserCard, { User } from "@/components/users/UserCard";
import UserEditModal from "@/components/users/UserEditModal";
import { usePopup } from "@/components/Utils/PopupProvider";
import {add} from "@dnd-kit/utilities";

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();
    const { addPopup } = usePopup();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await api.users.getUsers(router);
            setUsers(data || []);
            addPopup("Utilisateurs chargés avec succès", "success");
        } catch (err) {
            addPopup(`${err}`, "error");
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers().then(r => r);
    }, [router, refreshKey]);

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await api.users.deleteUser(id, router);
            if (response === true) {
                setUsers((prev) => prev.filter((user) => user.id !== id));
                setRefreshKey(prev => prev + 1);
                addPopup("Utilisateur supprimé avec succès", "success");
            }
        } catch (err) {
            addPopup(`${err}`, "error");
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        }
    };

    const handleModifyUser = (user: User) => {
        setEditingUser(user);
    };

    const handleUpdateUser = async (formData: Record<string, string>) => {
        if (!editingUser) return;

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            addPopup("Les mots de passe ne correspondent pas", "error");
            return;
        }

        try {
            const { ...userData } = formData;
            const updatedUser = await api.users.updateUser(editingUser.id, userData, router);
            setUsers((prevUsers) => prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
            setEditingUser(null);
            setRefreshKey(prev => prev + 1);
            addPopup("Utilisateur mis à jour avec succès", "success");
        } catch (err) {
            addPopup(`${err}`, "error");
            setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
        }
    };

    const handleUserCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-bordeaux">Chargement...</p>
            </div>
        );
    }

    return (
        <div>
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
                <UserDynamicForm onUserCreatedAction={handleUserCreated} />
            </div>
            <h2 className="text-3xl font-semibold text-bordeaux mt-8">Liste des Utilisateurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onDeleteAction={handleDeleteUser}
                            onModifyAction={handleModifyUser}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucun utilisateur trouvé.</p>
                )}
            </div>
            {editingUser && (
                <UserEditModal
                    user={editingUser}
                    onSubmitAction={handleUpdateUser}
                    onCancelAction={handleCancelEdit}
                />
            )}
        </div>
    );
}
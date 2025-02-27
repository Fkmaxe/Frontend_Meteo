import { ApiCall, handleApiError } from "@/utils/apiUtils";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface ApiError extends Error {
    code?: string;
    status?: number;
    originalMessage?: string;
}

export const UserService = (
    API_BASE_URL: string,
    getToken: () => string | null
) => ({
    login: async (
        email: string,
        password: string,
        router: ReturnType<typeof import("next/navigation").useRouter>
    ) => {
        try {
            const response = await ApiCall(
                fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error("Login error:", error);

            // Custom messages for login errors
            const loginErrorMessages = {
                401: "Email ou mot de passe incorrect",
                UNAUTHORIZED: "Email ou mot de passe incorrect",
                404: "Service d'authentification indisponible",
                500: "Erreur serveur lors de la tentative de connexion"
            };

            handleApiError(error, 'connexion', undefined, loginErrorMessages);
        }
    },

    getUsers: async (
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error("Get users error:", error);

            const userErrorMessages = {
                403: "Vous n'avez pas les droits nécessaires pour accéder à la liste des utilisateurs",
                404: "Liste des utilisateurs indisponible",
                500: "Erreur serveur lors de la récupération des utilisateurs"
            };

            handleApiError(error, 'utilisateurs', undefined, userErrorMessages);
        }
    },

    createUser: async (
        user: Omit<User, 'id'>,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/users`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user),
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error("Create user error:", error);

            const createUserErrorMessages = {
                400: "Données utilisateur invalides. Veuillez vérifier les informations saisies.",
                403: "Vous n'avez pas les droits nécessaires pour créer un utilisateur",
                409: "Un utilisateur avec cet email existe déjà",
                500: "Erreur serveur lors de la création de l'utilisateur"
            };

            handleApiError(error, 'création utilisateur', undefined, createUserErrorMessages);
        }
    },

    deleteUser: async (
        id: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/users/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Delete user ${id} error:`, error);

            const deleteUserErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour supprimer l'utilisateur ${id}`,
                404: `Utilisateur ${id} introuvable`,
                409: `Impossible de supprimer l'utilisateur ${id} car il est associé à d'autres ressources`,
                500: `Erreur serveur lors de la suppression de l'utilisateur ${id}`
            };

            handleApiError(error, 'utilisateur', id, deleteUserErrorMessages);
        }
    },

    updateUser: async (
        id: number,
        userData: Partial<User> & { password?: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/users/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData),
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Update user ${id} error:`, error);

            const updateUserErrorMessages = {
                400: `Données invalides pour la modification de l'utilisateur ${id}`,
                403: `Vous n'avez pas les droits nécessaires pour modifier l'utilisateur ${id}`,
                404: `Utilisateur ${id} introuvable`,
                409: `Un autre utilisateur utilise déjà cet email`,
                500: `Erreur serveur lors de la modification de l'utilisateur ${id}`
            };

            handleApiError(error, 'modification utilisateur', id, updateUserErrorMessages);
        }
    },

    getUserById: async (
        id: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Unauthorized access');

            const response = await ApiCall(
                fetch(`${API_BASE_URL}/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }),
                router
            );

            if (!response) {
                throw new Error("No response from server");
            }

            return response;
        } catch (error) {
            console.error(`Get user ${id} error:`, error);

            const getUserErrorMessages = {
                403: `Vous n'avez pas les droits nécessaires pour accéder à l'utilisateur ${id}`,
                404: `Utilisateur ${id} introuvable`,
                500: `Erreur serveur lors de la récupération de l'utilisateur ${id}`
            };

            handleApiError(error, 'utilisateur', id, getUserErrorMessages);
        }
    }
});
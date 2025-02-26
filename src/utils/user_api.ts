import {ApiCall} from "@/utils/apiUtils";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
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
        return ApiCall(
            fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }),
            router
        );
    },

    getUsers: async (
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${getToken()}`, "Content-Type": "application/json"},
            }),
            router
        );
    },

    createUser: async (
        user: Omit<User, 'id'>,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${getToken()}`, "Content-Type": "application/json" },
                body: JSON.stringify(user),
            }),
            router
        );
    },

    deleteUser: async (
        id: number,
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${getToken()}` },
            }),
            router
        );
    },

    updateUser: async (
        id: number,
        userData: Partial<User> & { password?: string },
        router: ReturnType<typeof import('next/navigation').useRouter>
    ) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${getToken()}`, "Content-Type": "application/json" },
                body : JSON.stringify(userData),
            }),
            router
        );
    },
});

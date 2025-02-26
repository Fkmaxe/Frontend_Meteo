import {ApiCall} from "@/utils/apiUtils";

export const UserService = (API_BASE_URL: string) => ({

    login: async (email: string, password: string, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }),
            router
        );
    },

    getUsers: async (token: string, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`, "Content-Type": "application/json"},
            }),
            router
        );
    },

    createUser: async (user: any, token: string, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(user),
            }),
            router
        );
    },

    deleteUser: async (id: number, token: string, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            }),
            router
        );
    },

    updateUser: async (id: number, userData: Partial<NewUser>, token: string, router: ReturnType<typeof import('next/navigation').useRouter>) => {
        return ApiCall(
            fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
                body : JSON.stringify(userData),
            }),
            router
        );
    },
});

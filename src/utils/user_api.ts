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
           return await ApiCall(
               fetch(`${API_BASE_URL}/auth/login`, {
                   method: "POST",
                   headers: { "Content-Type": "application/json" },
                   body: JSON.stringify({ email, password }),
               }),
               router
           );
       } catch (error) {
           handleApiError(error as ApiError, 'connexion');
       }
   },

   getUsers: async (
       router: ReturnType<typeof import('next/navigation').useRouter>
   ) => {
       try {
           const token = getToken();
           if (!token) throw new Error('Unauthorized access');

           return await ApiCall(
               fetch(`${API_BASE_URL}/users`, {
                   method: 'GET',
                   headers: {
                       'Authorization': `Bearer ${token}`,
                       "Content-Type": "application/json"
                   },
               }),
               router
           );
       } catch (error) {
           handleApiError(error as ApiError, 'utilisateurs');
       }
   },

   createUser: async (
       user: Omit<User, 'id'>,
       router: ReturnType<typeof import('next/navigation').useRouter>
   ) => {
       try {
           const token = getToken();
           if (!token) throw new Error('Unauthorized access');

           return await ApiCall(
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
       } catch (error) {
           handleApiError(error as ApiError, 'création utilisateur');
       }
   },

   deleteUser: async (
       id: number,
       router: ReturnType<typeof import('next/navigation').useRouter>
   ) => {
       try {
           const token = getToken();
           if (!token) throw new Error('Unauthorized access');

           return await ApiCall(
               fetch(`${API_BASE_URL}/users/${id}`, {
                   method: 'DELETE',
                   headers: { 'Authorization': `Bearer ${token}` },
               }),
               router
           );
       } catch (error) {
           handleApiError(error as ApiError, 'utilisateur', id);
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

           return await ApiCall(
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
       } catch (error) {
           handleApiError(error as ApiError, 'modification utilisateur', id);
       }
   },
});
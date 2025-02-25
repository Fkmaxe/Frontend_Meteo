export const UserService = (API_BASE_URL: string) => ({
    getUsers: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    createUser: async (user: any, token: string) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error("Failed to create user");
        return response.json();
    },

    deleteUser: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete user');

        if (response.status === 204) {
            return null;
        }
        return response.json();
    },

    updateUser: async (id: number, userData: Partial<NewUser>, token: string) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },
});

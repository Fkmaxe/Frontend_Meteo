export const UserService = (API_BASE_URL: string) => ({
    // Users
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

        // Handle 204 No Content response
        if (response.status === 204) {
            return null; // No content to parse
        }
        return response.json();
    },

    modifyUser: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            // You might want to add a body here if needed:
            // body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to modify user');
        return response.json();
    },
});
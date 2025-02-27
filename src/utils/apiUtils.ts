interface ApiError extends Error {
    code?: string;
    status?: number;
}

export const ApiCall = async (
    fetchPromise: Promise<Response>,
    router: ReturnType<typeof import("next/navigation").useRouter>
) => {
    try {
        const response = await fetchPromise;

        if (response.status === 401) {
            if (router && typeof router.push === "function") {
                router.push("/login");
            }
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            const error = new Error(errorData.message || "An error occurred") as ApiError;
            error.status = response.status;
            error.code = errorData.code;
            throw error;
        }

        if (response.headers.get("Content-Type")?.includes("application/json")) {
            return await response.json();
        }
        return response.ok;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export function handleApiError(error: ApiError, context: string, id?: number): never {
    const idStr = id ? ` ${id}` : '';
    if (error.message === 'Unauthorized access') {
        throw new Error(`Vous n'avez pas la permission d'accéder à ${context}${idStr}`);
    }
    if (error.status === 404) {
        throw new Error(`${context}${idStr} introuvable`);
    }
    throw new Error(`Échec de l'opération sur ${context}${idStr}`);
}
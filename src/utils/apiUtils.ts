// Types definition
interface ApiErrorResponse {
    message: string;
    error?: string;
    statusCode?: number;
    code?: string;
}

interface ApiError extends Error {
    code?: string;
    status?: number;
    originalMessage?: string;
}

export const ApiCall = async (
    fetchPromise: Promise<Response>,
    router: ReturnType<typeof import("next/navigation").useRouter>
) => {
    try {
        const response = await fetchPromise;

        // Handle authentication errors
        if (response.status === 401) {
            // Try to parse the error response first to get the message
            let errorData: ApiErrorResponse;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: "Unauthorized access" };
            }

            const error = new Error(errorData.message || "Unauthorized access") as ApiError;
            error.status = 401;
            error.code = "UNAUTHORIZED";
            error.originalMessage = errorData.message;

            // Only redirect if it's a true auth error, not a login failure
            if (!response.url.includes("/auth/login")) {
                if (router && typeof router.push === "function") {
                    router.push("/login");
                }
            }

            throw error;
        }

        // Handle other error responses
        if (!response.ok) {
            let errorData: ApiErrorResponse;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: `HTTP Error ${response.status}`, statusCode: response.status };
            }

            const error = new Error(errorData.message || `HTTP Error ${response.status}`) as ApiError;
            error.status = response.status || errorData.statusCode;
            error.code = errorData.code || errorData.error;
            error.originalMessage = errorData.message;
            throw error;
        }

        // Handle successful responses
        if (response.status === 204) {
            return true; // No content but successful
        }

        // Parse JSON if content type is json
        if (response.headers.get("Content-Type")?.includes("application/json")) {
            return await response.json();
        }

        return true; // Default success response
    } catch (error) {
        if (error instanceof Error) {
            console.error(`API Error: ${error.message}`);
            throw error;
        }

        // Handle non-Error thrown objects
        const genericError = new Error("An unexpected error occurred") as ApiError;
        genericError.originalMessage = String(error);
        console.error("Unexpected API error:", error);
        throw genericError;
    }
};

export function handleApiError(
    error: unknown,
    context: string,
    id?: number,
    customMessages?: Record<number | string, string>
): never {
    // Ensure error is of ApiError type or convert it
    const apiError = error instanceof Error
        ? (error as ApiError)
        : new Error(String(error)) as ApiError;

    const idStr = id ? ` ${id}` : '';

    // Use custom error messages if provided
    if (customMessages && apiError.status && customMessages[apiError.status]) {
        throw new Error(customMessages[apiError.status]);
    }

    if (customMessages && apiError.code && customMessages[apiError.code]) {
        throw new Error(customMessages[apiError.code]);
    }

    // Use original message from API if available
    if (apiError.originalMessage) {
        throw new Error(apiError.originalMessage);
    }

    // Default error messages based on status code
    if (apiError.message === 'Unauthorized access' || apiError.status === 401) {
        throw new Error(`Vous n'avez pas la permission d'accéder à ${context}${idStr}`);
    }

    if (apiError.status === 404) {
        throw new Error(`${context}${idStr} introuvable`);
    }

    if (apiError.status === 400) {
        throw new Error(`Données invalides pour ${context}${idStr}`);
    }

    if (apiError.status === 403) {
        throw new Error(`Accès refusé à ${context}${idStr}`);
    }

    if (apiError.status === 500) {
        throw new Error(`Erreur serveur lors de l'opération sur ${context}${idStr}`);
    }

    // Default fallback error
    throw new Error(`Échec de l'opération sur ${context}${idStr}: ${apiError.message}`);
}
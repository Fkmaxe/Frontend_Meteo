// A generic API call wrapper that handles token expiry by redirecting via the router.
// The router must be passed from the component that uses this function.
export const ApiCall = async (
    fetchPromise: Promise<Response>,
    router: ReturnType<typeof import("next/navigation").useRouter>
) => {
    try {
        const response = await fetchPromise;

        if (response.status === 401) {
            // Token expired, redirect to login
            router.push("/login");
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred");
        }

        return response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};
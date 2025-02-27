"use client";
import LoginDynamicForm from "@/components/login/LoginDynamicForm";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { usePopup } from "@/components/Utils/PopupProvider";

export default function Login() {
    const router = useRouter();
    const { addPopup } = usePopup();

    const handleSubmit = async (formData: Record<string, string>) => {
        try {
            const data = await api.users.login(formData.email, formData.password, router);

            if (!data || !data.token) {
                addPopup("Réponse invalide du serveur", "error");
                return;
            }

            localStorage.setItem("jwtToken", data.token);
            addPopup("Connexion réussie", "success");
            router.replace("/stations");
        } catch (err) {
            if (err instanceof Error) {
                // The error message will now come directly from handleApiError
                // which includes the custom messages
                addPopup(err.message, "error");
            } else {
                addPopup("Une erreur inconnue s'est produite", "error");
                console.error("Unknown error:", err);
            }
        }
    };

    return (
        <div className="w-3/4 mt-24 items-center justify-center mx-auto">
            <LoginDynamicForm handleSubmit={handleSubmit} />
        </div>
    );
}
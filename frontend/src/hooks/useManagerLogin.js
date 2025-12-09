import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "@/hooks/useForm";

export function useManagerLogin() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { formData, handleInputChange } = useForm({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Mock login for manager
        const mockToken = "mock-manager-token";
        localStorage.setItem("token", mockToken);
        router.push("/manager/dashboard");
    };

    return {
        showPassword,
        setShowPassword,
        formData,
        handleInputChange,
        handleSubmit,
    };
}

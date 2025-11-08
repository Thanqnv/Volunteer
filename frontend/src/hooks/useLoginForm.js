import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const useLogin = (onSuccess) => {
  const { login } = useAuth(); // Lấy hàm login từ AuthContext
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If API_BASE_URL is not set, fallback to a mock login for local dev
      if (!API_BASE_URL) {
        // Small delay to simulate network
        await new Promise((res) => setTimeout(res, 500));
        const mockToken = "mock-token-localdev";
        login(mockToken);
        toast({ title: "Đăng nhập (mock) thành công", description: "Bạn đang ở chế độ phát triển." });
        if (onSuccess) onSuccess();
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        login(token);
        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn trở lại.",
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Lỗi đăng nhập",
          description: data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      // If fetch failed (server down), provide clearer guidance and fallback option
      toast({
        title: "Lỗi hệ thống",
        description:
          "Không thể kết nối đến server. Kiểm tra biến môi trường NEXT_PUBLIC_API_BASE_URL hoặc chạy backend. Đang chuyển sang chế độ mock tạm thời.",
        variant: "destructive",
      });

      // fallback to mock token so dev can continue
      await new Promise((res) => setTimeout(res, 500));
      const fallbackToken = "mock-token-fallback";
      login(fallbackToken);
      if (onSuccess) onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
  };
};

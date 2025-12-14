import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/useLoginForm";

const ErrorMessage = ({ message }) => (
  <p className="text-red-600 text-center">{message}</p>
);

import { auth, googleProvider } from "@/configs/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const { formData, loading, errorMessage, handleInputChange, handleSubmit, setFieldValue } =
    useLogin((data, form) => {
      const role = form?.role || "volunteer";
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "manager") {
        router.push("/manager/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    });

  useEffect(() => {
    if (router.query.role) {
      setFieldValue("role", router.query.role);
    }
  }, [router.query.role, setFieldValue]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      login(token);

      // Redirect based on selected role
      const role = formData.role || "volunteer";
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "manager") {
        router.push("/manager/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center pt-32 pb-24 overflow-hidden"
      style={{ backgroundImage: "url('/clouds-background.jpg')" }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-white/20 to-blue-50/30"></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-md mx-4 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 to-blue-200/40 rounded-2xl blur-xl opacity-60"></div>

        <div className="relative backdrop-blur-xl bg-white/80 border border-white/60 rounded-2xl shadow-2xl overflow-hidden">
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-300/20 via-blue-300/20 to-green-300/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent drop-shadow-sm">
                Chào Mừng Trở Lại
              </h1>
              <p className="text-gray-600 text-sm">
                Nhập thông tin đăng nhập để truy cập tài khoản của bạn
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50/80 border border-red-200/60 backdrop-blur-sm">
                  <p className="text-red-600 text-center text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700 block">
                  Lựa chọn vai trò đăng nhập
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-3 bg-white/60 border border-gray-200/60 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/80 cursor-pointer"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="volunteer">Tình nguyện viên</option>
                  <option value="manager">Quản lý</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-2 text-gray-500 backdrop-blur-sm">hoặc</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white/60 hover:bg-white/80 border border-gray-200/60 text-gray-700 font-medium rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Đăng nhập với Google
            </button>

            {/* Footer Links */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full text-gray-600 hover:text-green-600 text-sm transition-colors font-medium"
              >
                Quên mật khẩu?
              </button>
              <p className="text-sm text-center text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link href="/signup" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}
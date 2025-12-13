import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/router";
import { useLogin } from "@/hooks/useLoginForm";

const ManagerLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSuccess = (role) => {
    if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (role === "MANAGER") {
      router.push("/manager/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  };

  const { formData, loading, errorMessage, handleInputChange, handleSubmit } =
    useLogin(handleLoginSuccess, "MANAGER");

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/clouds-background.jpg')" }}
    >
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-green-500">
            Dang nhap Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage ? (
              <p className="text-red-600 text-center">{errorMessage}</p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Vai tro</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  handleInputChange({ target: { name: "role", value } })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chon vai tro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="VOLUNTEER">User (Volunteer)</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mat khau</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-[#d55643] text-white"
              disabled={loading}
            >
              {loading ? "Dang dang nhap..." : "Dang nhap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerLogin;

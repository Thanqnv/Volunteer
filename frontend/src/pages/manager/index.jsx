import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/router'

export default function ManagerLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mock login for manager
    const mockToken = 'mock-manager-token'
    localStorage.setItem('token', mockToken)
    router.push('/manager/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/clouds-background.jpg')" }}>
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-green-500">Đăng nhập Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleInputChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-500 hover:bg-[#d55643] text-white">Đăng nhập</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

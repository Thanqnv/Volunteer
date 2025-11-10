import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const FormApply = ({ onSuccess, registerAdmin }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                setIsLoading(true);
                await registerAdmin(formData);

                // Clear form after successful submission
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    repeatPassword: ''
                });

                toast({
                    title: "Thành công",
                    description: "Quản trị viên mới đã được thêm vào danh sách",
                });

                onSuccess?.();
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: error.message || "Đã có lỗi xảy ra, vui lòng thử lại",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }
    }
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Thiếu tên'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Thiếu họ'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Thiếu email'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (!formData.password) {
            newErrors.password = 'Thiếu mật khẩu'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Độ dài mật khẩu tối thiểu 6 ký tự'
        }

        if (formData.password !== formData.repeatPassword) {
            newErrors.repeatPassword = 'Mật khẩu không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
                <Input
                    type="text"
                    name="firstName"
                    placeholder="Tên"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
            </div>

            <div>
                <Input
                    type="text"
                    name="lastName"
                    placeholder="Họ"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
            </div>

            <div>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            <div>
                <Input
                    type="password"
                    name="password"
                    placeholder="Mật Khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
            </div>

            <div>
                <Input
                    type="password"
                    name="repeatPassword"
                    placeholder="Nhập Lại Mật Khẩu"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    className={errors.repeatPassword ? 'border-red-500' : ''}
                />
                {errors.repeatPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
            >
                {isLoading ? 'Đang xử lý...' : 'Lưu'}
            </Button>
        </form>
    )
}
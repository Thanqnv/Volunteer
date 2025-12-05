import { useState, useEffect, useCallback } from 'react';
import { statisticService } from '@/services/statisticService';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';

export const useStatistics = () => {
    const router = useRouter();
    const [data, setData] = useState({
        "flights": 0,
        "tickets": 0,
        "revenue": 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchStatistics = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/admin');
            return;
        }

        setIsLoading(true);
        try {
            const res = await statisticService.getStatistics();
            setData(res.data);
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra khi kết nối với máy chủ, vui lòng tải lại trang hoặc đăng nhập lại",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    return {
        data,
        isLoading,
        refreshStatistics: fetchStatistics
    };
};

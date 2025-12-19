/**
 * @file notificationService.js
 * @description Service for handling general system notifications (not limited to manager).
 * Includes fetching notifications and marking them as read.
 */

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const notificationService = {
    async getNotifications(page = 1, limit = 10) {
        try {
            // const response = await fetch(`${API_URL}/api/notifications?page=${page}&limit=${limit}`, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            // });
            const response = await axios.get(`${API_URL}/api/notifications?page=${page}&limit=${limit}`, {
                headers: getAuthHeader(),
            });

            if (!response.ok) {
                throw new Error("Lỗi khi tải danh sách thông báo");
            }

            return await response.json();
        } catch (error) {
            console.error("Notification Service Error:", error);
            throw error;
        }
    },

    async markAsRead(id) {
        try {
            // const response = await fetch(
            //     `${API_URL}/api/notifications/${id}/mark-read`,
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //     }
            // );
            const response = await axios.post(
                `${API_URL}/api/notifications/${id}/mark-read`,
                {},
                {
                    headers: getAuthHeader(),
                }
            );

            if (!response.ok) {
                throw new Error("Lỗi khi cập nhật trạng thái");
            }

            return true;
        } catch (error) {
            console.error("Mark as read error:", error);
            throw error;
        }
    }
};

/**
 * @file notificationService.js
 * @description Service for handling general system notifications (not limited to manager).
 * Includes fetching notifications and marking them as read.
 */

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const notificationService = {
  /**
   * Lấy danh sách thông báo của user
   */
  async getUserNotifications(userId, { page = 0, limit = 10, isRead } = {}) {
    try {
      const params = { page, limit };
      if (isRead !== undefined) {
        params.isRead = isRead;
      }

      const response = await axios.get(
        `${API_URL}/api/notifications/${userId}`,
        {
          params,
          headers: { "Content-Type": "application/json" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get User Notifications Error:", error);
      throw error;
    }
  },

  async getNotifications(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${API_URL}/api/notifications?page=${page}&limit=${limit}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách thông báo");
      }

      return await response.json();
    } catch (error) {
      console.error("Notification Service Error:", error);
      throw error;
    }
  },

  async markAsRead(notificationId, userId) {
    if (!userId) {
      throw new Error("User ID is required to mark notification as read");
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/notifications/${notificationId}/read/${userId}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (error) {
      console.error("Mark as read error:", error);
      throw error;
    }
  },
};

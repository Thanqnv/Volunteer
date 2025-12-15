/**
 * @file channelService.js
 * @description Service for managing event channels (Unlock/Lock, Access).
 */
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const channelService = {
    /**
     * Get channel info for an event
     * @param {string} eventId 
     */
    getChannelInfo: async (eventId) => {
        const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/channel`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    /**
     * Lock or unlock a channel
     * @param {string} eventId 
     * @param {boolean} isLocked 
     */
    lockChannel: async (eventId, isLocked) => {
        const response = await axios.put(`${API_BASE_URL}/api/events/${eventId}/channel/lock`, { is_locked: isLocked }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    /**
     * Update channel access settings
     * @param {string} eventId 
     * @param {boolean} isAccessible 
     */
    updateChannelAccess: async (eventId, isAccessible) => {
        const response = await axios.put(`${API_BASE_URL}/api/events/${eventId}/channel/access`, { is_accessible: isAccessible }, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

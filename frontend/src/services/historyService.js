import axios from "axios";
import { getEvents } from "./managerService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const historyService = {
    getEvents: async (userId, filters = {}) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/users/${userId}/events`,
        { params: filters }
    );
    return response.data;

    // getInteractions: async (filters = {}) => {
    //     await delay(600);
    //     return {
    //         data: MOCK_INTERACTIONS,
    //         total: MOCK_INTERACTIONS.length
    //     };
    // },

    // getStats: async () => {
    //     await delay(500);
    //     return {
    //         totalEvents: MOCK_EVENTS.length,
    //         completed: MOCK_EVENTS.filter(e => e.status === 'completed').length,
    //         interactions: MOCK_INTERACTIONS.length,
    //         thisMonth: 2 // Hardcoded for demo
    //     };
    // }
},
};
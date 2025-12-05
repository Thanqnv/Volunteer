
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const statisticService = {
    getStatistics: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/statistic`, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Send request failed");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching statistics:", error);
            throw error;
        }
    }
};

import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const generateDatePlan = async (preferences) => {
    try {
        const response = await axios.post(`${API_URL}/generate-date-plan/`, preferences);
        return response.data;
    } catch (error) {
        console.error("Error fetching date plan:", error);
        return { itinerary: "Error generating itinerary. Please try again later." };
    }
};

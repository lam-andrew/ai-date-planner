import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const generateDatePlan = async (preferences) => {
    try {
        console.log("FRONTEND CALLING BACKEND", preferences);
        const response = await axios.post(
            `${API_URL}/generate-date-plan/`,
            preferences,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching date plan:", error);
        return { itinerary: "Error generating itinerary. Please try again later." };
    }
};

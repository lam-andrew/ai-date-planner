import React from "react";
import { Box, Typography, Divider, Card, CardContent, List, ListItem } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";  // 📍 Location Icon
import RestaurantIcon from "@mui/icons-material/Restaurant"; // 🍽️ Restaurant Icon
import StarIcon from "@mui/icons-material/Star"; // ⭐ Rating Icon
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates"; // 💡 Tips Icon

const DateItinerary = ({ itineraryData }) => {
    if (!itineraryData || !Array.isArray(itineraryData.itinerary)) {
        return <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>No itinerary available.</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                🎉 Your AI-Generated Date Itinerary
            </Typography>

            {itineraryData.itinerary.map((step) => (
                <Card key={step.step} sx={{ mb: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            {step.step}. {step.title}
                        </Typography>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                            <PlaceIcon sx={{ mr: 1, color: "primary.main" }} /> <strong>Location:</strong> {step.location}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 4 }}>{step.address}</Typography>

                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <RestaurantIcon sx={{ mr: 1, color: "secondary.main" }} /> <strong>Type:</strong> {step.type.join(", ")}
                        </Typography>

                        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <StarIcon sx={{ mr: 1, color: "gold" }} /> <strong>Rating:</strong> {step.rating} ⭐ ({step.user_rating_count} reviews)
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            📝 <strong>Description:</strong> {step.description}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TipsAndUpdatesIcon sx={{ mr: 1, color: "blue" }} /> 💡 Tips:
            </Typography>
            <List>
                {itineraryData.tips.map((tip, index) => (
                    <ListItem key={index}>• {tip}</ListItem>
                ))}
            </List>
        </Box>
    );
};

export default DateItinerary;

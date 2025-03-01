import React, { useState, useRef } from "react";
import { TextField, Button, Chip, Slider, Stepper, Step, StepLabel, Box, CircularProgress } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import { generateDatePlan } from "../api";
import DateItinerary from "./DateItinerary"; // Import the new component for structured display

const dateTypes = ["Romantic", "Casual", "First Date", "Anniversary"];

// Food Options from CATEGORY_MAPPING
const foodOptions = [
    "Bar", "Cafe", "Coffee Shop", "Dessert Shop", "Fine Dining", "French", "Greek", "Italian",
    "Japanese", "Korean", "Mexican", "Pizza", "Seafood", "Spanish", "Steakhouse", "Sushi",
    "Thai", "Vegan", "Vegetarian"
];

// Activity Options from CATEGORY_MAPPING
const activityOptions = [
    "Art Gallery", "Museum", "Performing Arts Theater", "Amusement Park", "Aquarium",
    "Bowling Alley", "Comedy Club", "Concert Hall", "Karaoke", "Movie Theater",
    "Night Club", "Observation Deck", "Planetarium", "Zoo", "Botanical Garden",
    "Hiking Area", "Park", "Picnic Ground"
];

const DatePlannerForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        location: "",
        date_type: "Romantic",
        food_preferences: [],
        activity_preferences: [],
        budget: 50
    });

    const [itineraryData, setItineraryData] = useState(null); // Store JSON response from API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const autocompleteRef = useRef(null);

    // Handle Location Selection
    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.address_components) {
                let city = "";
                let state = "";
                let country = "";

                place.address_components.forEach(component => {
                    if (component.types.includes("locality")) city = component.long_name;
                    if (component.types.includes("administrative_area_level_1")) state = component.short_name;
                    if (component.types.includes("country")) country = component.long_name;
                });

                const formattedLocation = `${city}${state ? ", " + state : ""}${country ? ", " + country : ""}`;
                setFormData({ ...formData, location: formattedLocation });
            }
        }
    };

    // Handle Other Input Changes
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Toggle selection for multi-choice fields (Food & Activities)
    const handleToggleSelection = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(f => f !== item)
                : [...prev[field], item]
        }));
    };

    // Handle Step Navigation
    const handleNext = () => setActiveStep(prevStep => prevStep + 1);
    const handleBack = () => setActiveStep(prevStep => prevStep - 1);

    // Submit the Form
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setItineraryData(null); // Reset previous itinerary

        try {
            const response = await generateDatePlan(formData);
            
            if (response && response.itinerary && Array.isArray(response.itinerary)) {
                setItineraryData(response);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            setError("Failed to generate the itinerary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", textAlign: "center", p: 3 }}>
            <Stepper activeStep={activeStep}>
                <Step><StepLabel>Location</StepLabel></Step>
                <Step><StepLabel>Date Type</StepLabel></Step>
                <Step><StepLabel>Food Preferences</StepLabel></Step>
                <Step><StepLabel>Activity Preferences</StepLabel></Step>
                <Step><StepLabel>Budget</StepLabel></Step>
                <Step><StepLabel>Confirm</StepLabel></Step>
            </Stepper>

            {activeStep === 0 && (
                <Autocomplete
                    onLoad={(auto) => (autocompleteRef.current = auto)}
                    onPlaceChanged={handlePlaceSelect}
                >
                    <TextField
                        label="Enter Location"
                        fullWidth
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                    />
                </Autocomplete>
            )}

            {activeStep === 1 && (
                <TextField
                    select
                    label="Date Type"
                    value={formData.date_type}
                    onChange={(e) => handleChange("date_type", e.target.value)}
                    fullWidth
                    SelectProps={{ native: true }}
                >
                    {dateTypes.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </TextField>
            )}

            {activeStep === 2 && (
                <Box>
                    <h3>Select Food Preferences</h3>
                    {foodOptions.map(food => (
                        <Chip
                            key={food}
                            label={food}
                            onClick={() => handleToggleSelection("food_preferences", food)}
                            sx={{ m: 1, backgroundColor: formData.food_preferences.includes(food) ? "primary.light" : "default" }}
                        />
                    ))}
                </Box>
            )}

            {activeStep === 3 && (
                <Box>
                    <h3>Select Activities</h3>
                    {activityOptions.map(activity => (
                        <Chip
                            key={activity}
                            label={activity}
                            onClick={() => handleToggleSelection("activity_preferences", activity)}
                            sx={{ m: 1, backgroundColor: formData.activity_preferences.includes(activity) ? "primary.light" : "default" }}
                        />
                    ))}
                </Box>
            )}

            {activeStep === 4 && (
                <Box>
                    <h3>Budget</h3>
                    <Slider
                        value={formData.budget}
                        onChange={(e, newValue) => handleChange("budget", newValue)}
                        valueLabelDisplay="auto"
                        step={10}
                        min={20}
                        max={200}
                    />
                    <p>Budget: ${formData.budget}</p>
                </Box>
            )}

            {activeStep === 5 && (
                <Box>
                    <h3>Confirm Your Selections</h3>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Date Type:</strong> {formData.date_type}</p>
                    <p><strong>Food Preferences:</strong> {formData.food_preferences.join(", ")}</p>
                    <p><strong>Activity Preferences:</strong> {formData.activity_preferences.join(", ")}</p>
                    <p><strong>Budget:</strong> ${formData.budget}</p>
                </Box>
            )}

            <Box sx={{ mt: 2 }}>
                {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
                {activeStep < 5 && <Button onClick={handleNext}>Next</Button>}
                {activeStep === 5 && <Button onClick={handleSubmit} variant="contained" color="primary">Generate Plan</Button>}
            </Box>

            {loading && <CircularProgress sx={{ mt: 2 }} />}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {itineraryData && <DateItinerary itineraryData={itineraryData} />}
        </Box>
    );
};

export default DatePlannerForm;

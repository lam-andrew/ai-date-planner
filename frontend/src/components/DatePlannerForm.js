import React, { useState } from "react";
import { TextField, Button, Chip, Slider, Stepper, Step, StepLabel, Box, Autocomplete } from "@mui/material";
import { generateDatePlan } from "../api";

// List of options for selection
const foodOptions = ["Italian", "Sushi", "Vegan", "Mexican", "Steakhouse"];
const activityOptions = ["Outdoor", "Movie", "Museum", "Live Music", "Scenic View"];
const dateTypes = ["Romantic", "Casual", "First Date", "Anniversary"];

const DatePlannerForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        location: "",
        date_type: "Romantic",
        food_preferences: [],
        activity_preferences: [],
        budget: 50
    });

    const [itinerary, setItinerary] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle Input Changes
    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Handle Step Navigation
    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    // Submit the Form
    const handleSubmit = async () => {
        setLoading(true);
        const response = await generateDatePlan(formData);
        setItinerary(response.itinerary);
        setLoading(false);
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
                    freeSolo
                    options={[]} // TODO: Integrate Google Places API
                    onChange={(event, value) => handleChange("location", value)}
                    renderInput={(params) => <TextField {...params} label="Enter Location" fullWidth />}
                />
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
                    {foodOptions.map((food) => (
                        <Chip
                            key={food}
                            label={food}
                            onClick={() =>
                                handleChange("food_preferences",
                                    formData.food_preferences.includes(food)
                                        ? formData.food_preferences.filter(f => f !== food)
                                        : [...formData.food_preferences, food]
                                )
                            }
                            sx={{ m: 1, backgroundColor: formData.food_preferences.includes(food) ? "primary.light" : "default" }}
                        />
                    ))}
                </Box>
            )}

            {activeStep === 3 && (
                <Box>
                    {activityOptions.map((activity) => (
                        <Chip
                            key={activity}
                            label={activity}
                            onClick={() =>
                                handleChange("activity_preferences",
                                    formData.activity_preferences.includes(activity)
                                        ? formData.activity_preferences.filter(a => a !== activity)
                                        : [...formData.activity_preferences, activity]
                                )
                            }
                            sx={{ m: 1, backgroundColor: formData.activity_preferences.includes(activity) ? "primary.light" : "default" }}
                        />
                    ))}
                </Box>
            )}

            {activeStep === 4 && (
                <Box>
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

            {loading && <p>Generating your perfect date plan... ⏳</p>}

            {itinerary && (
                <Box sx={{ mt: 3, p: 2, border: "1px solid gray", borderRadius: "5px" }}>
                    <h3>Your AI-Generated Itinerary:</h3>
                    <pre>{itinerary}</pre>
                </Box>
            )}
        </Box>
    );
};

export default DatePlannerForm;

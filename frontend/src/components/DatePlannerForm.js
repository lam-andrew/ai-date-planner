import React, { useState, useRef } from "react";
import { TextField, Button, Chip, Stepper, Step, StepLabel, Box, CircularProgress, Card, CardContent, Typography, Grid } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import { generateDatePlan } from "../api";
import DateItinerary from "./DateItinerary";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const dateTypes = ["Romantic", "Casual", "First Date", "Anniversary"];
const foodOptions = ["Bar", "Cafe", "Coffee Shop", "Dessert Shop", "Fine Dining", "French", "Greek", "Italian", "Japanese", "Korean", "Mexican", "Pizza", "Seafood", "Spanish", "Steakhouse", "Sushi", "Thai", "Vegan", "Vegetarian"];
const activityOptions = ["Art Gallery", "Museum", "Performing Arts Theater", "Amusement Park", "Aquarium", "Bowling Alley", "Comedy Club", "Concert Hall", "Karaoke", "Movie Theater", "Night Club", "Observation Deck", "Planetarium", "Zoo", "Botanical Garden", "Hiking Area", "Park", "Picnic Ground"];

const DatePlannerForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        location: "",
        date_type: "Romantic",
        food_preferences: [],
        activity_preferences: [],
    });

    const [itineraryData, setItineraryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const autocompleteRef = useRef(null);

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

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleToggleSelection = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter(f => f !== item)
                : [...prev[field], item]
        }));
    };

    const handleNext = () => setActiveStep(prevStep => prevStep + 1);
    const handleBack = () => setActiveStep(prevStep => prevStep - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setItineraryData(null);

        try {
            const response = await generateDatePlan(formData);
            if (response && response.itinerary) {
                setItineraryData(response);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            setError("Failed to generate itinerary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ p: 4, mt: 3, boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {['Location', 'Type', 'Food', 'Activities', 'Confirm'].map(label => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>

                <Box sx={{ mt: 3 }}>
                    {activeStep === 0 && (
                        <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceSelect}>
                            <TextField label="Enter Location" fullWidth variant="outlined" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} />
                        </Autocomplete>
                    )}

                    {activeStep === 1 && (
                        <TextField select label="Date Type" fullWidth variant="outlined" value={formData.date_type} onChange={(e) => handleChange("date_type", e.target.value)} SelectProps={{ native: true }}>
                            {dateTypes.map(option => <option key={option} value={option}>{option}</option>)}
                        </TextField>
                    )}

                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6">Select Food Preferences</Typography>
                            <Grid container spacing={1}>
                                {foodOptions.map(food => (
                                    <Grid item key={food}>
                                        <Chip label={food} onClick={() => handleToggleSelection("food_preferences", food)} color={formData.food_preferences.includes(food) ? "primary" : "default"} clickable />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {activeStep === 3 && (
                        <Box>
                            <Typography variant="h6">Select Activities</Typography>
                            <Grid container spacing={1}>
                                {activityOptions.map(activity => (
                                    <Grid item key={activity}>
                                        <Chip label={activity} onClick={() => handleToggleSelection("activity_preferences", activity)} color={formData.activity_preferences.includes(activity) ? "secondary" : "default"} clickable />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {activeStep === 4 && (
                        <Box>
                            <Typography variant="h6">Confirm Your Selections</Typography>
                            <Typography><strong>Location:</strong> {formData.location}</Typography>
                            <Typography><strong>Date Type:</strong> {formData.date_type}</Typography>
                            <Typography><strong>Food Preferences:</strong> {formData.food_preferences.join(", ")}</Typography>
                            <Typography><strong>Activity Preferences:</strong> {formData.activity_preferences.join(", ")}</Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                    {activeStep > 0 && <Button startIcon={<ArrowBackIosIcon />} onClick={handleBack}>Back</Button>}
                    {activeStep < 4 && <Button endIcon={<ArrowForwardIosIcon />} variant="contained" onClick={handleNext}>Next</Button>}
                    {activeStep === 4 && <Button endIcon={<CheckCircleIcon />} variant="contained" color="secondary" onClick={handleSubmit}>Generate Plan</Button>}
                </Box>

                {loading && <CircularProgress sx={{ mt: 2 }} />}
                {error && <Typography color="error">{error}</Typography>}
                {itineraryData && <DateItinerary itineraryData={itineraryData} />}
            </CardContent>
        </Card>
    );
};

export default DatePlannerForm;

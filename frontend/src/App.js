import './App.css';
import React from "react";
import { LoadScript } from "@react-google-maps/api";
import DatePlannerForm from "./components/DatePlannerForm";
import { ThemeProvider, createTheme, CssBaseline, Container, Typography } from "@mui/material";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

const theme = createTheme({
    palette: {
        primary: {
            main: "#ff4d6d",
        },
        secondary: {
            main: "#5e35b1",
        },
        background: {
            default: "#f4f5f7",
            paper: "#fff",
        },
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: "bold",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "16px",
                    boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
                },
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
                        Perfect Date Planner 💕
                    </Typography>
                    <DatePlannerForm />
                </Container>
            </LoadScript>
        </ThemeProvider>
    );
}

export default App;

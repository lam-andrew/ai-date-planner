import './App.css';
import React from "react";
import { LoadScript } from "@react-google-maps/api";
import DatePlannerForm from "./components/DatePlannerForm";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

function App() {
    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
          <div className="App">
              <h1>Perfect Date Planner 💕</h1>
              <DatePlannerForm />
          </div>
        </LoadScript>
    );
}

export default App;

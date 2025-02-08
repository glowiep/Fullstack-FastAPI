import api from "../api/axios"
import { useState } from "react"

// Use this as an example for fetching data from the backend

const ObservationsSection = () => {
    const [observations, setObservations] = useState(["inital observation", "another initial observation"]);

    const handleGetObservations = async () => {
        // Fetch teacher emails from the backend - see @router.get("/observations/") in classroom.py
        try {
            const response = await api.get('/observations');
            setObservations(response.data.observations || ["No observations found"]);  // Right now the response doesnt return what we need so it returns the default "No observations found"
        } catch (error) {
            console.error('Error fetching observations:', error);
            setObservations(["Error fetching observations"]);
        }
    };
    return (
        <div>
            <h1>Observations Section</h1>

            <button onClick={handleGetObservations}>Example</button>
            {observations.map((observation, index) => (
                <div key={index}>{observation}</div>
            ))}
        </div>
    );
};

export default ObservationsSection;
import api from "../api/axios"
import { useState } from "react"
import Sidebar from "../components/Sidebar";
import RecordTranscribe from "../components/RecordTranscribe";

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
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col bg-gray-100 w-full">
                <h1>Observations Section</h1>

               <RecordTranscribe />

                {/* Example */}
                <div>
                    <button onClick={handleGetObservations}>Example</button>
                    {observations.map((observation, index) => (
                        <div key={index}>{observation}</div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ObservationsSection;
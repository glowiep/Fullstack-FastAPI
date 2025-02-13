import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import RecordTranscribe from "../components/RecordTranscribe";

// ✅ Define the type for observations
interface Observation {
    observation_id: number;
    observation_text: string;
    created_at: string;
    metric_name: string;
    student_name: string;
}

const ObservationsSection = () => {
    // ✅ Explicitly tell TypeScript that this is an array of Observation objects
    const [observations, setObservations] = useState<Observation[]>([]);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const response = await api.get('/observations_data');
                setObservations(response.data.observations || []);
            } catch (error) {
                console.error('Error fetching observations:', error);
                setObservations([]);
            }
        };

        fetchObservations();
    }, []);

    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col bg-gray-100 w-full p-8">
                <h1 className="text-3xl font-bold mb-6">Observations Section</h1>

                <RecordTranscribe />

                {/* Observations List */}
                <div className="mt-6">
                    {observations.length === 0 ? (
                        <p className="text-gray-600">No observations available.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {observations.map((obs) => (
                                <div key={obs.observation_id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
                                    <h3 className="text-lg font-semibold text-gray-800">{obs.student_name}</h3>
                                    <p className="text-sm text-gray-600">{new Date(obs.created_at).toLocaleDateString()}</p>
                                    <p className="mt-2 text-gray-700">{obs.observation_text}</p>
                                    <span className="mt-3 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                                        {obs.metric_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ObservationsSection;

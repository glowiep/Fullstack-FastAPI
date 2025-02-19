import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import RecordTranscribe from "../components/RecordTranscribe";

// Define types for API data
interface Observation {
    observation_id: number;
    observation_text: string;
    created_at: string;
    metric_name: string;
    student_name: string;
}

interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
}

interface Metric {
    metric_id: number;
    metric_name: string;
}

const ObservationsSection = () => {
    const [observations, setObservations] = useState<Observation[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<number | "">("");
    const [selectedMetric, setSelectedMetric] = useState<number | "">("");
    const [observationText, setObservationText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const response = await api.get("/observations_data");
                setObservations(response.data.observations || []);
            } catch (error) {
                console.error("Error fetching observations:", error);
                setObservations([]);
            }
        };

        const fetchStudents = async () => {
            try {
                const response = await api.get("/students");
                setStudents(response.data.students || []);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        const fetchMetrics = async () => {
            try {
                const response = await api.get("/metrics");
                setMetrics(response.data.metrics || []);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };

        fetchObservations();
        fetchStudents();
        fetchMetrics();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const submitObservation = async () => {
        if (!selectedStudent || !selectedMetric || !observationText) {
            setStatus("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("student_id", selectedStudent.toString());
        formData.append("course_id", "1"); // Example course_id, replace with actual
        formData.append("teacher_id", "1"); // Example teacher_id, replace with actual
        formData.append("metric_id", selectedMetric.toString());
        formData.append("observation_text", observationText);

        try {
            const response = await api.post("/observations", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 201) {
                setStatus("Observation submitted successfully!");
                setObservationText("");
                setSelectedStudent("");
                setSelectedMetric("");
                setFile(null);
            }
        } catch (error) {
            console.error("Error submitting observation:", error);
            setStatus("Failed to submit observation.");
        }
    };

    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col w-full p-6 bg-gray-100">
                <h1 className="text-4xl font-bold text-center mb-6">Observations</h1>
                <div className="flex flex-row">
                    {/* Left-side Form */}
                    <div className="w-1/3 bg-white h-fit shadow-lg p-6 rounded-lg border border-gray-300">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add Observation</h2>
                        <label className="block mb-2 font-medium">Select Student:</label>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(Number(e.target.value))}
                        >
                            <option value="">Select Student</option>
                            {students.map((student) => (
                                <option key={student.student_id} value={student.student_id}>
                                    {student.first_name} {student.last_name}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2 font-medium">Select Metric:</label>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(Number(e.target.value))}
                        >
                            <option value="">Select Metric</option>
                            {metrics.map((metric) => (
                                <option key={metric.metric_id} value={metric.metric_id}>
                                    {metric.metric_name}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2 font-medium">Observation Text:</label>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            value={observationText}
                            onChange={(e) => setObservationText(e.target.value)}
                        ></textarea>

                        <label className="block mb-2 font-medium">Upload File (Optional):</label>
                        <input type="file" className="text-gray-500 mb-4 p-2 border border-gray-300 rounded hover:cursor-pointer bg-gray-100 hover:bg-gray-200" onChange={handleFileChange} />

                        <button
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            onClick={submitObservation}
                        >
                            Submit Observation
                        </button>
                        {status && <p className="mt-2 text-red-500 text-center">{status}</p>}
                    </div>

                    {/* Right-side Transcription & Observations */}
                    <div className="flex flex-col w-2/3 pl-6">
                        <RecordTranscribe />
                        <div className="mt-6">
                            {observations.length === 0 ? (
                                <p className="text-gray-600 text-center">No observations available.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {observations.map((obs) => (
                                        <div key={obs.observation_id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
                                            <h3 className="text-lg font-semibold">{obs.student_name}</h3>
                                            <p className="text-sm text-gray-600">{new Date(obs.created_at).toLocaleDateString()}</p>
                                            <p className="mt-2 text-gray-700">{obs.observation_text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObservationsSection;

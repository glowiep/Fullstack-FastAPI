import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const ReportsSection = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [sentReports, setSentReports] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [buttonText, setButtonText] = useState("Select Class & Student");
    const [buttonEnabled, setButtonEnabled] = useState(false);

    useEffect(() => {
        if (selectedClass && selectedStudent) {
            setButtonText("Send Report Cards");
            setButtonEnabled(true);
        } else {
            setButtonText("Select Class & Student");
            setButtonEnabled(false);
        }
    }, [selectedClass, selectedStudent]);

    const sendReportCards = async () => {
        try {
            const response = await fetch("/api/send_report_cards/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ student: selectedStudent })
            });

            const data = await response.json();
            if (response.ok) {
                setStatus("Report cards sent successfully");
                setSentReports(data.sent_reports);
            } else {
                setStatus(`Error: ${data.detail}`);
            }
        } catch (error) {
            setStatus("Failed to send report cards");
        }
    };

    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col bg-gray-100 w-full p-6">
                <h1 className="text-2xl font-bold mb-4">Reports</h1>

                <div>
                    <label htmlFor="classDropdown" className="text-xl font-semibold mr-2 font-medium">Select Class:</label>
                    <select
                        id="classDropdown"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="" disabled>Select Class</option>
                        <option value="Grade 6 Math">Grade 6 Math</option>
                        <option value="Grade 4 Math">Grade 4 Math</option>
                        <option value="Grade 5 Math">Grade 5 Math</option>
                    </select>
                </div>

                <div className="mt-4">
                    <label htmlFor="studentDropdown" className="text-xl font-semibold mr-2">Select Student:</label>
                    <select
                        id="studentDropdown"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="border p-2 rounded"
                        disabled={!selectedClass}
                    >
                        <option value="" disabled>Select Student</option>
                        <option value="Timmy Turner">Timmy Turner</option>
                        <option value="Beatrice Beauregard">Beatrice Beauregard</option>
                        <option value="Chatty Cathee">Chatty Cathee</option>
                        <option value="Dora D">Dora the Explorer</option>
                        <option value="Ellie Elison">Ellie Elison</option>
                    </select>
                </div>

                <div className="flex flex-row justify-center">
                    <button
                        onClick={sendReportCards}
                        className={`px-4 py-2 rounded mb-4 mt-4 transition-colors duration-300 ${buttonEnabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        disabled={!buttonEnabled}
                    >
                        {buttonText}
                    </button>
                </div>

                {status && <p className="text-red-600">{status}</p>}
                {sentReports.length > 0 && (
                    <ul className="mt-4">
                        {sentReports.map((report, index) => (
                            <li key={index} className="border-b py-2">
                                Sent to: {report.guardian} for {report.student}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ReportsSection;

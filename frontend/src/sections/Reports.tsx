import { useState } from "react";
import Sidebar from "../components/Sidebar";

const ReportsSection = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [sentReports, setSentReports] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState("Timmy Turner");

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
                    <label htmlFor="studentDropdown" className="text-xl font-semibold mr-2">Select Student:</label>
                    <select
                        id="studentDropdown"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="Timmy Turner">Timmy Turner</option>
                        <option value="Beatrice Beauregard">Beatrice Beauregard</option>
                        <option value="Chatty Cathee">Chatty Cathee</option>
                        <option value="Dora D">Dora the Explorer</option>
                        <option value="Ellie Elison">Ellie Elison</option>
                    </select>
                </div>
                <button
                    onClick={sendReportCards}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mt-4"
                >
                    Send Report Cards
                </button>
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

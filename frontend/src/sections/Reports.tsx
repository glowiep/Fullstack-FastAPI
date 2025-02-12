import { useState } from "react";
import Sidebar from "../components/Sidebar";

const ReportsSection = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [sentReports, setSentReports] = useState<any[]>([]);

    const sendReportCards = async () => {
        try {
            const response = await fetch("/api/send_report_cards/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                <button
                    onClick={sendReportCards}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
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

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StudentGraph from "../components/StudentGraph";
import { sampleStudentsA, sampleStudentsB, sampleStudentsC } from "../constants/sampleStudents";

const StudentsSection = () => {
    const [selectedClass, setSelectedClass] = useState("A");
    const [sampleStudents, setSampleStudents] = useState(sampleStudentsA);

    useEffect(() => {
        if (selectedClass === "A") {
            setSampleStudents([...sampleStudentsA]);
        } else if (selectedClass === "B") {
            setSampleStudents([...sampleStudentsB]);
        } else {
            setSampleStudents([...sampleStudentsC]);
        }

    }, [selectedClass]);

    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col bg-gray-100 w-full p-4">
                <h1 className="text-2xl font-bold">Students</h1>

                <div>
                    <label htmlFor="classDropdown" className=" text-xl font-semibold mr-2 font-medium">Select Class:</label>
                    <select
                        id="classDropdown"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="A">Class A</option>
                        <option value="B">Class B</option>
                        <option value="C">Class C</option>
                    </select>
                </div>
                <StudentGraph key={selectedClass} sampleStudents={sampleStudents}/>
            </div>
        </div>
    );
};

export default StudentsSection;

import Sidebar from "../components/Sidebar";

const StudentsSection = () => {
    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col bg-gray-100 w-full">
                <h1>Students</h1>
            </div>
        </div>
    );  
};

export default StudentsSection;
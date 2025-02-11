import Sidebar from "../components/Sidebar";

const ImportSection = () => {
    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col bg-gray-100 w-full">
                <h1>Import</h1>
            </div>
        </div>
    );  
};

export default ImportSection;
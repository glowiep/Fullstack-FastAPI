import Sidebar from "../components/Sidebar";
import ConnectGoogle from "../components/ConnectGoogle";
import ConnectOutlook from "../components/ConnectOutlook";
import AddToCalendar from "../components/AddToCalendar";
import ShareCalendar from "../components/ShareCalendar";
import './Calendar.css';

const CalendarSection = () => {
    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex flex-col items-center bg-gray-100 w-full">
                <h1>Calendar</h1>
                <div className="flex flex-row justify-center pb-4 gap-2">
                    <ConnectGoogle />
                    <ConnectOutlook />
                </div>
                <div className="flex flex-row justify-center gap-2">
                    <AddToCalendar />
                    <ShareCalendar />
                </div>
            </div>
        </div>
    );  
};

export default CalendarSection;
import React from 'react';
import Sidebar from "../components/Sidebar";
import ConnectGoogle from "../components/ConnectGoogle";
import ConnectOutlook from "../components/ConnectOutlook";
import AddToCalendar from "../components/AddToCalendar";
import ShareCalendar from "../components/ShareCalendar";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment (or date-fns) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer for globalize

const CalendarSection = () => {
    const events = [
        {
            title: 'Koru Hackathon',
            start: new Date(2025, 2, 13, 13, 0),
            end: new Date(2025, 2, 13, 18, 0), 
        },
    ];

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
                <div className="mt-7 w-full max-w-4xl">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarSection;
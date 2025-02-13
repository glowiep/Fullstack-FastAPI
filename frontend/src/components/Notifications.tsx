import { useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
    const lastNotificationTime = useRef<number | null>(null);
    const hasNotified = useRef(false); // Prevents double execution in dev mode

    useEffect(() => {
        if (hasNotified.current) return; // Prevent second call in Strict Mode
        hasNotified.current = true;

        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/notifications/falling_behind_students/");
                const data = await response.json();

                if (data.falling_behind_students.length > 0) {
                    const now = Date.now();
                    const lastNotification = localStorage.getItem("lastNotificationTime");

                    if (!lastNotification || now - parseInt(lastNotification) >= 3 * 60 *1000 ) {
                        localStorage.setItem("lastNotificationTime", now.toString());
                        lastNotificationTime.current = now;

                        data.falling_behind_students.forEach((student: { student_id: number; student_name: string }) => {
                            toast.warning(`Update Observations for ${student.student_name}`, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        const interval = setInterval(fetchNotifications, 3 * 60 *1000 );
        return () => clearInterval(interval);
    }, []); 

    return <ToastContainer />;
};

export default Notifications;

import { useNavigate, useLocation } from "react-router-dom";
import '../App.css';
import { FaCalendarCheck } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
// import { MdOutlineAccountBalance } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { TbReportSearch } from "react-icons/tb";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { LuImport } from "react-icons/lu";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarItems = [
        { section: 'Observations', url: '/observations', icon: <FaMagnifyingGlass /> },
        { section: 'Behaviors', url: '/behaviors', icon: <TbReportSearch/> },
        { section: 'Reports', url: '/reports', icon: <HiOutlineDocumentReport /> },
        { section: 'Students', url: '/students', icon: <RiAccountCircleFill /> },
        // { section: 'Grades', url: '/grades', icon: <MdOutlineAccountBalance /> },
        { section: 'Calendar', url: '/calendar', icon: <FaCalendarCheck /> },
        { section: 'Import', url: '/import', icon: <LuImport /> },
    ];

    const shouldShowSidebar = location.pathname !== '/';
    
    return (
        <>
        {shouldShowSidebar && <div className="w-48 bg-red-800 text-white p-4  flex flex-col justify-between h-full">
            <div className="flex flex-row items-center justify-center hover:cursor-pointer hover:bg-red-700 rounded-xl" onClick={() => navigate('/home')}><h2>📚OnClass</h2></div>
            <div className="">
            {sidebarItems.map((item, _) => (
            <div 
                key={item.section} 
                className="py-6 text-lg font-semibold border-b border-red-600 last:border-b-0 hover:cursor-pointer hover:bg-red-600 rounded-xl flex flex-row items-center justify-center gap-1 px-2 hover:scale-105 transform transition-all"
                onClick={() => navigate(item.url)}
            >
                {item.icon} {item.section}
            </div>
            ))}
            </div>
            <button className="login-button" onClick={() => navigate("/")}>Log Out</button>
        </div>}
        </>
    )
};

export default Sidebar;
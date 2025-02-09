import '../App.css';
import Sidebar from "../components/Sidebar";

const Home = () => {

    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <div className="flex bg-gray-100 w-full">
          <div className="mx-auto flex flex-col p-8">
            <h1 className="text-3xl font-bold mb-8">Grade 6 Mathematics Student Tracking</h1>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Overall Status */}
              <div className="bg-white shadow rounded-lg p-4 col-span-1">
                <h2 className="text-xl font-semibold mb-4">Overall Status</h2>
                <div 
                  className="radial-progress text-primary text-center"
                  style={{
                    background: `conic-gradient(#4CAF50 75%, #e0e0e0 0)`
                  }}
                >
                  6°
                </div>
                <div className="mt-4 text-center">
                  <span className="badge badge-success">All Good</span>
                </div>
              </div>

              {/* Tracking Sections */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {/* Attendance */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Attendance</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">8</span>
                    <span className="badge badge-warning">Needs Required</span>
                  </div>
                </div>

                {/* Observations */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Observations</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">8</span>
                    <span className="badge badge-success">All Good</span>
                  </div>
                </div>

                {/* Operations */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Operations</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">8</span>
                    <span className="badge badge-success">All Good</span>
                  </div>
                </div>

                {/* Reports */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Reports</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">6</span>
                    <span className="badge badge-warning">Needs Required</span>
                  </div>
                </div>
              </div>

              {/* Additional Insights */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                <div className="bg-white shadow rounded-lg p-4 col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Observations</h2>
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    Observations Chart
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 col-span-1">
                  <h2 className="text-xl font-semibold mb-4">All Students</h2>
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    Students Chart
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4 col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Action Required</h2>
                  <ul className="list-disc pl-5">
                    <li>Attendance Follow-up</li>
                    <li>Report Submissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    );
};

export default Home;
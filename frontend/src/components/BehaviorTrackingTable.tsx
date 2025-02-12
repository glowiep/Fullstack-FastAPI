import { useState } from 'react';

const BehaviorTrackingTable = () => {
    const [students] = useState([
        { id: 1, name: 'Alex Smith', grade: '5th' },
        { id: 2, name: 'Jamie Chen', grade: '5th' },
        { id: 3, name: 'Sam Wilson', grade: '5th' },
        { id: 4, name: 'Emma Johnson', grade: '5th' },
        { id: 5, name: 'Liam Brown', grade: '5th' },
        { id: 6, name: 'Olivia Davis', grade: '5th' },
        { id: 7, name: 'Noah Miller', grade: '5th' },
        { id: 8, name: 'Ava Garcia', grade: '5th' },
        { id: 9, name: 'William Martinez', grade: '5th' },
        { id: 10, name: 'Sophia Rodriguez', grade: '5th' },
        { id: 11, name: 'James Hernandez', grade: '5th' },
        { id: 12, name: 'Isabella Lopez', grade: '5th' },
        { id: 13, name: 'Benjamin Gonzalez', grade: '5th' },
        { id: 14, name: 'Mia Wilson', grade: '5th' },
        { id: 15, name: 'Elijah Anderson', grade: '5th' },
        { id: 16, name: 'Charlotte Thomas', grade: '5th' },
        { id: 17, name: 'Lucas Taylor', grade: '5th' },
        { id: 18, name: 'Amelia Moore', grade: '5th' },
        { id: 19, name: 'Mason Jackson', grade: '5th' },
        { id: 20, name: 'Harper Lee', grade: '5th' },
        { id: 21, name: 'Ethan White', grade: '5th' },
        { id: 22, name: 'Evelyn Harris', grade: '5th' },
        { id: 23, name: 'Logan Clark', grade: '5th' },
    ]);

  const [behaviors] = useState([
    'Raises hand before speaking',
    'Completes homework on time',
    'Works well in groups',
    'Stays focused during lessons'
  ]);

  const [trackingData, setTrackingData] = useState<TrackingData>(
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: behaviors.reduce((behaviorAcc, behavior) => ({
        ...behaviorAcc,
        [behavior]: false
      }), {})
    }), {})
  );

interface TrackingData {
    [studentId: number]: {
        [behavior: string]: boolean;
    };
}

const toggleBehavior = (studentId: number, behavior: string) => {
    setTrackingData((prev: TrackingData) => ({
        ...prev,
        [studentId]: {
            ...prev[studentId],
            [behavior]: !prev[studentId][behavior]
        }
    }));
};

  return (
    <div className="w-full mb-4 max-w-4xl bg-white rounded-lg shadow p-6 overflow-y-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              {behaviors.map(behavior => (
                <th 
                  key={behavior} 
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {behavior}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                {behaviors.map(behavior => (
                  <td 
                    key={`${student.id}-${behavior}`} 
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <input
                      type="checkbox"
                      checked={trackingData[student.id][behavior]}
                      onChange={() => toggleBehavior(student.id, behavior)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BehaviorTrackingTable;
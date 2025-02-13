// import Sidebar from "../components/Sidebar";

// const ImportSection = () => {
//     return (
//         <div className="flex w-screen h-screen">
//             <Sidebar />
//             <div className="flex flex-col bg-gray-100 w-full">
//                 <h1>Import</h1>
//             </div>
//         </div>
//     );  
// };

// export default ImportSection;

import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import { 
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
  Button
} from '@mui/material';
import { FiUpload } from 'react-icons/fi';

interface ImportPageProps {
  // Add your props here if needed
}

const ImportPage: React.FC<ImportPageProps> = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  
  // Sample data - replace with your actual data
  const grades = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
  const classes = ['A', 'B', 'C', 'D'];
  const students = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams',
    'Tom Brown'
  ];

  const handleGradeChange = (event: SelectChangeEvent) => {
    setSelectedGrade(event.target.value);
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

  const handleStudentChange = (event: SelectChangeEvent) => {
    setSelectedStudent(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the file upload logic here
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="flex w-screen h-screen">
        <Sidebar />
        <div className="flex flex-col bg-gray-100 w-full items-center">
          <h1>Import</h1>
          <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
              <Typography variant="h4" gutterBottom>
                Upload Student Data 
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                {/* Grade Selection */}
                <FormControl fullWidth>
                  <InputLabel>Select Grade*</InputLabel>
                  <Select
                    value={selectedGrade}
                    label="Select Grade"
                    onChange={handleGradeChange}
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Class Selection */}
                <FormControl fullWidth>
                  <InputLabel>Select Class*</InputLabel>
                  <Select
                    value={selectedClass}
                    label="Select Class"
                    onChange={handleClassChange}
                  >
                    {classes.map((className) => (
                      <MenuItem key={className} value={className}>
                        Class {className}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Student Selection */}
                <FormControl fullWidth>
                  <InputLabel>Select Student (Optional)</InputLabel>
                  <Select
                    value={selectedStudent}
                    label="Select Student"
                    onChange={handleStudentChange}
                  >
                    {students.map((student) => (
                      <MenuItem key={student} value={student}>
                        {student}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* File Upload */}
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <input
                    accept=".xlsx,.xls,.csv"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<FiUpload />}
                      sx={{ mb: 2 }}
                    >
                      Upload File
                    </Button>
                    <Typography variant="body2" color="textSecondary">
                      Drag and drop or click to upload Excel or CSV files
                    </Typography>
                  </label>
                </Box>
              </Box>
            </Paper>
          </Container>
        </div>
    </div>
  );
};

export default ImportPage;
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Layout from './Layout'; 

import Dashboard from './Dashboard'; 
import Feed from './Feed'; 
import Attendance from './Attendance';
import Timetable from './Timetable';
import Profile from './Profile';
import Faculty from './Faculty'; 

import PostNotice from './PostNotice';
import MarkAttendance from './MarkAttendance';
import UpdateMarks from './UpdateMarks';
import Results from './Results'; 
import StudentMarks from './StudentMarks';
import NoticeDetails from './NoticeDetails'; // <-- NEW IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route element={<Layout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/feed/:category" element={<Feed />} />
           <Route path="/attendance" element={<Attendance />} />
           <Route path="/timetable" element={<Timetable />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/faculty" element={<Faculty />} />
        </Route>

        <Route path="/post-notice" element={<PostNotice />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/update-marks" element={<UpdateMarks />} />
        <Route path="/results" element={<Results />} />
        <Route path="/student/marks" element={<StudentMarks />} />

        <Route path="/notice/:id" element={<NoticeDetails />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
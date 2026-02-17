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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- FIX START: The Missing Routes --- */}
        
        {/* 1. This handles the 'navigate("/login")' from Dashboard */}
        <Route path="/login" element={<Login />} />

        {/* 2. This handles when someone opens the homepage "/" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* --- FIX END --- */}

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
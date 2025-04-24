import React, { useEffect, useState } from "react";
import "../../styles/AttendanceManagementCSS/AttendanceMain.css";
import { formatDate } from "../../utils/helpers";
import AttendanceForm from "./AttendanceForm";
import AttendanceStats from "./AttendanceStats";
import AttendanceTable from "./AttendanceTable";

const AttendanceMain = () => {
  // States for the attendance system
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewMode, setViewMode] = useState("form"); // form, table, stats

  // Available classes and sections
  const classes = [
    "1st", "2nd", "3rd", "4th", "5th", "6th", 
    "7th", "8th", "9th", "10th", "11th", "12th"
  ];
  
  const sections = ["A", "B", "C"];

  // Generate dummy students when class and section are selected
  useEffect(() => {
    if (selectedClass && selectedSection) {
      const dummyStudents = generateDummyStudents(selectedClass, selectedSection);
      setStudents(dummyStudents);
      
      // Initialize attendance data for these students
      const initialAttendance = dummyStudents.map(student => ({
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        status: "present", // Default to present
        date: selectedDate
      }));
      
      setAttendanceData(initialAttendance);
    }
  }, [selectedClass, selectedSection, selectedDate]);

  // Function to generate dummy students
  const generateDummyStudents = (className, section) => {
    const numberOfStudents = Math.floor(Math.random() * 10) + 20; // 20-30 students
    const studentArray = [];
    
    for (let i = 1; i <= numberOfStudents; i++) {
      studentArray.push({
        id: `${className}-${section}-${i}`,
        name: `Student ${i}`,
        rollNumber: i,
        class: className,
        section: section
      });
    }
    
    return studentArray;
  };

  // Function to handle attendance status change
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => 
      prev.map(item => 
        item.id === studentId ? { ...item, status } : item
      )
    );
  };

  // Function to save attendance data
  const saveAttendance = () => {
    // In a real app, this would save to a database
    console.log("Saving attendance:", attendanceData);
    alert("Attendance saved successfully!");
  };

  return (
    <div className="attendance-main">
      <h1>Attendance Management System</h1>
      
      <div className="view-controls">
        <button 
          onClick={() => setViewMode("form")}
          className={viewMode === "form" ? "active" : ""}
        >
          Mark Attendance
        </button>
        <button 
          onClick={() => setViewMode("table")}
          className={viewMode === "table" ? "active" : ""}
        >
          View Records
        </button>
        <button 
          onClick={() => setViewMode("stats")}
          className={viewMode === "stats" ? "active" : ""}
        >
          Statistics
        </button>
      </div>

      <div className="selector-container">
        <div className="selector">
          <label>Class:</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="selector">
          <label>Section:</label>
          <select 
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {sections.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        <div className="selector">
          <label>Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {viewMode === "form" && (
        <AttendanceForm 
          students={students}
          attendanceData={attendanceData}
          onChange={handleAttendanceChange}
          onSave={saveAttendance}
          disabled={!selectedClass || !selectedSection}
        />
      )}

      {viewMode === "table" && (
        <AttendanceTable 
          students={students}
          className={selectedClass}
          section={selectedSection}
        />
      )}

      {viewMode === "stats" && (
        <AttendanceStats 
          className={selectedClass}
          section={selectedSection}
        />
      )}
    </div>
  );
};

export default AttendanceMain; 
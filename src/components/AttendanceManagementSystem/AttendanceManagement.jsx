import React, { useEffect, useState } from "react";
import "../../styles/AttendanceManagementCSS/AttendanceManagement.css";
import AttendanceForm from "./AttendanceForm";
import AttendanceSummary from "./AttendanceSummary";
import AttendanceTable from "./AttendanceTable";

const AttendanceManagement = () => {
  // States for selections
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  
  // General states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [savedAttendance, setSavedAttendance] = useState({});
  const [activeTab, setActiveTab] = useState("mark"); // 'mark', 'view', or 'summary'
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [holidays, setHolidays] = useState({});
  
  // Calculate if selected date is a Sunday or a holiday
  const selectedDateObj = new Date(selectedDate);
  const isSunday = selectedDateObj.getDay() === 0;
  const isHoliday = holidays[selectedDate] || false;
  const isAttendanceDisabled = isSunday || isHoliday;

  // Available grades and sections/streams
  const grades = [
    "1st", "2nd", "3rd", "4th", "5th", "6th", 
    "7th", "8th", "9th", "10th", "11th", "12th"
  ];
  
  const sections = ["A", "B", "C"];
  const streams = ["Science", "Commerce", "Arts"];

  // Sample first and last names for generating dummy students
  const firstNames = [
    'Aditya', 'Aarav', 'Arjun', 'Aryan', 'Ananya', 'Aditi', 'Anika', 'Aarushi',
    'Bhavya', 'Divya', 'Diya', 'Dhruv', 'Dev', 'Gauri', 'Ishaan', 'Ishita',
    'Kabir', 'Kiara', 'Krish', 'Kavya', 'Lakshya', 'Meera', 'Manav', 'Neha',
    'Nisha', 'Nikhil', 'Om', 'Prisha', 'Parth', 'Priyansh', 'Riya', 'Rohan',
    'Reyansh', 'Sanya', 'Saanvi', 'Sarthak', 'Tanvi', 'Tanish', 'Vihaan', 'Vanya',
    'Yash', 'Zara'
  ];

  const lastNames = [
    'Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Malhotra', 'Joshi',
    'Chopra', 'Mehta', 'Shah', 'Khanna', 'Kapoor', 'Agarwal', 'Reddy', 'Nair',
    'Rao', 'Mishra', 'Bhat', 'Iyer', 'Chauhan', 'Patil', 'Desai', 'Sinha',
    'Bansal', 'Arora', 'Pillai', 'Das', 'Chatterjee', 'Yadav'
  ];

  // Generate random number between min and max (inclusive)
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random name
  const generateRandomName = () => {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    return `${firstName} ${lastName}`;
  };

  // Determine if higher grades (11th, 12th) are selected
  const isHigherGrade = selectedGrade === "11th" || selectedGrade === "12th";
  
  // Check if all required selections are made
  const hasCompleteSelection = selectedGrade && 
    (isHigherGrade ? selectedStream : selectedSection);

  // Load students based on selection
  useEffect(() => {
    if (hasCompleteSelection) {
      // In a real app, this would be an API call with filters
      let studentsArray = [];
      
      // Generate between 15-25 students
      const numberOfStudents = getRandomInt(15, 25);
      
      // Generate student names
      for (let i = 0; i < numberOfStudents; i++) {
        studentsArray.push({
          id: i + 1,
          name: generateRandomName(),
          class: selectedGrade,
          section: isHigherGrade ? selectedStream : selectedSection
        });
      }
      
      // Sort students alphabetically by name
      studentsArray.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      
      // Assign sequential roll numbers based on alphabetical order
      studentsArray = studentsArray.map((student, index) => {
        return {
          ...student,
          rollNumber: index + 1 // Simple sequential roll numbers for all grades
        };
      });
      
      setStudents(studentsArray);
    } else {
      setStudents([]);
    }
  }, [selectedGrade, selectedSection, selectedStream, isHigherGrade, hasCompleteSelection]);

  // Initialize attendance data when students or date changes
  useEffect(() => {
    if (students.length > 0) {
      const savedKey = `${selectedGrade}-${isHigherGrade ? selectedStream : selectedSection}-${selectedDate}`;
      
      if (savedAttendance[savedKey]) {
        // If we have saved data for this date and selection, use it
        setAttendanceData(savedAttendance[savedKey]);
      } else {
        // Otherwise, initialize with all students marked as null if it's a holiday, otherwise PRESENT by default
        const initialData = students.map(student => ({
          id: student.id,
          status: isAttendanceDisabled ? "holiday" : "present" // Mark as holiday if Sunday/holiday, otherwise present
        }));
        setAttendanceData(initialData);
      }
    } else {
      setAttendanceData([]);
    }
  }, [students, selectedDate, savedAttendance, selectedGrade, selectedSection, selectedStream, isHigherGrade, isAttendanceDisabled]);

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle grade change
  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    // Reset section/stream when grade changes
    setSelectedSection("");
    setSelectedStream("");
  };

  // Handle section change
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Handle stream change
  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value);
  };

  // Handle attendance status change
  const handleAttendanceChange = (updatedAttendance) => {
    setAttendanceData(updatedAttendance);
  };

  // Toggle holiday status for the selected date
  const toggleHoliday = () => {
    setHolidays(prev => ({
      ...prev,
      [selectedDate]: !prev[selectedDate]
    }));
  };

  // Save attendance data
  const handleSaveAttendance = () => {
    setIsLoading(true);
    
    // Create a key based on selection and date
    const saveKey = `${selectedGrade}-${isHigherGrade ? selectedStream : selectedSection}-${selectedDate}`;
    
    // Simulate API call
    setTimeout(() => {
      setSavedAttendance(prev => ({
        ...prev,
        [saveKey]: attendanceData
      }));
      setIsLoading(false);
      setActiveTab("view");
      alert("Attendance saved successfully!");
    }, 800);
  };

  // Generate attendance summary data
  const generateAttendanceSummary = () => {
    const classKeys = Object.keys(savedAttendance).filter(key => 
      key.startsWith(`${selectedGrade}-${isHigherGrade ? selectedStream : selectedSection}`)
    );
    
    const totalClasses = classKeys.length;
    
    if (totalClasses === 0) {
      return [];
    }
    
    const summaryData = students.map(student => {
      // Count classes where student was present
      let presentCount = 0;
      
      classKeys.forEach(key => {
        const classData = savedAttendance[key];
        const studentRecord = classData.find(record => record.id === student.id);
        
        if (studentRecord && studentRecord.status === "present") {
          presentCount++;
        }
      });
      
      // Calculate attendance percentage
      const attendancePercentage = (presentCount / totalClasses) * 100;
      
      return {
        id: student.id,
        rollNumber: student.rollNumber,
        name: student.name,
        totalClasses,
        presentCount,
        absentCount: totalClasses - presentCount,
        attendancePercentage: attendancePercentage.toFixed(2)
      };
    });
    
    return summaryData;
  };

  // Render the selection form
  const renderSelectionForm = () => {
    return (
      <div className="selection-form">
        <div className="card-header">
          <h3>Class Selection</h3>
          <p>Please select the class details below to proceed</p>
        </div>
        
        <div className="selection-content">
          <div className="selection-row">
            <div className="selection-field">
              <label htmlFor="grade-select">Select Grade:</label>
              <select 
                id="grade-select"
                value={selectedGrade}
                onChange={handleGradeChange}
              >
                <option value="">-- Select Grade --</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            {selectedGrade && (
              isHigherGrade ? (
                <div className="selection-field">
                  <label htmlFor="stream-select">Select Stream:</label>
                  <select 
                    id="stream-select"
                    value={selectedStream}
                    onChange={handleStreamChange}
                  >
                    <option value="">-- Select Stream --</option>
                    {streams.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="selection-field">
                  <label htmlFor="section-select">Select Section:</label>
                  <select 
                    id="section-select"
                    value={selectedSection}
                    onChange={handleSectionChange}
                  >
                    <option value="">-- Select Section --</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
          
          {/* Show a proceed button when selection is complete */}
          {hasCompleteSelection && (
            <div className="selection-action">
              <button className="proceed-btn" onClick={() => window.scrollTo({ top: document.getElementById('attendance-content').offsetTop, behavior: 'smooth' })}>
                Proceed to Attendance
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tab content
  const renderTabContent = () => {
    if (activeTab === "mark") {
      // If it's a Sunday or holiday, show message
      if (isAttendanceDisabled) {
        return (
          <div className="attendance-holiday-state">
            <div className="holiday-icon">
              {isSunday ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2" />
                  <path d="M12 21v2" />
                  <path d="M4.22 4.22l1.42 1.42" />
                  <path d="M18.36 18.36l1.42 1.42" />
                  <path d="M1 12h2" />
                  <path d="M21 12h2" />
                  <path d="M4.22 19.78l1.42-1.42" />
                  <path d="M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              )}
            </div>
            <h3>{isSunday ? "Sunday – Holiday!" : "Holiday!"}</h3>
            <p>Attendance marking is not available for this date.</p>
            {!isSunday && (
              <div className="holiday-actions">
                <button 
                  className="proceed-btn" 
                  onClick={toggleHoliday}
                >
                  Remove Holiday
                </button>
              </div>
            )}
          </div>
        );
      }
      
      return (
        <>
          {!isSunday && (
            <div className="holiday-toggle">
              <button 
                className="proceed-btn" 
                onClick={toggleHoliday}
              >
                {isHoliday ? 'Remove Holiday' : 'Mark as Holiday'}
              </button>
            </div>
          )}
          <AttendanceForm
            students={students}
            attendanceData={attendanceData}
            onChange={handleAttendanceChange}
            onSave={handleSaveAttendance}
            disabled={isLoading || isAttendanceDisabled}
          />
        </>
      );
    } else if (activeTab === "view") {
      // For view tab, show empty state if no saved attendance
      const savedKey = `${selectedGrade}-${isHigherGrade ? selectedStream : selectedSection}-${selectedDate}`;
      const hasSavedData = savedAttendance[savedKey] && savedAttendance[savedKey].length > 0;
      
      if (!hasSavedData) {
        return (
          <div className="attendance-empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3>No Attendance Records</h3>
            {isAttendanceDisabled ? (
              <p>{isSunday ? "This date is a Sunday. No attendance is taken on Sundays." : "This date is marked as a holiday. No attendance is taken on holidays."}</p>
            ) : (
              <p>No attendance has been saved for this class and date yet.</p>
            )}
            {!isAttendanceDisabled && (
              <button 
                className="tab-btn" 
                onClick={() => setActiveTab("mark")}
              >
                Mark Attendance
              </button>
            )}
          </div>
        );
      }
      
      return (
        <AttendanceTable
          students={students}
          attendanceData={savedAttendance[savedKey] || []}
          selectedDate={selectedDate}
          disabled={false}
          selectedGrade={selectedGrade}
          selectedSection={isHigherGrade ? selectedStream : selectedSection}
        />
      );
    } else if (activeTab === "summary") {
      const summaryData = generateAttendanceSummary();
      
      // Show empty state if no saved attendance records
      if (summaryData.length === 0) {
        return (
          <div className="attendance-empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3>No Attendance Summary</h3>
            <p>No attendance records have been saved for this class yet.</p>
            <button 
              className="tab-btn" 
              onClick={() => setActiveTab("mark")}
            >
              Mark Attendance
            </button>
          </div>
        );
      }
      
      return (
        <AttendanceSummary
          summaryData={summaryData}
          selectedGrade={selectedGrade}
          selectedSection={isHigherGrade ? selectedStream : selectedSection}
        />
      );
    }
  };

  return (
    <div className="attendance-management-container">
      <div className="fee-header">
        <h1 className="fee-title">Attendance Management</h1>
      </div>
      
      {renderSelectionForm()}
      
      {hasCompleteSelection && (
        <div id="attendance-content" className="attendance-content">
          <div className="selection-summary">
            <span className="summary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </span>
            <div className="summary-text">
              <span className="summary-label">Class Details:</span>
              <span className="summary-value">
                Grade {selectedGrade} {isHigherGrade ? ` - ${selectedStream}` : ` - Section ${selectedSection}`}
              </span>
            </div>
            <div className="date-selector">
              <label htmlFor="attendance-date">Date:</label>
              <input
                type="date"
                id="attendance-date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="tabs">
            {!isAttendanceDisabled && (
              <button
                className={`tab-btn ${activeTab === "mark" ? "active" : ""}`}
                onClick={() => setActiveTab("mark")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Mark Attendance
              </button>
            )}
            <button
              className={`tab-btn ${activeTab === "view" ? "active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              View Attendance
            </button>
            <button
              className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
              Attendance Summary
            </button>
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement; 
import React, { useEffect, useState } from "react";
import "../../styles/ResultsCSS/ResultsManagement.css";
import InternalMarks from "./InternalMarks";
import OverallMarks from "./OverallMarks";
import TheoryMarks from "./TheoryMarks";

const ResultsManagement = () => {
  // States for selections
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  
  // General states
  const [activeTab, setActiveTab] = useState("theory"); // 'theory', 'internal', or 'overall'
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [theoryMarks, setTheoryMarks] = useState({});
  const [internalMarks, setInternalMarks] = useState({});
  
  // PCM/PCB toggle for Science stream
  const [showPCM, setShowPCM] = useState(true); // true = PCM, false = PCB
  
  // Available grades and sections/streams
  const grades = [
    "1st", "2nd", "3rd", "4th", "5th", "6th", 
    "7th", "8th", "9th", "10th", "11th", "12th"
  ];
  
  const sections = ["A", "B", "C"];
  const streams = ["Science", "Commerce", "Arts"];
  const examTypes = ["Mid-Term", "End-Term"];

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
  
  // Get subjects based on grade and stream
  const getSubjects = () => {
    const grade = selectedGrade;
    const stream = selectedStream;
    
    if (grade === "1st" || grade === "2nd" || grade === "3rd" || grade === "4th" || grade === "5th") {
      return ["Science", "Social Studies", "Maths", "Hindi", "GK"];
    } else if (grade === "6th" || grade === "7th" || grade === "8th") {
      return ["Science", "Social Studies", "Maths", "Hindi", "IT"];
    } else if (grade === "9th" || grade === "10th") {
      return ["Science", "Social Studies", "Maths", "Hindi", "PE"];
    } else if (grade === "11th" || grade === "12th") {
      if (stream === "Science") {
        // For Science stream, students will have either Maths or Biology
        return ["Physics", "Chemistry", "Maths/Biology", "English", "PE"];
      } else if (stream === "Commerce") {
        return ["Accounts", "Economics", "BST", "English", "PE"];
      } else if (stream === "Arts") {
        return ["History", "Geography", "Political Science", "Psychology", "English", "PE"];
      }
    }
    
    return [];
  };
  
  // Check if all required selections are made
  const hasCompleteSelection = selectedGrade && 
    (isHigherGrade ? selectedStream && selectedExamType : selectedSection && selectedExamType);

  // Load students based on selection
  useEffect(() => {
    if (hasCompleteSelection) {
      // In a real app, this would be an API call with filters
      let studentsArray = [];
      
      // Generate between 15-25 students
      const numberOfStudents = getRandomInt(15, 25);
      
      // Generate student names
      for (let i = 0; i < numberOfStudents; i++) {
        let student = {
          id: i + 1,
          name: generateRandomName(),
          class: selectedGrade,
          section: isHigherGrade ? selectedStream : selectedSection
        };
        
        // For Science stream, randomly assign Maths or Biology
        if (isHigherGrade && selectedStream === "Science") {
          // Make approximately 60% students take Maths and 40% Biology
          student.hasMaths = Math.random() > 0.4;
        }
        
        studentsArray.push(student);
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
          rollNumber: index + 1
        };
      });
      
      setStudents(studentsArray);
      
      // Initialize marks data structures
      const theoryObj = {};
      const internalObj = {};
      
      studentsArray.forEach(student => {
        theoryObj[student.id] = {};
        internalObj[student.id] = {};
        
        // Initialize subject marks as null
        getSubjects().forEach(subject => {
          // Special handling for Maths/Biology in Science stream
          if (subject === "Maths/Biology" && isHigherGrade && selectedStream === "Science") {
            // Assign only Maths or Biology based on student's assignment
            const actualSubject = student.hasMaths ? "Maths" : "Biology";
            theoryObj[student.id][actualSubject] = null;
            internalObj[student.id][actualSubject] = null;
          } else {
            theoryObj[student.id][subject] = null;
            internalObj[student.id][subject] = null;
          }
        });
      });
      
      setTheoryMarks(theoryObj);
      setInternalMarks(internalObj);
    } else {
      setStudents([]);
      setTheoryMarks({});
      setInternalMarks({});
    }
  }, [selectedGrade, selectedSection, selectedStream, selectedExamType, isHigherGrade, hasCompleteSelection]);

  // Handle grade change
  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    // Reset section/stream when grade changes
    setSelectedSection("");
    setSelectedStream("");
    setSelectedExamType("");
  };

  // Handle section change
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Handle stream change
  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value);
  };
  
  // Handle exam type change
  const handleExamTypeChange = (e) => {
    setSelectedExamType(e.target.value);
  };

  // Update theory marks
  const handleTheoryMarksChange = (studentId, subject, value) => {
    // Ensure value is within range (0-80)
    let newValue = value === "" ? null : parseInt(value, 10);
    if (newValue !== null) {
      newValue = Math.min(80, Math.max(0, newValue));
    }
    
    setTheoryMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: newValue
      }
    }));
  };

  // Update internal marks
  const handleInternalMarksChange = (studentId, subject, value) => {
    // Ensure value is within range (0-20)
    let newValue = value === "" ? null : parseInt(value, 10);
    if (newValue !== null) {
      newValue = Math.min(20, Math.max(0, newValue));
    }
    
    setInternalMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: newValue
      }
    }));
  };

  // Save marks data
  const handleSaveMarks = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Marks saved successfully!");
    }, 800);
  };

  // Render the selection form
  const renderSelectionForm = () => {
    return (
      <div className="selection-form">
        <div className="card-header">
          <h3>Class Selection</h3>
          <p>Please select the class details and exam type to proceed</p>
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
            
            {((isHigherGrade && selectedStream) || (!isHigherGrade && selectedSection)) && (
              <div className="selection-field">
                <label htmlFor="exam-type-select">Select Exam Type:</label>
                <select 
                  id="exam-type-select"
                  value={selectedExamType}
                  onChange={handleExamTypeChange}
                >
                  <option value="">-- Select Exam Type --</option>
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Show a proceed button when selection is complete */}
          {hasCompleteSelection && (
            <div className="selection-action">
              <button 
                className="proceed-btn" 
                onClick={() => window.scrollTo({ top: document.getElementById('results-content').offsetTop, behavior: 'smooth' })}
              >
                Proceed to Results
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tab content
  const renderTabContent = () => {
    const subjects = getSubjects();
    
    if (activeTab === "theory") {
      return (
        <TheoryMarks
          students={students}
          subjects={subjects}
          theoryMarks={theoryMarks}
          onChange={handleTheoryMarksChange}
          onSave={handleSaveMarks}
          disabled={isLoading}
          isHigherGrade={isHigherGrade}
          selectedStream={selectedStream}
          showPCM={showPCM}
          setShowPCM={setShowPCM}
        />
      );
    } else if (activeTab === "internal") {
      return (
        <InternalMarks
          students={students}
          subjects={subjects}
          internalMarks={internalMarks}
          onChange={handleInternalMarksChange}
          onSave={handleSaveMarks}
          disabled={isLoading}
          isHigherGrade={isHigherGrade}
          selectedStream={selectedStream}
          showPCM={showPCM}
          setShowPCM={setShowPCM}
        />
      );
    } else if (activeTab === "overall") {
      return (
        <OverallMarks
          students={students}
          subjects={subjects}
          theoryMarks={theoryMarks}
          internalMarks={internalMarks}
          isHigherGrade={isHigherGrade}
          selectedStream={selectedStream}
          showPCM={showPCM}
          setShowPCM={setShowPCM}
        />
      );
    }
  };

  return (
    <div className="results-management-container">
      <div className="results-header">
        <h1 className="results-title">Results Management</h1>
      </div>
      
      {renderSelectionForm()}
      
      {hasCompleteSelection && (
        <div id="results-content" className="results-content">
          <div className="selection-summary">
            <span className="summary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </span>
            <div className="summary-text">
              <span className="summary-label">Class Details:</span>
              <span className="summary-value">
                Grade {selectedGrade} {isHigherGrade ? ` - ${selectedStream}` : ` - Section ${selectedSection}`}
              </span>
            </div>
            <div className="exam-type">
              <span className="summary-label">Exam:</span>
              <span className="summary-value">{selectedExamType}</span>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "theory" ? "active" : ""}`}
              onClick={() => setActiveTab("theory")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Theory Marks
            </button>
            <button
              className={`tab-btn ${activeTab === "internal" ? "active" : ""}`}
              onClick={() => setActiveTab("internal")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Internal Marks
            </button>
            <button
              className={`tab-btn ${activeTab === "overall" ? "active" : ""}`}
              onClick={() => setActiveTab("overall")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
              Overall Marks
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

export default ResultsManagement; 
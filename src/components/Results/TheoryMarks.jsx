import React from "react";
import "../../styles/ResultsCSS/TheoryMarks.css";

const TheoryMarks = ({ 
  students, 
  subjects, 
  theoryMarks, 
  onChange, 
  onSave, 
  disabled,
  isHigherGrade,
  selectedStream,
  showPCM,
  setShowPCM
}) => {
  if (!students || students.length === 0) {
    return (
      <div className="empty-message">
        <p>No students found for the selected class.</p>
      </div>
    );
  }

  // Filter students based on PCM/PCB selection for Science stream
  const filteredStudents = isHigherGrade && selectedStream === "Science"
    ? students.filter(student => student.hasMaths === showPCM)
    : students;

  // Handle mark input change
  const handleMarkChange = (e, studentId, subject) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value === '' || /^\d{1,2}$/.test(value)) {
      onChange(studentId, subject, value);
    }
  };

  // Get the actual subject for Science stream (Maths or Biology)
  const getActualSubject = (student, subject) => {
    if (subject === "Maths/Biology" && isHigherGrade && selectedStream === "Science") {
      return student.hasMaths ? "Maths" : "Biology";
    }
    return subject;
  };

  // Toggle between PCM and PCB
  const togglePCMPCB = () => {
    setShowPCM(!showPCM);
  };

  return (
    <div className="theory-marks-container">
      <div className="marks-header">
        <h3>Theory Marks Entry</h3>
        <p>Enter theory marks for each student (Maximum: 80 marks per subject)</p>
        
        {isHigherGrade && selectedStream === "Science" && (
          <div className="stream-toggle">
            <button 
              className={`toggle-btn ${showPCM ? 'active' : ''}`} 
              onClick={togglePCMPCB}
            >
              {showPCM ? 'PCM Students' : 'PCB Students'}
            </button>
          </div>
        )}
      </div>

      <div className="marks-table">
        <div className="table-header">
          <div className="roll-col">Roll No.</div>
          <div className="name-col">Student Name</div>
          {subjects.map((subject) => (
            <div key={subject} className="mark-col">
              {subject === "Maths/Biology" && isHigherGrade && selectedStream === "Science" 
                ? (showPCM ? "Maths" : "Biology") 
                : subject} <span className="max-marks">/80</span>
            </div>
          ))}
        </div>

        <div className="table-body">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.id} className="table-row">
                <div className="roll-col">{student.rollNumber}</div>
                <div className="name-col">{student.name}</div>
                
                {subjects.map((subject) => {
                  const actualSubject = getActualSubject(student, subject);
                  return (
                    <div key={`${student.id}-${actualSubject}`} className="mark-col">
                      <input
                        type="text"
                        value={theoryMarks[student.id]?.[actualSubject] ?? ""}
                        onChange={(e) => handleMarkChange(e, student.id, actualSubject)}
                        placeholder="/80"
                        maxLength="2"
                        disabled={disabled}
                        className="mark-input"
                      />
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="empty-table-message">
              <p>No students found for {showPCM ? 'PCM' : 'PCB'} stream.</p>
            </div>
          )}
        </div>
      </div>

      <div className="marks-actions">
        <button 
          className="save-btn" 
          onClick={onSave}
          disabled={disabled}
        >
          {disabled ? "Saving..." : "Save Theory Marks"}
        </button>
      </div>
    </div>
  );
};

export default TheoryMarks; 
import React, { useMemo, useState } from "react";
import "../../styles/ResultsCSS/OverallMarks.css";

const OverallMarks = ({ 
  students, 
  subjects, 
  theoryMarks, 
  internalMarks,
  isHigherGrade,
  selectedStream,
  showPCM,
  setShowPCM
}) => {
  const [sortBy, setSortBy] = useState("rollNumber"); // 'rollNumber', 'name', 'percentage'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'

  // Filter students based on PCM/PCB selection for Science stream
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];
    
    return isHigherGrade && selectedStream === "Science"
      ? students.filter(student => student.hasMaths === showPCM)
      : students;
  }, [students, isHigherGrade, selectedStream, showPCM]);

  // Calculate total marks and percentage for each student
  const studentsWithTotals = useMemo(() => {
    return filteredStudents.map(student => {
      const studentSubjects = {};
      let totalMarks = 0;
      let maximumMarks = 0;
      
      // Process each subject
      subjects.forEach(subject => {
        let actualSubject = subject;
        
        // Handle Maths/Biology special case
        if (subject === "Maths/Biology" && isHigherGrade && selectedStream === "Science") {
          actualSubject = student.hasMaths ? "Maths" : "Biology";
        }
        
        // Get theory and internal marks
        const theory = theoryMarks[student.id]?.[actualSubject] || 0;
        const internal = internalMarks[student.id]?.[actualSubject] || 0;
        
        // Calculate total for this subject
        const subjectTotal = parseInt(theory) + parseInt(internal);
        
        // Add to student's subjects
        studentSubjects[actualSubject] = {
          theory: theory,
          internal: internal,
          total: subjectTotal
        };
        
        // Add to overall totals
        totalMarks += subjectTotal;
        maximumMarks += 100; // 80 + 20 per subject
      });
      
      // Calculate percentage
      const percentage = maximumMarks > 0 ? (totalMarks / maximumMarks) * 100 : 0;
      
      return {
        ...student,
        subjects: studentSubjects,
        totalMarks,
        maximumMarks,
        percentage: percentage.toFixed(2)
      };
    });
  }, [filteredStudents, subjects, theoryMarks, internalMarks, isHigherGrade, selectedStream]);

  // Sort students based on criteria
  const sortedStudents = useMemo(() => {
    return [...studentsWithTotals].sort((a, b) => {
      if (sortBy === "rollNumber") {
        return sortOrder === "asc" 
          ? a.rollNumber - b.rollNumber 
          : b.rollNumber - a.rollNumber;
      } else if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "percentage") {
        return sortOrder === "asc" 
          ? parseFloat(a.percentage) - parseFloat(b.percentage)
          : parseFloat(b.percentage) - parseFloat(a.percentage);
      }
      return 0;
    });
  }, [studentsWithTotals, sortBy, sortOrder]);

  if (!students || students.length === 0) {
    return (
      <div className="empty-message">
        <p>No students found for the selected class.</p>
      </div>
    );
  }

  // Handle sort change
  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      // Toggle order if same criteria
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New criteria, default to descending for percentage, ascending for others
      setSortBy(criteria);
      setSortOrder(criteria === "percentage" ? "desc" : "asc");
    }
  };

  // Get actual subjects to display (handle Maths/Biology special case)
  const getDisplaySubjects = () => {
    if (isHigherGrade && selectedStream === "Science") {
      const index = subjects.indexOf("Maths/Biology");
      if (index !== -1) {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1, showPCM ? "Maths" : "Biology"); // Display Maths or Biology based on toggle
        return newSubjects;
      }
    }
    return subjects;
  };

  // Toggle between PCM and PCB
  const togglePCMPCB = () => {
    setShowPCM(!showPCM);
  };

  // Export to Excel function
  const exportToExcel = () => {
    // Prepare data for export
    const headers = ["Roll No", "Student Name", ...getDisplaySubjects(), "Total", "Percentage"];
    
    // Create array of student data rows
    const rows = sortedStudents.map(student => {
      const subjectMarks = getDisplaySubjects().map(subject => {
        let displaySubject = subject;
        if (subject === "Maths/Biology" && isHigherGrade && selectedStream === "Science") {
          displaySubject = student.hasMaths ? "Maths" : "Biology";
        }
        const subjectData = student.subjects[displaySubject] || { total: 0 };
        return subjectData.total;
      });
      
      return [
        student.rollNumber || "",
        student.name || "",
        ...subjectMarks,
        student.totalMarks || 0,
        student.percentage || "0"
      ];
    });
    
    // Create CSV content
    let csvContent = headers.join(",") + "\r\n";
    rows.forEach(row => {
      // Add quotes around fields with commas
      const quotedRow = row.map(field => {
        const fieldStr = String(field);
        return fieldStr.includes(",") ? `"${fieldStr}"` : fieldStr;
      });
      csvContent += quotedRow.join(",") + "\r\n";
    });
    
    // Create file name
    const streamType = isHigherGrade && selectedStream === "Science" ? (showPCM ? "-PCM" : "-PCB") : "";
    const grade = isHigherGrade ? `${selectedStream}${streamType}` : "";
    const fileName = `Results-Grade${grade}.csv`;
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overall-marks-container">
      <div className="marks-header">
        <h3>Overall Results</h3>
        <p>Combined theory and internal assessment results</p>
        
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
        
        <div className="sort-controls">
          <label>Sort by:</label>
          <button 
            className={`sort-btn ${sortBy === "rollNumber" ? "active" : ""}`}
            onClick={() => handleSortChange("rollNumber")}
          >
            Roll Number {sortBy === "rollNumber" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button 
            className={`sort-btn ${sortBy === "name" ? "active" : ""}`}
            onClick={() => handleSortChange("name")}
          >
            Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button 
            className={`sort-btn ${sortBy === "percentage" ? "active" : ""}`}
            onClick={() => handleSortChange("percentage")}
          >
            Percentage {sortBy === "percentage" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="overall-table">
        <div className="table-header">
          <div className="roll-col">Roll No.</div>
          <div className="name-col">Student Name</div>
          {getDisplaySubjects().map((subject) => (
            <div key={subject} className="mark-col">
              {subject}
            </div>
          ))}
          <div className="total-col">Total</div>
          <div className="percentage-col">%</div>
        </div>

        <div className="table-body">
          {sortedStudents.length > 0 ? (
            sortedStudents.map((student) => (
              <div key={student.id} className="table-row">
                <div className="roll-col">{student.rollNumber}</div>
                <div className="name-col">{student.name}</div>
                
                {getDisplaySubjects().map((subject) => {
                  let displaySubject = subject;
                  
                  // Handle Maths/Biology display
                  if (subject === "Maths/Biology" && isHigherGrade && selectedStream === "Science") {
                    displaySubject = student.hasMaths ? "Maths" : "Biology";
                  }
                  
                  const subjectData = student.subjects[displaySubject] || { total: 0 };
                  
                  return (
                    <div key={`${student.id}-${displaySubject}`} className="mark-col">
                      {subjectData.total}
                    </div>
                  );
                })}
                
                <div className="total-col">{student.totalMarks}</div>
                <div className="percentage-col">{student.percentage}%</div>
              </div>
            ))
          ) : (
            <div className="empty-table-message">
              <p>No students found for {showPCM ? 'PCM' : 'PCB'} stream.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="export-section">
        <button className="export-btn" onClick={exportToExcel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default OverallMarks; 
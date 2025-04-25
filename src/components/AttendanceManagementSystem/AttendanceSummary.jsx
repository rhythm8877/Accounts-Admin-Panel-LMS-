import React, { useState } from "react";
import "../../styles/AttendanceManagementCSS/AttendanceSummary.css";

const AttendanceSummary = ({ summaryData, selectedGrade, selectedSection }) => {
  const [filter, setFilter] = useState("all"); // all, below75, above75, perfect
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculate attendance statistics
  const totalStudents = summaryData.length;
  const belowThresholdCount = summaryData.filter(student => parseFloat(student.attendancePercentage) <= 75).length;
  const aboveThresholdCount = summaryData.filter(student => parseFloat(student.attendancePercentage) > 75 && parseFloat(student.attendancePercentage) < 100).length;
  const perfectAttendanceCount = summaryData.filter(student => parseFloat(student.attendancePercentage) === 100).length;
  
  // Define the attendance threshold percentage
  const attendanceThreshold = 75;
  
  // Filter and search students
  const filteredData = summaryData.filter(student => {
    const percentageValue = parseFloat(student.attendancePercentage);
    const matchesFilter =
      filter === "all" ||
      (filter === "below75" && percentageValue <= attendanceThreshold) ||
      (filter === "above75" && percentageValue > attendanceThreshold && percentageValue < 100) ||
      (filter === "perfect" && percentageValue === 100);

    const matchesSearch = searchTerm === "" || 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toString().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });
  
  // Function to get the appropriate CSS class based on attendance percentage
  const getAttendanceClass = (percentage) => {
    const percentageValue = parseFloat(percentage);
    if (percentageValue === 100) return "perfect";
    if (percentageValue > 90) return "excellent";
    if (percentageValue > attendanceThreshold) return "good";
    if (percentageValue > 60) return "warning";
    return "poor";
  };
  
  // Function to get tooltip text based on attendance percentage
  const getAttendanceTooltip = (percentage) => {
    const percentageValue = parseFloat(percentage);
    if (percentageValue === 100) return "Perfect Attendance";
    if (percentageValue > 90) return "Excellent Attendance";
    if (percentageValue > attendanceThreshold) return "Good Attendance";
    if (percentageValue > 60) return "Warning: Below Threshold";
    return "Critical: Poor Attendance";
  };
  
  // Export to Excel function
  const exportToExcel = () => {
    // Prepare data for export
    const headers = ["Roll No", "Name", "Total Classes", "Present", "Absent", "Attendance %"];
    
    // Create array of student data rows
    const rows = filteredData.map(student => [
      student.rollNumber || "",
      student.name || "",
      student.totalClasses || 0,
      student.presentCount || 0,
      student.absentCount || 0,
      student.attendancePercentage || "0"
    ]);
    
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
    
    // Create file name: Grade-Section-AttendanceSummary
    const fileName = `${selectedGrade}-${selectedSection}-AttendanceSummary.xlsx`;
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
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
    <div className="attendance-summary-container">
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card poor">
          <div className="stat-value">{belowThresholdCount}</div>
          <div className="stat-label">Below 75%</div>
        </div>
        <div className="stat-card good">
          <div className="stat-value">{aboveThresholdCount}</div>
          <div className="stat-label">Above 75%</div>
        </div>
        <div className="stat-card perfect">
          <div className="stat-value">{perfectAttendanceCount}</div>
          <div className="stat-label">100% Attendance</div>
        </div>
      </div>

      <div className="summary-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <label className={`filter-option ${filter === "all" ? "active" : ""}`}>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            All
          </label>
          <label className={`filter-option ${filter === "below75" ? "active" : ""}`}>
            <input
              type="radio"
              name="filter"
              value="below75"
              checked={filter === "below75"}
              onChange={() => setFilter("below75")}
            />
            Below 75%
          </label>
          <label className={`filter-option ${filter === "above75" ? "active" : ""}`}>
            <input
              type="radio"
              name="filter"
              value="above75"
              checked={filter === "above75"}
              onChange={() => setFilter("above75")}
            />
            Above 75%
          </label>
          <label className={`filter-option ${filter === "perfect" ? "active" : ""}`}>
            <input
              type="radio"
              name="filter"
              value="perfect"
              checked={filter === "perfect"}
              onChange={() => setFilter("perfect")}
            />
            100%
          </label>
        </div>
      </div>

      <div className="summary-table">
        <div className="table-header">
          <div className="roll-col">Roll No</div>
          <div className="name-col">Name</div>
          <div className="classes-col">Total Classes</div>
          <div className="present-col">Present</div>
          <div className="absent-col">Absent</div>
          <div className="percentage-col">Attendance %</div>
        </div>
        
        <div className="table-body">
          {filteredData.length > 0 ? (
            filteredData.map(student => (
              <div key={student.id} className="table-row">
                <div className="roll-col">{student.rollNumber}</div>
                <div className="name-col">{student.name}</div>
                <div className="classes-col">{student.totalClasses}</div>
                <div className="present-col">{student.presentCount}</div>
                <div className="absent-col">{student.absentCount}</div>
                <div className="percentage-col">
                  <span 
                    className={`percentage-badge ${getAttendanceClass(student.attendancePercentage)}`}
                    title={getAttendanceTooltip(student.attendancePercentage)}
                  >
                    {student.attendancePercentage}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No students match the current filters</div>
          )}
        </div>
      </div>
      
      <div className="export-container">
        <button className="export-btn" onClick={exportToExcel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Attendance Summary
        </button>
      </div>
    </div>
  );
};

export default AttendanceSummary; 
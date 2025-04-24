import React, { useState } from "react";
import "../../styles/AttendanceManagementCSS/AttendanceTable.css";

const AttendanceTable = ({ attendanceData, students, selectedDate, disabled, selectedGrade, selectedSection }) => {
  const [filter, setFilter] = useState("all"); // all, present, absent
  const [searchTerm, setSearchTerm] = useState("");

  // If no data or component is disabled, show a message
  if (disabled || !attendanceData || attendanceData.length === 0) {
    return (
      <div className="attendance-table-container">
        <div className="no-data-message">
          No attendance data available. Please mark attendance first.
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter(student => student.status === "present").length;
  const absentCount = totalStudents - presentCount;
  const attendancePercentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(2) : 0;

  // Filter and search students
  const filteredData = attendanceData.filter(student => {
    const matchesFilter =
      filter === "all" ||
      (filter === "present" && student.status === "present") ||
      (filter === "absent" && student.status === "absent");

    const studentDetails = students.find(s => s.id === student.id) || {};
    const matchesSearch = searchTerm === "" || 
      studentDetails.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentDetails.rollNumber?.toString().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  // Function to export data to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const headers = ["Roll No", "Name", "Status"];
    
    // Create array of student data rows
    const rows = filteredData.map(record => {
      const studentDetails = students.find(s => s.id === record.id) || {};
      return [
        studentDetails.rollNumber || "",
        studentDetails.name || "",
        record.status === "present" ? "Present" : "Absent"
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
    
    // Format date for file name (YYYY-MM-DD)
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    
    // Create file name: Grade-Section-Date
    const fileName = `${selectedGrade}-${selectedSection}-${formattedDate}.xlsx`;
    
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
    <div className="attendance-table-container">
      <div className="attendance-summary">
        <div className="summary-item">
          <span className="label">Date:</span>
          <span className="value">{new Date(selectedDate).toLocaleDateString()}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total:</span>
          <span className="value">{totalStudents}</span>
        </div>
        <div className="summary-item">
          <span className="label">Present:</span>
          <span className="value present">{presentCount}</span>
        </div>
        <div className="summary-item">
          <span className="label">Absent:</span>
          <span className="value absent">{absentCount}</span>
        </div>
        <div className="summary-item">
          <span className="label">Attendance:</span>
          <span className="value">{attendancePercentage}%</span>
        </div>
      </div>

      <div className="table-controls">
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
          <label className={`filter-option ${filter === "present" ? "active" : ""}`}>
            <input
              type="radio"
              name="filter"
              value="present"
              checked={filter === "present"}
              onChange={() => setFilter("present")}
            />
            Present
          </label>
          <label className={`filter-option ${filter === "absent" ? "active" : ""}`}>
            <input
              type="radio"
              name="filter"
              value="absent"
              checked={filter === "absent"}
              onChange={() => setFilter("absent")}
            />
            Absent
          </label>
        </div>
      </div>

      <div className="attendance-data-table">
        <div className="table-header">
          <div className="roll-col">Roll No</div>
          <div className="name-col">Name</div>
          <div className="status-col">Status</div>
        </div>
        
        <div className="table-body">
          {filteredData.length > 0 ? (
            filteredData.map(record => {
              const studentDetails = students.find(s => s.id === record.id) || {};
              return (
                <div key={record.id} className="table-row">
                  <div className="roll-col">{studentDetails.rollNumber}</div>
                  <div className="name-col">{studentDetails.name}</div>
                  <div className="status-col">
                    <span className={`status-badge ${record.status}`}>
                      {record.status === "present" ? "Present" : "Absent"}
                    </span>
                  </div>
                </div>
              );
            })
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
          Export Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable; 
import React, { useState } from "react";
import "../../styles/AttendanceManagementCSS/AttendanceTable.css";

const AttendanceTable = ({ attendanceData, students, selectedDate, disabled }) => {
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
        <button className="export-btn">Export to CSV</button>
        <button className="export-btn">Print</button>
      </div>
    </div>
  );
};

export default AttendanceTable; 
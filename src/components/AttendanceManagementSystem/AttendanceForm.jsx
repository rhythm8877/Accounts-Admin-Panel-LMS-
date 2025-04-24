import React from 'react';
import '../../styles/AttendanceManagementCSS/AttendanceForm.css';

const AttendanceForm = ({ 
  students, 
  attendanceData, 
  onChange, 
  onSave, 
  disabled 
}) => {
  // Handle status change for a student
  const handleStatusChange = (studentId, status) => {
    const updatedAttendance = attendanceData.map(record => 
      record.id === studentId ? { ...record, status } : record
    );
    onChange(updatedAttendance);
  };

  // Mark all students as present or absent
  const markAll = (status) => {
    const updatedAttendance = attendanceData.map(record => ({ 
      ...record, 
      status 
    }));
    onChange(updatedAttendance);
  };

  // Calculate present and absent counts
  const presentCount = attendanceData?.filter(record => record.status === "present").length || 0;
  const absentCount = attendanceData?.filter(record => record.status === "absent").length || 0;
  const totalStudents = students?.length || 0;

  // If no students or component is disabled, show a message
  if (disabled || totalStudents === 0) {
    return (
      <div className="attendance-form-container">
        <div className="no-data-message">
          {disabled ? "Loading..." : "No students available to mark attendance."}
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-form-container">
      <div className="attendance-summary">
        <div className="summary-item">
          <span className="label">Total Students:</span>
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
          <span className="label">Attendance %:</span>
          <span className="value">
            {totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(2) : 0}%
          </span>
        </div>
      </div>

      <div className="bulk-actions">
        <button 
          className="btn-present" 
          onClick={() => markAll("present")}
          disabled={disabled}
        >
          Mark All Present
        </button>
        <button 
          className="btn-absent" 
          onClick={() => markAll("absent")}
          disabled={disabled}
        >
          Mark All Absent
        </button>
      </div>

      <div className="attendance-table">
        <div className="attendance-header">
          <div className="roll-col">Roll No</div>
          <div className="name-col">Name</div>
          <div className="status-col">Status</div>
        </div>
        
        <div className="attendance-body">
          {attendanceData.map(record => {
            const student = students.find(s => s.id === record.id) || {};
            return (
              <div key={record.id} className="attendance-row">
                <div className="roll-col">{student.rollNumber}</div>
                <div className="name-col">{student.name}</div>
                <div className="status-col">
                  <label className={`status-option ${record.status === "present" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name={`attendance-${record.id}`}
                      value="present"
                      checked={record.status === "present"}
                      onChange={() => handleStatusChange(record.id, "present")}
                      disabled={disabled}
                    />
                    Present
                  </label>
                  <label className={`status-option ${record.status === "absent" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name={`attendance-${record.id}`}
                      value="absent"
                      checked={record.status === "absent"}
                      onChange={() => handleStatusChange(record.id, "absent")}
                      disabled={disabled}
                    />
                    Absent
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-actions">
        <button 
          className="save-button" 
          onClick={onSave}
          disabled={disabled}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceForm; 
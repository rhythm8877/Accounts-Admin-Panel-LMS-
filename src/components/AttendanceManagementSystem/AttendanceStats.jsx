import React, { useEffect, useState } from 'react';
import '../../styles/AttendanceManagementCSS/AttendanceStats.css';

const AttendanceStats = ({ attendanceData, selectedClass, selectedSection }) => {
  const [statsData, setStatsData] = useState({
    averageAttendance: 0,
    highAttendance: 0,
    mediumAttendance: 0,
    lowAttendance: 0,
    attendanceByDay: [],
  });

  useEffect(() => {
    if (attendanceData.length === 0) return;

    // Calculate average attendance
    const totalPercentage = attendanceData.reduce(
      (sum, student) => sum + parseFloat(student.attendancePercentage),
      0
    );
    const averageAttendance = (totalPercentage / attendanceData.length).toFixed(2);

    // Count students by attendance category
    const highAttendance = attendanceData.filter(student => parseFloat(student.attendancePercentage) >= 75).length;
    const mediumAttendance = attendanceData.filter(
      student => 
        parseFloat(student.attendancePercentage) >= 50 && 
        parseFloat(student.attendancePercentage) < 75
    ).length;
    const lowAttendance = attendanceData.filter(student => parseFloat(student.attendancePercentage) < 50).length;

    // Generate dummy data for attendance by day of week (in a real app, this would be calculated from actual records)
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const attendanceByDay = daysOfWeek.map(day => ({
      day,
      percentage: (70 + Math.random() * 25).toFixed(2)
    }));

    setStatsData({
      averageAttendance,
      highAttendance,
      mediumAttendance,
      lowAttendance,
      attendanceByDay
    });
  }, [attendanceData]);

  // Render bar graph
  const renderBarGraph = () => {
    const maxPercentage = 100;
    
    return (
      <div className="attendance-bar-graph">
        <h3>Attendance by Day of Week</h3>
        <div className="graph-container">
          {statsData.attendanceByDay.map((dayData, index) => (
            <div className="graph-bar-container" key={index}>
              <div className="graph-label">{dayData.day}</div>
              <div className="graph-bar-wrapper">
                <div 
                  className="graph-bar"
                  style={{ height: `${(parseFloat(dayData.percentage) / maxPercentage) * 200}px` }}
                >
                  <span className="graph-value">{dayData.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render pie chart
  const renderPieChart = () => {
    const total = statsData.highAttendance + statsData.mediumAttendance + statsData.lowAttendance;
    
    // Calculate percentages and angles for pie segments
    const highPercentage = ((statsData.highAttendance / total) * 100).toFixed(2);
    const mediumPercentage = ((statsData.mediumAttendance / total) * 100).toFixed(2);
    const lowPercentage = ((statsData.lowAttendance / total) * 100).toFixed(2);
    
    // Create CSS conic gradient for pie chart
    const conicGradient = `conic-gradient(
      #4CAF50 0% ${highPercentage}%, 
      #FFC107 ${highPercentage}% ${parseFloat(highPercentage) + parseFloat(mediumPercentage)}%, 
      #F44336 ${parseFloat(highPercentage) + parseFloat(mediumPercentage)}% 100%
    )`;
    
    return (
      <div className="attendance-pie-chart">
        <h3>Attendance Distribution</h3>
        <div className="pie-chart-container">
          <div 
            className="pie-chart"
            style={{ background: conicGradient }}
          ></div>
          <div className="pie-chart-legend">
            <div className="legend-item">
              <span className="legend-color high"></span>
              <span>High (>75%): {statsData.highAttendance} students ({highPercentage}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color medium"></span>
              <span>Medium (50-75%): {statsData.mediumAttendance} students ({mediumPercentage}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color low"></span>
              <span>Low (<50%): {statsData.lowAttendance} students ({lowPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Display alerts for students with low attendance
  const renderAlerts = () => {
    const studentsWithLowAttendance = attendanceData
      .filter(student => parseFloat(student.attendancePercentage) < 75)
      .sort((a, b) => parseFloat(a.attendancePercentage) - parseFloat(b.attendancePercentage));

    return (
      <div className="attendance-alerts">
        <h3>Attendance Alerts</h3>
        {studentsWithLowAttendance.length > 0 ? (
          <div className="alerts-list">
            {studentsWithLowAttendance.map(student => (
              <div 
                key={student.id} 
                className={`alert-item ${parseFloat(student.attendancePercentage) < 50 ? 'critical' : 'warning'}`}
              >
                <span className="alert-name">{student.name}</span>
                <span className="alert-roll">Roll No: {student.rollNumber}</span>
                <span className="alert-percentage">{student.attendancePercentage}%</span>
                <div className="alert-message">
                  {parseFloat(student.attendancePercentage) < 50 
                    ? 'Critical: Attendance below 50%'
                    : 'Warning: Attendance below 75%'
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-alerts">No students with attendance below 75%</div>
        )}
      </div>
    );
  };

  return (
    <div className="attendance-stats">
      <div className="stats-header">
        <h2>
          Attendance Statistics - Class {selectedClass} Section {selectedSection}
        </h2>
        <div className="overall-stat">
          <span className="stat-label">Overall Attendance:</span>
          <span className="stat-value">{statsData.averageAttendance}%</span>
        </div>
      </div>
      
      {attendanceData.length > 0 ? (
        <div className="stats-content">
          <div className="stats-row">
            {renderPieChart()}
            {renderBarGraph()}
          </div>
          {renderAlerts()}
        </div>
      ) : (
        <div className="no-data">
          No attendance data available. Please select a class and section first.
        </div>
      )}
    </div>
  );
};

export default AttendanceStats; 
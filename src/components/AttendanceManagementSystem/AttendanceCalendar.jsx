import React, { useEffect, useState } from 'react';
import '../../styles/AttendanceManagementCSS/AttendanceCalendar.css';
import { holidays } from './dummyData';

const AttendanceCalendar = ({ selectedClass, selectedSection, students, attendanceRecords }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('all');
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate years for the selector (current year and previous year)
  const years = [selectedYear - 1, selectedYear, selectedYear + 1];
  
  // Generate calendar data for the selected month and year
  useEffect(() => {
    if (students.length === 0) return;
    
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    
    // Generate calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: null, date: null });
    }
    
    // Add days of the month with attendance data
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Skip weekends
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Check if it's a holiday
      const isHoliday = holidays.find(holiday => holiday.date === dateString);
      
      // Get attendance for this date
      let presentCount = 0;
      let absentCount = 0;
      
      if (!isWeekend && !isHoliday) {
        // If viewing all students
        if (selectedStudent === 'all') {
          // Filter records for this date and selected class/section
          const dateRecords = attendanceRecords.filter(record => {
            const studentInfo = students.find(s => s.id === record.studentId);
            return record.date === dateString && studentInfo;
          });
          
          presentCount = dateRecords.filter(record => record.status === 'present').length;
          absentCount = dateRecords.filter(record => record.status === 'absent').length;
        } 
        // If viewing a specific student
        else {
          const studentRecord = attendanceRecords.find(
            record => record.date === dateString && record.studentId === parseInt(selectedStudent)
          );
          
          if (studentRecord) {
            if (studentRecord.status === 'present') presentCount = 1;
            else absentCount = 1;
          }
        }
      }
      
      calendarDays.push({
        day,
        date: dateString,
        isWeekend,
        isHoliday: isHoliday ? isHoliday.name : null,
        presentCount,
        absentCount,
        total: presentCount + absentCount
      });
    }
    
    setCalendarData(calendarDays);
  }, [selectedMonth, selectedYear, students, attendanceRecords, selectedStudent]);
  
  // Get attendance status class based on attendance percentage
  const getAttendanceStatusClass = (present, total) => {
    if (total === 0) return '';
    
    const percentage = (present / total) * 100;
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };
  
  // Handle previous month button
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  // Handle next month button
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="attendance-calendar">
      <div className="calendar-header">
        <h2>
          Attendance Calendar - Class {selectedClass} Section {selectedSection}
        </h2>
        
        <div className="calendar-controls">
          <div className="calendar-selector">
            <label htmlFor="student-select">Student:</label>
            <select 
              id="student-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="all">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Roll No: {student.rollNumber})
                </option>
              ))}
            </select>
          </div>
          
          <div className="month-selector">
            <button onClick={handlePrevMonth} className="nav-btn">
              &lt;
            </button>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button onClick={handleNextMonth} className="nav-btn">
              &gt;
            </button>
          </div>
        </div>
      </div>
      
      {students.length > 0 ? (
        <div className="calendar-grid">
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>
          
          {calendarData.map((day, index) => (
            <div 
              key={index}
              className={`calendar-day ${!day.day ? 'empty' : ''} ${day.isWeekend ? 'weekend' : ''} ${day.isHoliday ? 'holiday' : ''}`}
            >
              {day.day && (
                <>
                  <div className="day-number">{day.day}</div>
                  
                  {day.isHoliday ? (
                    <div className="holiday-name">{day.isHoliday}</div>
                  ) : day.isWeekend ? (
                    <div className="weekend-label">Weekend</div>
                  ) : (
                    <div className="attendance-info">
                      {day.total > 0 ? (
                        <div className={`attendance-status ${getAttendanceStatusClass(day.presentCount, day.total)}`}>
                          {selectedStudent === 'all' ? (
                            <>
                              <div>Present: {day.presentCount}</div>
                              <div>Absent: {day.absentCount}</div>
                              <div>
                                {((day.presentCount / day.total) * 100).toFixed(0)}%
                              </div>
                            </>
                          ) : (
                            day.presentCount > 0 ? 'Present' : 'Absent'
                          )}
                        </div>
                      ) : (
                        <div className="no-data">No Data</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          No student data available. Please select a class and section first.
        </div>
      )}
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color weekend"></span>
          <span>Weekend</span>
        </div>
        <div className="legend-item">
          <span className="legend-color holiday"></span>
          <span>Holiday</span>
        </div>
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span>&gt;75% Attendance</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span>50-75% Attendance</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span>&lt;50% Attendance</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar; 
import React from 'react';
import '../../styles/AttendanceManagementCSS/ClassSectionSelector.css';

const ClassSectionSelector = ({ 
  classes, 
  sections, 
  selectedClass, 
  selectedSection,
  onClassChange,
  onSectionChange
}) => {
  return (
    <div className="class-section-selector">
      <div className="selector-field">
        <label htmlFor="class-select">Class:</label>
        <select 
          id="class-select"
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>
      
      <div className="selector-field">
        <label htmlFor="section-select">Section:</label>
        <select 
          id="section-select"
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          disabled={!selectedClass}
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section} value={section}>
              Section {section}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClassSectionSelector; 
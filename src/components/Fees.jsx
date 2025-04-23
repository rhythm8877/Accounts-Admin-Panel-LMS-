import React, { useEffect, useState } from 'react';
import '../styles/Fees.css';
import PaymentTable from './PaymentTable';

const StudentFeeDetails = () => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentsData, setStudentsData] = useState([]);
  const [showPaymentTable, setShowPaymentTable] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Grade options (1st to 12th)
  const gradeOptions = [
    { value: '1', label: '1st' },
    { value: '2', label: '2nd' },
    { value: '3', label: '3rd' },
    { value: '4', label: '4th' },
    { value: '5', label: '5th' },
    { value: '6', label: '6th' },
    { value: '7', label: '7th' },
    { value: '8', label: '8th' },
    { value: '9', label: '9th' },
    { value: '10', label: '10th' },
    { value: '11', label: '11th' },
    { value: '12', label: '12th' },
  ];

  // Section options (A, B, C)
  const sectionOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
  ];

  // Get grade label from value
  const getGradeLabel = (value) => {
    const option = gradeOptions.find(option => option.value === value);
    return option ? option.label : value;
  };

  // Generate sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: 'Rahul Sharma',
        fatherName: 'Anil Sharma',
        mobile: '9876543210',
        grade: '1',
        section: 'A'
      },
      {
        id: 2,
        name: 'Priya Patel',
        fatherName: 'Suresh Patel',
        mobile: '8765432109',
        grade: '2',
        section: 'B'
      },
      {
        id: 3,
        name: 'Amit Singh',
        fatherName: 'Rajinder Singh',
        mobile: '7654321098',
        grade: '3',
        section: 'C'
      },
      {
        id: 4,
        name: 'Sneha Gupta',
        fatherName: 'Manoj Gupta',
        mobile: '6543210987',
        grade: '4',
        section: 'A'
      },
      {
        id: 5,
        name: 'Vikram Verma',
        fatherName: 'Dinesh Verma',
        mobile: '5432109876',
        grade: '5',
        section: 'B'
      },
      {
        id: 6,
        name: 'Neha Kumar',
        fatherName: 'Rakesh Kumar',
        mobile: '4321098765',
        grade: '6',
        section: 'C'
      },
      {
        id: 7,
        name: 'Rohan Joshi',
        fatherName: 'Prakash Joshi',
        mobile: '3210987654',
        grade: '7',
        section: 'A'
      },
      {
        id: 8,
        name: 'Ananya Mishra',
        fatherName: 'Rajeev Mishra',
        mobile: '2109876543',
        grade: '8',
        section: 'B'
      },
      {
        id: 9,
        name: 'Karan Malhotra',
        fatherName: 'Sanjeev Malhotra',
        mobile: '1098765432',
        grade: '9',
        section: 'C'
      },
      {
        id: 10,
        name: 'Divya Kapoor',
        fatherName: 'Vivek Kapoor',
        mobile: '9087654321',
        grade: '10',
        section: 'A'
      },
      {
        id: 11,
        name: 'Varun Yadav',
        fatherName: 'Ramesh Yadav',
        mobile: '8907654321',
        grade: '11',
        section: 'B'
      },
      {
        id: 12,
        name: 'Meera Reddy',
        fatherName: 'Srinivas Reddy',
        mobile: '7890654321',
        grade: '12',
        section: 'C'
      }
    ];
    
    setStudentsData(sampleData);
  }, []);

  // Filter students based on search, grade, and section
  const filteredStudents = studentsData.filter(student => {
    // Filter by search term (student's name)
    const nameMatches = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by grade if selected
    const gradeMatches = selectedGrade === '' || student.grade === selectedGrade;
    
    // Filter by section if selected
    const sectionMatches = selectedSection === '' || student.section === selectedSection;
    
    return nameMatches && gradeMatches && sectionMatches;
  });

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowPaymentTable(true);
  };

  const handleClosePaymentTable = () => {
    setShowPaymentTable(false);
    setSelectedStudent(null);
  };

  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="fee-title">Student Fee Details</h1>
      </div>
      
      <div className="fee-content-wrapper">
        {/* Filters */}
        <div className="fee-filter-row">
          <div className="fee-filters">
            <div className="fee-filter-group">
              <label className="fee-filter-label">Grade (1st-12th)</label>
              <select
                className="fee-filter-dropdown"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">All Grades</option>
                {gradeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="fee-filter-group">
              <label className="fee-filter-label">Section (A, B, C)</label>
              <select
                className="fee-filter-dropdown"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {sectionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="fee-search-wrapper">
          <input
            type="text"
            className="fee-search-input"
            placeholder="Search by Student's Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Students Table */}
        <div className="fee-table-wrapper">
          <table className="fee-table">
            <thead>
              <tr>
                <th className="fee-th-serial">Sl No.</th>
                <th className="fee-th-name">Student's Name</th>
                <th className="fee-th-parent">Father's/Guardian's Name</th>
                <th className="fee-th-mobile">Parent's/Guardian's Mobile Number</th>
                <th className="fee-th-actions">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td className="fee-td-serial">{index + 1}</td>
                    <td className="fee-td-name">{student.name}</td>
                    <td className="fee-td-parent">{student.fatherName}</td>
                    <td className="fee-td-mobile">{student.mobile}</td>
                    <td className="fee-td-actions">
                      <button 
                        className="fee-view-btn"
                        onClick={() => handleViewDetails(student)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="fee-empty-message">
                    No students found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Table Modal */}
      {showPaymentTable && selectedStudent && (
        <PaymentTable 
          isOpen={showPaymentTable}
          onClose={handleClosePaymentTable}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          studentGrade={getGradeLabel(selectedStudent.grade)}
          studentSection={selectedStudent.section}
          studentFatherName={selectedStudent.fatherName}
        />
      )}
    </div>
  );
};

export default StudentFeeDetails; 
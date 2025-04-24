import React from 'react';
import '../../styles/AttendanceManagementCSS/ExportTools.css';

const ExportTools = ({ attendanceData }) => {
  // Function to generate CSV data
  const generateCSV = () => {
    // Create CSV header
    const headers = ['Roll No', 'Name', 'Class', 'Section', 'Total Classes', 'Present', 'Absent', 'Attendance %'];
    
    // Create CSV rows
    const rows = attendanceData.map(student => [
      student.rollNumber,
      student.name,
      student.class,
      student.section,
      student.totalClasses,
      student.presentCount,
      student.absentCount,
      student.attendancePercentage
    ]);
    
    // Combine header and rows
    const csvData = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    return csvData;
  };
  
  // Function to download CSV file
  const downloadCSV = () => {
    if (attendanceData.length === 0) {
      alert('No data available to export.');
      return;
    }
    
    const csvData = generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to generate Excel XML data
  const generateExcelXML = () => {
    // XML header
    let excelContent = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
    excelContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
    excelContent += '<Worksheet ss:Name="Attendance Report"><Table>';
    
    // Headers
    excelContent += '<Row>';
    const headers = ['Roll No', 'Name', 'Class', 'Section', 'Total Classes', 'Present', 'Absent', 'Attendance %'];
    headers.forEach(header => {
      excelContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
    });
    excelContent += '</Row>';
    
    // Data rows
    attendanceData.forEach(student => {
      excelContent += '<Row>';
      
      // Add each cell
      excelContent += `<Cell><Data ss:Type="Number">${student.rollNumber}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="String">${student.name}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="String">${student.class}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="String">${student.section}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="Number">${student.totalClasses}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="Number">${student.presentCount}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="Number">${student.absentCount}</Data></Cell>`;
      excelContent += `<Cell><Data ss:Type="Number">${student.attendancePercentage}</Data></Cell>`;
      
      excelContent += '</Row>';
    });
    
    // Close XML tags
    excelContent += '</Table></Worksheet></Workbook>';
    
    return excelContent;
  };
  
  // Function to download Excel file
  const downloadExcel = () => {
    if (attendanceData.length === 0) {
      alert('No data available to export.');
      return;
    }
    
    const excelData = generateExcelXML();
    const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to generate PDF data
  const generatePrintView = () => {
    // Create a new window
    const printWindow = window.open('', '_blank');
    
    // Create HTML content
    let htmlContent = `
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { color: #1a5276; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .low { background-color: #ffebee; }
            .medium { background-color: #fff8e1; }
            .high { background-color: #e8f5e9; }
            .print-footer { margin-top: 30px; font-size: 12px; text-align: center; color: #777; }
          </style>
        </head>
        <body>
          <h2>Attendance Report</h2>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Total Classes</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    // Add table rows
    attendanceData.forEach(student => {
      const attendanceClass = parseFloat(student.attendancePercentage) >= 75 ? 'high' : 
                              parseFloat(student.attendancePercentage) >= 50 ? 'medium' : 'low';
      
      htmlContent += `
        <tr>
          <td>${student.rollNumber}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td>${student.section}</td>
          <td>${student.totalClasses}</td>
          <td>${student.presentCount}</td>
          <td>${student.absentCount}</td>
          <td class="${attendanceClass}">${student.attendancePercentage}%</td>
        </tr>
      `;
    });
    
    // Close HTML content
    htmlContent += `
            </tbody>
          </table>
          <div class="print-footer">
            <p>This is a system-generated report.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    // Write to the new window and focus
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div className="export-tools">
      <h3>Export Options</h3>
      <div className="export-buttons">
        <button 
          className="export-btn csv-btn"
          onClick={downloadCSV}
          disabled={attendanceData.length === 0}
        >
          Export to CSV
        </button>
        <button 
          className="export-btn excel-btn"
          onClick={downloadExcel}
          disabled={attendanceData.length === 0}
        >
          Export to Excel
        </button>
        <button 
          className="export-btn print-btn"
          onClick={generatePrintView}
          disabled={attendanceData.length === 0}
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ExportTools; 
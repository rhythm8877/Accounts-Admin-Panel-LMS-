import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useRef, useState } from 'react';
import '../styles/IDCard.css';

const IDCard = ({ studentData, onBack }) => {
  const idCardRef = useRef(null);
  const [downloadClicked, setDownloadClicked] = useState(false);

  const handleDownload = async () => {
    setDownloadClicked(true);
    
    const cardElement = idCardRef.current;
    const frontCard = cardElement.querySelector('.id-card-front');
    const backCard = cardElement.querySelector('.id-card-back');
    
    try {
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Capture front side
      const frontCanvas = await html2canvas(frontCard, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const frontImgData = frontCanvas.toDataURL('image/png');
      
      // Add front side to PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = 100;
      const imgHeight = imgWidth * 1.56; // Maintain aspect ratio
      const xPos = (pdfWidth - imgWidth) / 2;
      
      pdf.addImage(frontImgData, 'PNG', xPos, 20, imgWidth, imgHeight);
      
      // Capture back side
      const backCanvas = await html2canvas(backCard, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const backImgData = backCanvas.toDataURL('image/png');
      
      // Add back side to PDF on the same page below the front
      pdf.addImage(backImgData, 'PNG', xPos, imgHeight + 30, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`ID_Card_${studentData.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setDownloadClicked(false); // Reset if error
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const today = new Date();
  const expiryDate = new Date(today.setFullYear(today.getFullYear() + 1));
  
  return (
    <div className="id-card-container">
      <div className="id-card-wrapper" ref={idCardRef}>
        <div className="id-card">
          {/* Front side of ID Card */}
          <div className="id-card-front">
            <div className="id-card-header">
              <h2>STUDENT IDENTITY CARD</h2>
              <p className="id-card-session">SESSION: {today.getFullYear()}-{today.getFullYear() + 1}</p>
            </div>
            
            <div className="id-card-body">
              <div className="id-card-photo">
                {studentData.photo ? (
                  <img 
                    src={URL.createObjectURL(studentData.photo)} 
                    alt="Student" 
                    className="student-photo"
                  />
                ) : (
                  <div className="photo-placeholder">No Photo</div>
                )}
              </div>
              
              <div className="id-card-details">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{studentData.fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Class:</span>
                  <span className="detail-value">{studentData.grade} {studentData.section}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Guardian:</span>
                  <span className="detail-value">{studentData.guardianName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Contact:</span>
                  <span className="detail-value">{studentData.guardianMobile}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value address-value">{studentData.address}</span>
                </div>
              </div>
            </div>
            
            <div className="id-card-footer">
              <div className="id-card-validity">
                <div className="validity-label">Valid Till:</div>
                <div className="validity-value">{formatDate(expiryDate)}</div>
              </div>
              <div className="id-card-signature">
                <div className="signature-line"></div>
                <div className="signature-text">Principal's Signature</div>
              </div>
            </div>
          </div>
          
          {/* Back side of ID Card */}
          <div className="id-card-back">
            <div className="id-card-header">
              <h2>STUDENT INFORMATION</h2>
            </div>
            
            <div className="id-card-body">
              <div className="back-instructions">
                <h3>INSTRUCTIONS:</h3>
                <ol>
                  <li>This card must be carried by the student at all times.</li>
                  <li>If found, please return to the school office.</li>
                  <li>This card is non-transferable.</li>
                  <li>In case of loss, report immediately to the office.</li>
                </ol>
              </div>
              
              <div className="emergency-contact">
                <h3>EMERGENCY CONTACT</h3>
                <p>Guardian: {studentData.guardianName}</p>
                <p>Mobile: {studentData.guardianMobile}</p>
              </div>
            </div>
            
            <div className="id-card-footer">
              <p className="disclaimer">This card is the property of the school and must be surrendered upon request.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="id-card-actions">
        {!downloadClicked && (
          <button className="back-button" onClick={onBack}>
            Back to Form
          </button>
        )}
        <button className="download-button" onClick={handleDownload}>
          Download ID Card
        </button>
      </div>
    </div>
  );
};

export default IDCard; 
import jsPDF from 'jspdf';
import '../styles/Receipt.css';

const Receipt = {
  generateReceipt: (studentDetails, paymentData) => {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `Payment Receipt - ${studentDetails.name}`,
      subject: 'School Fee Payment Receipt',
      author: 'School Admin Panel',
      creator: 'School Admin Panel'
    });

    // Add school logo/header
    doc.setFontSize(22);
    doc.setTextColor(74, 111, 220); // Primary color
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOOL PAYMENT RECEIPT', 105, 20, { align: 'center' });

    // Add receipt border
    doc.setDrawColor(74, 111, 220);
    doc.setLineWidth(0.5);
    doc.rect(15, 30, 180, 100);
    
    // Add receipt number and date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${studentDetails.id}-${paymentData.id}`, 20, 40);
    doc.text(`Date: ${paymentData.date}`, 170, 40, { align: 'right' });
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(15, 45, 195, 45);
    
    // Add student details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Details', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${studentDetails.name}`, 25, 65);
    doc.text(`Grade: ${studentDetails.grade}${studentDetails.section ? ' - ' + studentDetails.section : ''}`, 25, 75);
    
    if (studentDetails.fatherName) {
      doc.text(`Parent/Guardian: ${studentDetails.fatherName}`, 25, 85);
    }
    
    // Add payment details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 20, 100);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Fee Amount: Rs. ${paymentData.amount}`, 25, 110);
    doc.text(`Payment Status: ${paymentData.status}`, 25, 120);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer generated receipt and does not require a signature.', 105, 140, { align: 'center' });
    
    // Add thank you note
    doc.setFontSize(11);
    doc.setTextColor(74, 111, 220);
    doc.text('Thank you for your payment!', 105, 150, { align: 'center' });
    
    // Save PDF with filename
    const filename = `Receipt_${studentDetails.name.replace(/\s+/g, '_')}_${paymentData.id}.pdf`;
    doc.save(filename);
    
    return true;
  }
};

export default Receipt; 
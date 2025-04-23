import React, { useState } from 'react';
import '../styles/PaymentTable.css';
import Receipt from './Receipt';

const PaymentTable = ({ isOpen, onClose, studentId, studentName, studentGrade, studentSection, studentFatherName }) => {
  // Initialize payment data with 10 rows
  const [paymentData, setPaymentData] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      amount: '',
      status: 'Due',
      date: '',
      showRs: false,
      receiptGenerated: false
    }))
  );

  if (!isOpen) return null;

  const handleAmountChange = (id, value) => {
    // Check if receipt has been generated for this payment
    const payment = paymentData.find(item => item.id === id);
    if (payment.receiptGenerated) return;

    // Allow only numbers and decimal point
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setPaymentData(paymentData.map(item => 
        item.id === id 
          ? { 
              ...item, 
              amount: value,
              // Reset status to Due if user types in amount field
              status: item.amount !== value && item.status === 'Paid' ? 'Due' : item.status,
              date: item.amount !== value && item.status === 'Paid' ? '' : item.date
            } 
          : item
      ));
    }
  };

  const handleStatusToggle = (id) => {
    // Check if receipt has been generated for this payment
    const payment = paymentData.find(item => item.id === id);
    if (payment.receiptGenerated) return;

    setPaymentData(paymentData.map(item => 
      item.id === id && item.status === 'Due'
        ? { ...item, status: 'Paid', date: new Date().toLocaleDateString() }
        : item
    ));
  };

  const handleFocus = (id) => {
    // Check if receipt has been generated for this payment
    const payment = paymentData.find(item => item.id === id);
    if (payment.receiptGenerated) return;
    
    setPaymentData(paymentData.map(item => 
      item.id === id ? { ...item, showRs: true } : item
    ));
  };

  const handleBlur = (id) => {
    // Check if receipt has been generated for this payment
    const payment = paymentData.find(item => item.id === id);
    if (payment.receiptGenerated) return;
    
    if (!paymentData.find(item => item.id === id).amount) {
      setPaymentData(paymentData.map(item => 
        item.id === id ? { ...item, showRs: false } : item
      ));
    }
  };

  const generateReceipt = (id) => {
    const payment = paymentData.find(item => item.id === id);
    if (payment.status === 'Paid' && payment.amount) {
      // Prepare student details for receipt
      const studentDetails = {
        id: studentId,
        name: studentName,
        grade: studentGrade || 'N/A',
        section: studentSection || 'N/A',
        fatherName: studentFatherName
      };

      // Generate the receipt PDF
      const success = Receipt.generateReceipt(studentDetails, payment);
      
      if (success) {
        // Mark as receipt generated - this will make the amount field read-only
        setPaymentData(paymentData.map(item => 
          item.id === id ? { ...item, receiptGenerated: true } : item
        ));
      }
    } else {
      alert('Cannot generate receipt for unpaid fees');
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Payment Details: {studentName}</h2>
          <button className="payment-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="payment-table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment) => (
                <tr key={payment.id} className={payment.receiptGenerated ? 'payment-row-locked' : ''}>
                  <td>{payment.id}</td>
                  <td className="payment-amount-cell">
                    <div className="payment-amount-input-container">
                      {(payment.showRs || payment.amount) && <span className="payment-rs-prefix">Rs.</span>}
                      <input
                        type="text"
                        className={`payment-amount-input ${payment.receiptGenerated ? 'payment-input-locked' : ''}`}
                        value={payment.amount}
                        onChange={(e) => handleAmountChange(payment.id, e.target.value)}
                        onFocus={() => handleFocus(payment.id)}
                        onBlur={() => handleBlur(payment.id)}
                        placeholder="Amount"
                        readOnly={payment.receiptGenerated}
                      />
                    </div>
                  </td>
                  <td>
                    <button
                      className={`payment-status-toggle ${payment.status.toLowerCase()}`}
                      onClick={() => handleStatusToggle(payment.id)}
                      disabled={payment.status === 'Paid' || payment.receiptGenerated}
                    >
                      {payment.status}
                    </button>
                  </td>
                  <td>{payment.date}</td>
                  <td>
                    <button
                      className={`payment-receipt-btn ${payment.receiptGenerated ? 'receipt-generated' : ''}`}
                      onClick={() => generateReceipt(payment.id)}
                      disabled={payment.status !== 'Paid' || payment.receiptGenerated}
                    >
                      {payment.receiptGenerated ? 'Receipt Generated' : 'Generate Receipt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable; 
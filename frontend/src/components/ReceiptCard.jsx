import React from 'react';
import '../styles/ReceiptCard.css';

function ReceiptCard({ receipt }) {
  return (
    <div className="receipt-card">
      <div className="receipt-header">
        <span className="bank-badge">{receipt.bank.toUpperCase()}</span>
        <span className="receipt-id">#{receipt.id}</span>
      </div>

      <div className="receipt-body">
        <div className="receipt-row">
          <span className="label">Amount:</span>
          <span className="value">{receipt.amount} ETB</span>
        </div>
        <div className="receipt-row">
          <span className="label">Sender:</span>
          <span className="value">{receipt.sender}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Receiver:</span>
          <span className="value">{receipt.receiver}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Reference:</span>
          <span className="value">{receipt.reference}</span>
        </div>
        <div className="receipt-row">
          <span className="label">Date:</span>
          <span className="value">{new Date(receipt.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default ReceiptCard;

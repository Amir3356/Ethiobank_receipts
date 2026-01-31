import React, { useState } from 'react';
import ReceiptForm from '../components/ReceiptForm.jsx';
import ReceiptCard from '../components/ReceiptCard.jsx';
import { extractReceipt } from '../services/api.js';
import '../styles/Extract.css';

function Extract() {
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  const handleExtract = async (payload) => {
    try {
      setError('');
      setReceipt(null);
      const data = await extractReceipt(payload);
      setReceipt(data);
    } catch (err) {
      setError(err.message || 'Failed to extract receipt');
    }
  };

  return (
    <div className="extract">
      <h1>Extract Receipt</h1>
      <p>Select a bank and enter the receipt URL (or ID for Telebirr) to extract data</p>

      <ReceiptForm onSubmit={handleExtract} />

      {receipt && <ReceiptCard receipt={receipt} />}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Extract;

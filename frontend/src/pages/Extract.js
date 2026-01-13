import React, { useState } from 'react';
import ReceiptForm from '../components/ReceiptForm';
import ReceiptCard from '../components/ReceiptCard';
import { extractReceipt } from '../services/api';
import '../styles/Extract.css';

function Extract() {
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  const handleExtract = async ({ bank, url }) => {
    try {
      setError('');
      const data = await extractReceipt(bank, url);
      setReceipt(data);
    } catch (err) {
      setError(err.message || 'Failed to extract receipt');
      setReceipt(null);
    }
  };

  return (
    <div className="extract">
      <h1>Extract Receipt</h1>
      <p>Select a bank and enter the receipt URL to extract data</p>

      <ReceiptForm onSubmit={handleExtract} />

      {error && <div className="error-message">{error}</div>}

      {receipt && (
        <div className="result">
          <h2>Extracted Data</h2>
          <ReceiptCard receipt={receipt} />
        </div>
      )}
    </div>
  );
}

export default Extract;

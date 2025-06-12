import React, { useState } from 'react';
import ReceiptForm from '../components/ReceiptForm.jsx';
import { extractReceipt } from '../services/api.js';
import '../styles/Extract.css';

function Extract() {
  const [error, setError] = useState('');

  const handleExtract = async ({ bank, url }) => {
    try {
      setError('');
      await extractReceipt(bank, url);
    } catch (err) {
      setError(err.message || 'Failed to extract receipt');
    }
  };

  return (
    <div className="extract">
      <h1>Extract Receipt</h1>
      <p>Select a bank and enter the receipt URL to extract data</p>

      <ReceiptForm onSubmit={handleExtract} />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Extract;

import React, { useState } from 'react';
import '../styles/ReceiptForm.css';

function ReceiptForm({ onSubmit }) {
  const [bank, setBank] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const banks = [
    { code: 'cbe', name: 'Commercial Bank of Ethiopia' },
    { code: 'dashen', name: 'Dashen Bank' },
    { code: 'awash', name: 'Awash Bank' },
    { code: 'boa', name: 'Bank of Abyssinia' },
    { code: 'zemen', name: 'Zemen Bank' },
    { code: 'tele', name: 'Telebirr' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ bank, url });
    setLoading(false);
  };

  return (
    <form className="receipt-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="bank">Select Bank</label>
        <select
          id="bank"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          required
        >
          <option value="">Choose a bank</option>
          {banks.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="url">Receipt URL</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/receipt.png"
          required
        />
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Receipt'}
      </button>
    </form>
  );
}

export default ReceiptForm;

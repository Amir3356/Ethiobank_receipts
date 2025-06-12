import React, { useState } from 'react';
import '../styles/ReceiptForm.css';

function ReceiptForm({ onSubmit }) {
  const [bank, setBank] = useState('');
  const [url, setUrl] = useState('');
  const [ftNumber, setFtNumber] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  const banks = [
    { code: 'cbe', name: 'Commercial Bank of Ethiopia' },
    { code: 'dashen', name: 'Dashen Bank' },
    { code: 'awash', name: 'Awash Bank' },
    { code: 'boa', name: 'Bank of Abyssinia' },
    { code: 'zemen', name: 'Zemen Bank' },
    { code: 'tele', name: 'Telebirr' }
  ];

  const isAuto = bank === 'auto';
  const isCbe = bank === 'cbe';
  const isTele = bank === 'tele';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = isCbe
      ? { bank, reference: ftNumber, account }
      : isAuto
        ? { bank: 'auto', url }
        : isTele
          ? { bank, reference: url }
          : { bank, url };
    await onSubmit(payload);
    setLoading(false);
  };

  const handleBankChange = (e) => {
    setBank(e.target.value);
    setUrl('');
    setFtNumber('');
    setAccount('');
  };

  return (
    <form className="receipt-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="bank">Select Bank</label>
        <select
          id="bank"
          value={bank}
          onChange={handleBankChange}
          required
        >
          <option value="">Choose a bank</option>
          <option value="auto">Auto Detect</option>
          {banks.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {isCbe ? (
        <>
          <div className="form-group">
            <label htmlFor="ftNumber">FT Number</label>
            <input
              type="text"
              id="ftNumber"
              value={ftNumber}
              onChange={(e) => setFtNumber(e.target.value)}
              placeholder="e.g. FT25211G11JQ"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="account">Account Number (last 8+ digits)</label>
            <input
              type="text"
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="e.g. 21827223"
              required
            />
          </div>
        </>
      ) : (
        <div className="form-group">
          <label htmlFor="url">
            {isAuto ? 'Receipt URL' : isTele ? 'Receipt URL or ID' : 'Receipt URL'}
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={
              isAuto
                ? 'https://apps.cbe.com.et/... or https://transactioninfo.ethiotelecom.et/...'
                : isTele
                  ? 'https://... or receipt ID'
                  : 'https://example.com/receipt.png'
            }
            required
          />
        </div>
      )}

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Receipt'}
      </button>
    </form>
  );
}

export default ReceiptForm;

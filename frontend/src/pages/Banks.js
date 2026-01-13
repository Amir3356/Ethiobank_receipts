import React, { useState, useEffect } from 'react';
import { getSupportedBanks } from '../services/api';
import '../styles/Banks.css';

function Banks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await getSupportedBanks();
        setBanks(data);
      } catch (err) {
        console.error('Failed to fetch banks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const bankInfo = {
    cbe: { name: 'Commercial Bank of Ethiopia', color: '#0066b3' },
    dashen: { name: 'Dashen Bank', color: '#e63946' },
    awash: { name: 'Awash Bank', color: '#2a9d8f' },
    boa: { name: 'Bank of Abyssinia', color: '#e9c46a' },
    zemen: { name: 'Zemen Bank', color: '#f4a261' },
    tele: { name: 'Telebirr', color: '#264653' }
  };

  if (loading) {
    return <div className="loading">Loading banks...</div>;
  }

  return (
    <div className="banks">
      <h1>Supported Banks</h1>
      <div className="banks-grid">
        {banks.map((bankCode) => (
          <div
            key={bankCode}
            className="bank-card"
            style={{ borderColor: bankInfo[bankCode]?.color || '#ccc' }}
          >
            <h3 style={{ color: bankInfo[bankCode]?.color || '#333' }}>
              {bankInfo[bankCode]?.name || bankCode}
            </h3>
            <span className="bank-code">{bankCode.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banks;

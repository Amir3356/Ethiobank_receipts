import React from 'react';
import '../styles/ReceiptCard.css';

const LABEL_MAP = {
  customer_name: 'Customer Name',
  branch: 'Branch',
  region_city: 'Region / City',
  payment_date: 'Payment Date',
  reference_no: 'Reference No',
  payer: 'Payer',
  payer_account: 'Payer Account',
  receiver: 'Receiver',
  receiver_account: 'Receiver Account',
  service: 'Service',
  transferred_amount: 'Transferred Amount',
  commission: 'Commission',
  vat_on_commission: 'VAT on Commission',
  total_debited: 'Total Debited',
  amount_in_words: 'Amount in Words',
  sender_name: 'Sender Name',
  beneficiary_name: 'Beneficiary Name',
  beneficiary_account: 'Beneficiary Account',
  beneficiary_bank: 'Beneficiary Bank',
  transfer_reference: 'Transfer Reference',
  transaction_reference: 'Transaction Reference',
  transaction_date: 'Transaction Date',
  narrative: 'Narrative',
  source_account: 'Source Account',
  source_account_name: 'Source Account Name',
  receivers_account: "Receiver's Account",
  receivers_name: "Receiver's Name",
  total_amount: 'Total Amount',
  invoice_no: 'Invoice No',
  payer_name: 'Payer Name',
  payer_no: 'Payer No',
  recipient_name: 'Recipient Name',
  recipient_account: 'Recipient Account',
  settled_amount: 'Settled Amount',
  total_paid: 'Total Paid',
  credited_party: 'Credited Party',
  credited_party_number: 'Credited Party Number',
  payer_number: 'Payer Number',
  status: 'Status',
  currency: 'Currency',
  date: 'Date',
  reference: 'Reference',
  amount: 'Amount',
  channel: 'Channel',
  service_type: 'Service Type',
  'Transaction Time': 'Transaction Time',
  'Transaction Type': 'Transaction Type',
  Charge: 'Charge',
  VAT: 'VAT',
  'Sender Name': 'Sender Name',
  'Sender Account': 'Sender Account',
  'Beneficiary name': 'Beneficiary Name',
  'Beneficiary Account': 'Beneficiary Account',
  'Beneficiary Bank': 'Beneficiary Bank',
  Reason: 'Reason',
  'Transaction ID': 'Transaction ID',
  'Source Account': 'Source Account',
  'Source Account Name': 'Source Account Name',
  "Receiver's Account": "Receiver's Account",
  "Receiver's Name": "Receiver's Name",
  'Transferred Amount': 'Transferred Amount',
  'Service Charge': 'Service Charge',
  'Total Amount': 'Total Amount',
  'Transaction Date': 'Transaction Date',
  'Transaction Reference': 'Transaction Reference',
  'Invoice No': 'Invoice No',
  'Payer Name': 'Payer Name',
  'Payer Account No': 'Payer Account No',
  'Recipient Name': 'Recipient Name',
  'Recipient Account No': 'Recipient Account No',
  'Reference No': 'Reference No',
  'Transaction Status': 'Transaction Status',
  'Transaction Detail': 'Transaction Detail',
  'Settled Amount': 'Settled Amount',
  'Total Amount Paid': 'Total Amount Paid',
  'Amount in Words': 'Amount in Words',
};

const FIELD_ORDER = {
  cbe: [
    'payer_name',
    'payer_account',
    'receiver_name',
    'receiver_account',
    'amount',
    'currency',
    'date',
    'reference',
    'status',
  ],
  dashen: [
    'payer_name',
    'receiver_name',
    'receiver_account',
    'amount',
    'currency',
    'date',
    'reference',
    'status',
  ],
  awash: [
    'payer_name',
    'payer_account',
    'receiver_name',
    'receiver_account',
    'amount',
    'currency',
    'date',
    'reference',
    'status',
  ],
  boa: [
    'payer_name',
    'payer_account',
    'receiver_name',
    'receiver_account',
    'amount',
    'currency',
    'date',
    'reference',
    'status',
  ],
  zemen: [
    'payer_name',
    'payer_account',
    'receiver_name',
    'receiver_account',
    'amount',
    'currency',
    'date',
    'reference',
    'status',
  ],
  tele: [
    'payer_name',
    'payer_account',
    'receiver_name',
    'receiver_account',
    'amount',
    'currency',
    'status',
  ],
};

const IGNORE_KEYS = new Set(['bank']);

function formatValue(key, value) {
  if (value === null || value === undefined) return '-';
  if (key === 'payment_date' || key === 'date' || key === 'transaction_date' || key === 'Transaction Date' || key === 'Transaction Time') {
    try {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch {}
  }
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}

function ReceiptCard({ receipt }) {
  const bank = receipt?.bank;
  const order = FIELD_ORDER[bank] || Object.keys(receipt);

  const entryMap = {};
  for (const [k, v] of Object.entries(receipt)) {
    if (!IGNORE_KEYS.has(k) && v !== null && v !== undefined && v !== '') {
      entryMap[k] = v;
    }
  }

  const entries = order.filter((k) => k in entryMap).map((k) => [k, entryMap[k]]);

  return (
    <div className="receipt-card">
      <div className="receipt-header">
        <span className="bank-badge">{bank?.toUpperCase() || 'UNKNOWN'}</span>
      </div>

      <div className="receipt-body">
        {entries.map(([key, value]) => (
          <div className="receipt-row" key={key}>
            <span className="label">{LABEL_MAP[key] || key}:</span>
            <span className="value">{formatValue(key, value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReceiptCard;

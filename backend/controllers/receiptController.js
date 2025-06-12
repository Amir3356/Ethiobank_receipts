import { validationResult } from 'express-validator';
import { getExtractor, getSupportedBanksList, cbe } from '../services/extractors.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { detectBankFromUrl } = require('../../js/extractors/detect');

const SUPPORTED_BANKS = ['cbe', 'dashen', 'awash', 'boa', 'zemen', 'tele', 'mpesa', 'cbe_birr'];

function normalizeReceipt(bankCode, raw) {
  const base = { payer_name: null, payer_account: null, receiver_name: null, receiver_account: null, amount: null, currency: 'ETB', date: null, reference: null, status: 'SUCCESS' };
  if (!raw) return base;
  switch (bankCode) {
    case 'cbe':
      return { ...base, payer_name: raw.payer, payer_account: raw.payer_account, receiver_name: raw.receiver, receiver_account: raw.receiver_account, amount: raw.transferred_amount ? parseFloat(raw.transferred_amount.replace(/,/g, '')) : null, date: raw.payment_date, reference: raw.reference_no };
    case 'dashen':
      return { ...base, payer_name: raw.sender_name, receiver_name: raw.beneficiary_name, receiver_account: raw.beneficiary_account, amount: raw.amount ? parseFloat(raw.amount.replace(/,/g, '')) : null, date: raw.transaction_date, reference: raw.transfer_reference || raw.transaction_reference };
    case 'awash':
      return { ...base, payer_name: raw['Sender Name'], payer_account: raw['Sender Account'], receiver_name: raw['Beneficiary name'], receiver_account: raw['Beneficiary Account'], amount: raw['Amount'] ? parseFloat(raw['Amount'].replace(/,/g, '')) : null, date: raw['Transaction Time'], reference: raw['Transaction ID'] };
    case 'boa':
      return { ...base, payer_name: raw['Source Account Name'], payer_account: raw['Source Account'], receiver_name: raw["Receiver's Name"], receiver_account: raw["Receiver's Account"], amount: raw['Transferred Amount'] ? parseFloat(raw['Transferred Amount'].replace(/,/g, '')) : null, date: raw['Transaction Date'], reference: raw['Transaction Reference'] };
    case 'zemen':
      return { ...base, payer_name: raw['Payer Name'], payer_account: raw['Payer Account No'], receiver_name: raw['Recipient Name'], receiver_account: raw['Recipient Account No'], amount: raw['Settled Amount'] ? parseFloat(raw['Settled Amount'].replace(/,/g, '')) : null, date: raw['Date'], reference: raw['Reference No'] || raw['Invoice No'], status: raw['Transaction Status'] || 'SUCCESS' };
    case 'tele':
      return { ...base, payer_name: raw.payer_name, payer_account: raw.payer_number, receiver_name: raw.credited_party, receiver_account: raw.credited_party_number, amount: raw.total_paid ? parseFloat(raw.total_paid.replace(/,/g, '')) : null, status: raw.status || 'SUCCESS' };
    default:
      return { ...base, ...raw };
  }
}

export const extractReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bank, url, reference, account, phone } = req.body;
    let bankCode = bank.toLowerCase();

    if (bankCode === 'auto') {
      const input = url || reference;
      bankCode = input ? detectBankFromUrl(input) : null;
      if (!bankCode) {
        return res.status(400).json({ error: 'Could not auto-detect bank from URL. Please specify the bank manually.' });
      }
    }

    let data;

    if (bankCode === 'cbe' && reference && account) {
      data = await cbe.extractCbeReceiptInfoFromFt(reference, account);
    } else if (bankCode === 'mpesa') {
      data = { message: 'M-Pesa verification - receipt reference received', reference };
    } else if (bankCode === 'cbe_birr') {
      data = { message: 'CBE Birr verification - receipt and phone received', reference, phone };
    } else {
      const extractor = getExtractor(bankCode);
      if (!extractor) {
        return res.status(400).json({ error: `Unsupported bank. Supported: ${SUPPORTED_BANKS.join(', ')}` });
      }
      const input = bankCode === 'tele' ? (reference || url) : url;
      data = await extractor(input);
    }

    const normalized = normalizeReceipt(bankCode, data);

    res.status(200).json({
      success: true,
      data: {
        bank: bankCode,
        ...normalized
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSupportedBanks = (req, res) => {
  res.status(200).json({
    success: true,
    data: SUPPORTED_BANKS
  });
};

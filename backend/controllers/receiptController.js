import { validationResult } from 'express-validator';
import { getExtractor, getSupportedBanksList, cbe } from '../services/extractors.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { detectBankFromUrl } = require('../../js/extractors/detect');

const SUPPORTED_BANKS = ['cbe', 'dashen', 'awash', 'boa', 'zemen', 'tele', 'mpesa', 'cbe_birr'];

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

    res.status(200).json({
      success: true,
      data: {
        bank: bankCode,
        ...data
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

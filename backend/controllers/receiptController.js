import { validationResult } from 'express-validator';
import Receipt from '../models/Receipt.js';

const SUPPORTED_BANKS = ['cbe', 'dashen', 'awash', 'boa', 'zemen', 'tele'];

export const extractReceipt = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bank, url } = req.body;

    if (!SUPPORTED_BANKS.includes(bank.toLowerCase())) {
      return res.status(400).json({ error: `Unsupported bank. Supported: ${SUPPORTED_BANKS.join(', ')}` });
    }

    const receiptData = {
      id: Date.now(),
      bank: bank.toLowerCase(),
      url,
      amount: 0,
      sender: 'Sample Sender',
      receiver: 'Sample Receiver',
      reference: `REF-${Date.now()}`,
      date: new Date()
    };

    const receipt = new Receipt(receiptData);

    res.status(200).json({
      success: true,
      data: receipt.toJSON()
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

export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = new Receipt({
      id: parseInt(id),
      bank: 'cbe',
      amount: 1000,
      sender: 'John Doe',
      receiver: 'Jane Doe',
      reference: 'REF-123456'
    });

    res.status(200).json({
      success: true,
      data: receipt.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

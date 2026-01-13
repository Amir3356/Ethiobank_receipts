import { Router } from 'express';
import { body } from 'express-validator';
import { extractReceipt, getSupportedBanks, getReceiptById } from '../controllers/receiptController.js';

const router = Router();

router.get('/banks', getSupportedBanks);

router.post(
  '/extract',
  [
    body('bank').notEmpty().withMessage('Bank is required'),
    body('url').isURL().withMessage('Valid URL is required')
  ],
  extractReceipt
);

router.get('/:id', getReceiptById);

export default router;

import { Router } from 'express';
import { body, oneOf } from 'express-validator';
import { extractReceipt, getSupportedBanks } from '../controllers/receiptController.js';

const router = Router();

router.get('/banks', getSupportedBanks);

router.post(
  '/extract',
  [
    body('bank')
      .notEmpty()
      .withMessage('Bank is required')
      .isIn(['cbe', 'dashen', 'awash', 'boa', 'zemen', 'tele', 'mpesa', 'cbe_birr'])
      .withMessage('Invalid bank'),
    oneOf([
      body('url').isURL().withMessage('Valid URL is required'),
      body('reference').notEmpty().withMessage('Reference is required when no URL'),
    ], 'Either URL or reference is required'),
    body('account').optional(),
    body('phone').optional(),
  ],
  extractReceipt
);

export default router;

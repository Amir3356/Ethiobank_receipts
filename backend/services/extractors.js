import { extractCbeReceiptInfo } from '../extractors/cbe.js';
import { extractDashenReceiptData } from '../extractors/dashen.js';
import { extractAwashReceiptData } from '../extractors/awash.js';
import { extractBoaReceiptData } from '../extractors/boa.js';
import { extractZemenReceiptData } from '../extractors/zemen.js';
import { extractTeleReceiptData } from '../extractors/tele.js';

const EXTRACTORS = {
  cbe: extractCbeReceiptInfo,
  dashen: extractDashenReceiptData,
  awash: extractAwashReceiptData,
  boa: extractBoaReceiptData,
  zemen: extractZemenReceiptData,
  tele: extractTeleReceiptData,
};

export function getExtractor(bank) {
  return EXTRACTORS[bank.toLowerCase()] || null;
}

export { extractCbeReceiptInfo as cbe, extractDashenReceiptData as dashen, extractAwashReceiptData as awash, extractBoaReceiptData as boa, extractZemenReceiptData as zemen, extractTeleReceiptData as tele };

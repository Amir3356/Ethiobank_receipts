import { extractCbeReceiptInfo } from './extractors/cbe.js';
import { extractDashenReceiptData } from './extractors/dashen.js';
import { extractAwashReceiptData } from './extractors/awash.js';
import { extractBoaReceiptData } from './extractors/boa.js';
import { extractZemenReceiptData } from './extractors/zemen.js';
import { extractTeleReceiptData } from './extractors/tele.js';
import { detectBankFromUrl } from './extractors/detect.js';

const EXTRACTORS = {
  cbe: extractCbeReceiptInfo,
  dashen: extractDashenReceiptData,
  awash: extractAwashReceiptData,
  boa: extractBoaReceiptData,
  zemen: extractZemenReceiptData,
  tele: extractTeleReceiptData,
};

export async function extractReceipt(bank, url) {
  bank = bank.toLowerCase();
  if (bank === 'auto') {
    bank = detectBankFromUrl(url);
    if (!bank) {
      throw new Error(
        'Could not auto-detect bank from URL. Please specify the bank manually.'
      );
    }
  }
  if (!(bank in EXTRACTORS)) {
    throw new Error(`Unsupported bank: ${bank}`);
  }
  return EXTRACTORS[bank](url);
}

export { EXTRACTORS, detectBankFromUrl };
export { extractCbeReceiptInfo as cbe } from './extractors/cbe.js';
export { extractDashenReceiptData as dashen } from './extractors/dashen.js';
export { extractAwashReceiptData as awash } from './extractors/awash.js';
export { extractBoaReceiptData as boa } from './extractors/boa.js';
export { extractZemenReceiptData as zemen } from './extractors/zemen.js';
export { extractTeleReceiptData as tele } from './extractors/tele.js';

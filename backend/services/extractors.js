import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const cbe = require('../../js/extractors/cbe');
const dashen = require('../../js/extractors/dashen');
const awash = require('../../js/extractors/awash');
const boa = require('../../js/extractors/boa');
const zemen = require('../../js/extractors/zemen');
const tele = require('../../js/extractors/tele');

const EXTRACTORS = {
  cbe: cbe.extractCbeReceiptInfo,
  dashen: dashen.extractDashenReceiptData,
  awash: awash.extractAwashReceiptData,
  boa: boa.extractBoaReceiptData,
  zemen: zemen.extractZemenReceiptData,
  tele: tele.extractTeleReceiptData,
};

export function getExtractor(bank) {
  return EXTRACTORS[bank.toLowerCase()] || null;
}

export function getSupportedBanksList() {
  return Object.keys(EXTRACTORS);
}

export { cbe, dashen, awash, boa, zemen, tele };

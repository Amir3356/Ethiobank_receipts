import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const cbe = require('../extractors/cbe');
const dashen = require('../extractors/dashen');
const awash = require('../extractors/awash');
const boa = require('../extractors/boa');
const zemen = require('../extractors/zemen');
const tele = require('../extractors/tele');

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

export { cbe, dashen, awash, boa, zemen, tele };

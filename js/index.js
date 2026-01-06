const cbe = require("./extractors/cbe");
const dashen = require("./extractors/dashen");
const awash = require("./extractors/awash");
const boa = require("./extractors/boa");
const zemen = require("./extractors/zemen");
const tele = require("./extractors/tele");

const EXTRACTORS = {
  cbe: cbe.extractCbeReceiptInfo,
  dashen: dashen.extractDashenReceiptData,
  awash: awash.extractAwashReceiptData,
  boa: boa.extractBoaReceiptData,
  zemen: zemen.extractZemenReceiptData,
  tele: tele.extractTeleReceiptData,
};

async function extractReceipt(bank, url) {
  bank = bank.toLowerCase();
  if (!(bank in EXTRACTORS)) {
    throw new Error(`Unsupported bank: ${bank}`);
  }
  return EXTRACTORS[bank](url);
}

module.exports = { extractReceipt, EXTRACTORS, cbe, dashen, awash, boa, zemen, tele };

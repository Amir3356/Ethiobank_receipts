const DOMAIN_MAP = [
  { domain: 'apps.cbe.com.et', bank: 'cbe' },
  { domain: 'transactioninfo.ethiotelecom.et', bank: 'tele' },
];

function detectBankFromUrl(url) {
  if (!url) return null;
  for (const { domain, bank } of DOMAIN_MAP) {
    if (url.includes(domain)) return bank;
  }
  return null;
}

module.exports = { detectBankFromUrl };

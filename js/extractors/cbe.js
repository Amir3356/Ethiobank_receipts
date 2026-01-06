const pdfParse = require("pdf-parse");
const fs = require("fs");
const { downloadPdfFromUrl } = require("../download");

async function extractCbeReceiptInfo(url) {
  const pdfPath = await downloadPdfFromUrl(url);
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  const fullText = data.text;

  const patterns = {
    customer_name: /Customer Name:\s*(.+)/,
    branch: /Branch:\s*(.+)/,
    region_city: /Region:\s*(.*?)\n/,
    payment_date: /Payment Date & Time\s*([\d/:,\sAPMapm]+)/,
    reference_no: /Reference No.*?([A-Z0-9]+)/,
    payer: /Payer\s+([A-Z\s]+)/,
    payer_account: /Payer\s+[A-Z\s]+\nAccount\s+([\d*]+)/,
    receiver: /Receiver\s+([A-Z\s]+)/,
    receiver_account: /Receiver\s+[A-Z\s]+\nAccount\s+([\d*]+)/,
    service: /Reason \/ Type of service\s+(.+)/,
    transferred_amount: /Transferred Amount\s+([\d,.]+) ETB/,
    commission: /Commission or Service Charge\s+([\d,.]+) ETB/,
    vat_on_commission: /15% VAT on Commission\s+([\d,.]+) ETB/,
    total_debited:
      /Total amount debited from customers account\s+([\d,.]+) ETB/,
    amount_in_words: /Amount in Word ETB\s+(.+)/,
  };

  const result = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = fullText.match(pattern);
    result[key] = match ? match[1].trim() : null;
  }

  if (result.payment_date) {
    try {
      const date = new Date(result.payment_date);
      if (!isNaN(date.getTime())) {
        result.payment_date = date.toISOString();
      }
    } catch {
      // keep original string
    }
  }

  return result;
}

function extractCbeReceiptInfoFromFt(ftNumber, accountLast8OrFull) {
  const ft = (ftNumber || "").replace(/\s+/g, "").toUpperCase();
  const digits = (accountLast8OrFull || "").replace(/\D/g, "");
  if (digits.length < 8) {
    throw new Error("Account number must contain at least 8 digits");
  }
  const last8 = digits.slice(-8);
  const url = `https://apps.cbe.com.et:100/?id=${ft}${last8}`;
  return extractCbeReceiptInfo(url);
}

module.exports = { extractCbeReceiptInfo, extractCbeReceiptInfoFromFt };

import { PDFParse as pdfParse } from 'pdf-parse';
import fs from 'fs';
import { downloadPdfFromUrl } from '../download.js';

export async function extractCbeReceiptInfo(url) {
  const pdfPath = await downloadPdfFromUrl(url);
  const buffer = fs.readFileSync(pdfPath);
  const parser = new pdfParse({ data: buffer });
  const textResult = await parser.getText();
  const fullText = textResult.text;

  const patterns = {
    customer_name: /Customer Name[:\s]*([A-Za-z\s.]+)/,
    branch: /Branch[:\s]*([A-Za-z\s.]+)/,
    region_city: /Region[:\s]*([A-Za-z\s.]+)/,
    payment_date: /Payment Date\s*(?:&|and)?\s*Time[:\s]*([\d\/,:APMapm\s]+)/i,
    reference_no: /Reference\s*No[:\s]*(FT[A-Z0-9]+)/i,
    payer: /Payer[:\s]*([A-Za-z\s.]+?)(?=\s*\nAccount|\s*$)/m,
    payer_account: /Payer[:\s]*[A-Za-z\s.]+?[:\s]*\n?Account[:\s]*([\d*]+)/,
    receiver: /Receiver[:\s]*([A-Za-z\s.]+?)(?=\s*\nAccount|\s*$)/m,
    receiver_account: /Receiver[:\s]*[A-Za-z\s.]+?[:\s]*\n?Account[:\s]*([\d*]+)/,
    service: /Reason\s*\/?\s*Type of service[:\s]*([A-Za-z\s]+)/i,
    transferred_amount: /Transferred Amount[:\s]*([\d,.]+)\s*ETB/i,
    commission: /Commission or Service Charge[:\s]*([\d,.]+)\s*ETB/i,
    vat_on_commission: /15%\s*VAT on Commission[:\s]*([\d,.]+)\s*ETB/i,
    total_debited: /Total amount debited from customers account[:\s]*([\d,.]+)\s*ETB/i,
    amount_in_words: /Amount in Word\s*ETB[:\s]*([A-Za-z\s\/\d\-]+)/i,
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

export function extractCbeReceiptInfoFromFt(ftNumber, accountLast8OrFull) {
  const ft = (ftNumber || '').replace(/\s+/g, '').toUpperCase();
  const digits = (accountLast8OrFull || '').replace(/\D/g, '');
  if (digits.length < 8) {
    throw new Error('Account number must contain at least 8 digits');
  }
  const last8 = digits.slice(-8);
  const url = `https://apps.cbe.com.et:100/?id=${ft}${last8}`;
  return extractCbeReceiptInfo(url);
}

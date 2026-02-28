import { PDFParse as pdfParse } from 'pdf-parse';
import fs from 'fs';
import { downloadPdfFromUrl } from '../download.js';

export async function extractDashenReceiptData(url) {
  const pdfPath = await downloadPdfFromUrl(url);
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  const text = data.text;

  const patterns = {
    sender_name: /Account Holder Name:\s*(.+?)\n/,
    channel: /Transaction Channel:\s*(.+?)\n/,
    service_type: /Service Type:\s*(.+?)\n/,
    narrative: /Narrative:\s*(.+?)\n/,
    beneficiary_name: /Account Holder Name:\s*(.+?)\n/,
    beneficiary_account: /Account Number:\s*(\d+)/,
    beneficiary_bank: /Institution Name:\s*(.+?)\n/,
    transfer_reference: /Transfer Reference:\s*(.+?)\n/,
    transaction_reference: /Transaction Ref:\s*(.+?)\n/,
    transaction_date: /Date:\s*(.+?)\n/,
    amount: /Transaction Amount\s*([\d,.]+) ETB/,
    total: /Total\s*([\d,.]+) ETB/,
    amount_in_words: /Amount in words:\s*(.+?)\n/,
  };

  const result = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    result[key] = match ? match[1].trim() : null;
  }

  if (result.transaction_date) {
    try {
      const date = new Date(result.transaction_date);
      if (!isNaN(date.getTime())) {
        result.transaction_date = date.toISOString();
      }
    } catch {
      // keep original string
    }
  }

  return result;
}

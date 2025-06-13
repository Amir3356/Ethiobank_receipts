const pdfParse = require("pdf-parse");
const fs = require("fs");
const { downloadPdfFromUrl } = require("../download");

async function extractZemenReceiptData(url) {
  try {
    const pdfPath = await downloadPdfFromUrl(url);
    const buffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(buffer);
    const fullText = data.text.replace(/\n/g, " ");

    const patterns = {
      "Invoice No": /Invoice No\.?:\s*(\d+)/,
      Date: /Date[:\s]+([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})/,
      "Payer Name": /Payer name:\s*([A-Z\s]+)/,
      "Payer Account No": /Payer account no\.?:\s*([\d*()X]+)/,
      "Recipient Name": /Recipient name:\s*([A-Za-z\s.]+)/,
      "Recipient Account No": /Recipient account no\.?:\s*([\d*]+)/,
      "Reference No": /Reference No:\s*([A-Z0-9]+)/,
      "Transaction Status": /Transaction status:\s*(\w+)/,
      "Transaction Detail": /Transaction Detail\s+([A-Za-z\s\-]+)\s+ETB/,
      "Settled Amount": /ATM CASH WITHDRAWAL ETB\s*([\d,]+\.\d{2})/,
      "Service Charge": /Service Charge ETB\s*([\d,]+\.\d{2})/,
      VAT: /VAT 15% ETB\s*([\d,]+\.\d{2})/,
      "Total Amount Paid": /Total Amount Paid ETB\s*([\d,]+\.\d{2})/,
      "Amount in Words":
        /Total amount in word:\s*([A-Z\s\-]+CENT\(S\))/,
    };

    const result = {};
    for (const [field, pattern] of Object.entries(patterns)) {
      const match = fullText.match(pattern);
      if (match) {
        let value = match[1].trim();
        if (["Amount", "Charge", "VAT"].some((x) => field.includes(x))) {
          value = `ETB ${value}`;
        }
        result[field] = value;
      }
    }

    return result;
  } catch (e) {
    console.error(`Error processing Zemen receipt: ${e.message}`);
    return null;
  }
}

module.exports = { extractZemenReceiptData };

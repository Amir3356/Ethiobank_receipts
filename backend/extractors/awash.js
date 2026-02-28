import axios from 'axios';
import { load } from 'cheerio';

export async function extractAwashReceiptData(url) {
  const response = await axios.get(url);
  const $ = load(response.data);

  const data = {};
  $('table.info-table tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length === 3) {
      const key = $(cells[0]).text().trim().replace(/:$/, '');
      const value = $(cells[2]).text().trim();
      data[key] = value;
    }
  });

  const keysOfInterest = [
    'Transaction Time',
    'Transaction Type',
    'Amount',
    'Charge',
    'VAT',
    'Sender Name',
    'Sender Account',
    'Beneficiary name',
    'Beneficiary Account',
    'Beneficiary Bank',
    'Reason',
    'Transaction ID',
  ];

  const result = {};
  for (const k of keysOfInterest) {
    result[k] = data[k] || null;
  }
  return result;
}

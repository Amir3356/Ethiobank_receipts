import axios from 'axios';
import { load } from 'cheerio';
import { agent } from '../download.js';

export async function extractTeleReceiptData(urlOrId) {
  if (!urlOrId) {
    throw new Error('Telebirr receipt id or URL is required');
  }

  const url = urlOrId.startsWith('http')
    ? urlOrId
    : `https://transactioninfo.ethiotelecom.et/receipt/${urlOrId}`;

  const resp = await agent.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });

  const $ = load(resp.data);
  const data = {};

  $('td, th, span, div, p').each((_, el) => {
    const text = $(el).text().trim();
    if (/Payer\s*Name/i.test(text)) {
      const td = $(el).next('td');
      if (td.length) data.payer_name = td.text().trim();
    }
    if (/Payer\s*telebirr/i.test(text)) {
      const td = $(el).next('td');
      if (td.length) data.payer_number = td.text().trim();
    }
    if (/Credited\s*Party\s*name/i.test(text)) {
      const td = $(el).next('td');
      if (td.length) data.credited_party = td.text().trim();
    }
    if (/Credited\s*party\s*account\s*no/i.test(text)) {
      const td = $(el).next('td');
      if (td.length) data.credited_party_number = td.text().trim();
    }
    if (/transaction\s*status/i.test(text)) {
      const td = $(el).next('td');
      if (td.length) data.status = td.text().trim();
    }
    if (/Total\s*Paid\s*Amount/i.test(text)) {
      const td = $(el).next('td');
      if (td.length) data.total_paid = td.text().trim();
    }
  });

  return data;
}

#!/usr/bin/env node

import { extractReceipt, detectBankFromUrl } from './index.js';
import { extractCbeReceiptInfoFromFt } from './extractors/cbe.js';

const args = process.argv.slice(2);

function usage() {
  console.log(`Usage: ethiobank-receipts [bank] [url] [--ft <ft>] [--account <account>]

Banks: cbe, dashen, awash, boa, zemen, tele (omit to auto-detect from URL)

Examples:
  ethiobank-receipts cbe https://receipt-url.pdf
  ethiobank-receipts https://receipt-url.pdf
  ethiobank-receipts cbe --ft FT25211G11JQ --account 21827223
  ethiobank-receipts tele <receipt-id>`);
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--ft' && i + 1 < argv.length) {
      parsed.ft = argv[++i];
    } else if (argv[i] === '--account' && i + 1 < argv.length) {
      parsed.account = argv[++i];
    } else if (!argv[i].startsWith('--')) {
      parsed.positional.push(argv[i]);
    }
  }
  return parsed;
}

function looksLikeUrl(value) {
  return value.startsWith('http://') || value.startsWith('https://');
}

async function main() {
  const parsed = parseArgs(args);

  if (parsed.positional.length < 1) {
    usage();
  }

  try {
    let result;

    if (parsed.ft) {
      if (!parsed.account) {
        throw new Error('--account is required when using --ft for CBE');
      }
      result = await extractCbeReceiptInfoFromFt(parsed.ft, parsed.account);
    } else if (parsed.positional.length === 1 && looksLikeUrl(parsed.positional[0])) {
      const url = parsed.positional[0];
      const bank = detectBankFromUrl(url);
      if (!bank) {
        throw new Error(
          'Could not auto-detect bank from URL. Please specify the bank: ethiobank-receipts <bank> <url>'
        );
      }
      console.error(`Auto-detected bank: ${bank}`);
      result = await extractReceipt(bank, url);
    } else {
      const bank = parsed.positional[0].toLowerCase();
      const url = parsed.positional[1];
      if (!url) {
        throw new Error(
          'url (or ID for tele) is required unless using --ft and --account for CBE'
        );
      }
      result = await extractReceipt(bank, url);
    }

    for (const [k, v] of Object.entries(result)) {
      console.log(`${k}: ${v}`);
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();

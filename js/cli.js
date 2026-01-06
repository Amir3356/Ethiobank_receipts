#!/usr/bin/env node

const { extractReceipt } = require("./index");
const { extractCbeReceiptInfoFromFt } = require("./extractors/cbe");

const args = process.argv.slice(2);

function usage() {
  console.log(`Usage: ethiobank-receipts <bank> [url] [--ft <ft>] [--account <account>]

Banks: cbe, dashen, awash, boa, zemen, tele

Examples:
  ethiobank-receipts cbe https://receipt-url.pdf
  ethiobank-receipts cbe --ft FT25211G11JQ --account 21827223
  ethiobank-receipts tele <receipt-id>`);
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--ft" && i + 1 < argv.length) {
      parsed.ft = argv[++i];
    } else if (argv[i] === "--account" && i + 1 < argv.length) {
      parsed.account = argv[++i];
    } else if (!argv[i].startsWith("--")) {
      parsed.positional.push(argv[i]);
    }
  }
  return parsed;
}

async function main() {
  const parsed = parseArgs(args);

  if (parsed.positional.length < 1) {
    usage();
  }

  const bank = parsed.positional[0].toLowerCase();
  const url = parsed.positional[1];

  try {
    let result;

    if (bank === "cbe" && parsed.ft) {
      if (!parsed.account) {
        throw new Error("--account is required when using --ft for CBE");
      }
      result = await extractCbeReceiptInfoFromFt(parsed.ft, parsed.account);
    } else {
      if (!url) {
        throw new Error(
          "url (or ID for tele) is required unless using --ft and --account for CBE"
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

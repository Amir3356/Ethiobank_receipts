# EthioBank Receipts

Extract structured transaction data from Ethiopian bank receipt pages and PDFs, normalized into a single common JSON format.

**Fully supported banks:** CBE, Dashen, Awash, Bank of Abyssinia (BOA), Zemen, Telebirr
**Verification-only (stub):** M-Pesa, CBE Birr — the API accepts and echoes back the reference/phone, but does not yet parse a receipt.

## Project Structure

```
├── backend/          Node.js Express API (ESM)
│   ├── server.js           API entry point (port 5000, auto-frees the port if busy)
│   ├── index.js            Library entry point (extractReceipt, per-bank exports)
│   ├── cli.js              Command-line extractor
│   ├── download.js         Receipt download helpers
│   ├── controllers/        Route handlers + response normalization
│   ├── routes/             Express route definitions + validation
│   ├── extractors/         Bank-specific receipt parsers (cbe, dashen, awash, boa, zemen, tele)
│   │   └── detect.js       Auto-detect bank from receipt URL
│   └── services/           Extractor registry
└── frontend/         React + Vite UI (port 3000, proxies /api to the backend)
    └── src/
        ├── pages/          Extract page
        ├── components/     ReceiptForm, ReceiptCard
        └── services/       Axios API client
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev      # nodemon, or: npm start
```

Configuration via `backend/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | API port |
| `NODE_ENV` | `development` | Environment |

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## API

### `POST /api/receipts/extract`

| Field | Required | Description |
|-------|----------|-------------|
| `bank` | yes | `auto`, `cbe`, `dashen`, `awash`, `boa`, `zemen`, `tele`, `mpesa`, `cbe_birr` |
| `url` | conditional | Receipt URL (either `url` or `reference` must be provided) |
| `reference` | conditional | FT number (CBE), transaction ID (Telebirr), or receipt reference (M-Pesa / CBE Birr) |
| `account` | for CBE FT lookup | Receiver account (last 8+ digits), used together with `reference` |
| `phone` | for CBE Birr | Phone number associated with the transaction |

With `bank: "auto"`, the bank is detected from the URL domain (currently CBE and Telebirr URLs). If detection fails, a 400 is returned asking you to specify the bank.

**Response** — all banks are normalized to the same shape:

```json
{
  "success": true,
  "data": {
    "bank": "cbe",
    "payer_name": "...",
    "payer_account": "...",
    "receiver_name": "...",
    "receiver_account": "...",
    "amount": 1500.00,
    "currency": "ETB",
    "date": "...",
    "reference": "...",
    "status": "SUCCESS"
  }
}
```

Fields that a bank's receipt does not provide are `null`. Errors return `{ "error": "..." }` with status 400 (validation / fetch failures) or 500.

### `GET /api/receipts/banks`

Returns the list of supported bank codes: `{ "success": true, "data": ["cbe", "dashen", ...] }`.

## CLI

The backend also ships a command-line extractor:

```bash
cd backend
node cli.js cbe https://receipt-url.pdf          # explicit bank
node cli.js https://receipt-url.pdf              # auto-detect from URL
node cli.js cbe --ft FT25211G11JQ --account 21827223   # CBE lookup by FT number
node cli.js tele <receipt-id>                    # Telebirr by transaction ID
```

Results print as `key: value` lines; errors exit with code 1.

## Programmatic Use

`backend/index.js` exposes the extractors as a library:

```js
import { extractReceipt, detectBankFromUrl, cbe, tele } from './backend/index.js';

const data = await extractReceipt('auto', 'https://apps.cbe.com.et/...');
```

## How It Works

1. Select a bank (or `auto` to detect it from the URL domain).
2. Submit a receipt URL — or an FT number + account for CBE, or a transaction ID for Telebirr.
3. The backend downloads the receipt (PDF or HTML), parses it with a bank-specific extractor (axios/cheerio/pdf-parse, Puppeteer where needed), and returns the normalized JSON above.

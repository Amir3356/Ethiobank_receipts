# EthioBank Receipts

Extract structured transaction data from Ethiopian bank receipt pages and PDFs.

**Supported banks:** CBE, Dashen, Awash, Bank of Abyssinia, Zemen, Telebirr

## Project Structure

```
├── backend/          Node.js Express API (ESM)
│   ├── server.js           Entry point (port 5000)
│   ├── controllers/        Route handlers
│   ├── routes/             Express route definitions
│   ├── extractors/         Bank-specific receipt parsers
│   └── services/           Extractor registry
└── frontend/         React + Vite UI
    └── src/
        ├── pages/
        ├── components/
        └── services/       Axios API client
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev      # or: npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API

`POST /api/receipts/extract`

| Field | Required | Description |
|-------|----------|-------------|
| `bank` | yes | `auto`, `cbe`, `dashen`, `awash`, `boa`, `zemen`, `tele` |
| `url` | conditional | Receipt URL (not needed if `reference` provided for tele/cbe) |
| `reference` | conditional | FT number (CBE) or transaction ID (telebirr) |
| `account` | for CBE | Receiver account (last 8+ digits) |

`GET /api/receipts/banks` — List supported banks.

## How It Works

1. Select a bank (or auto-detect from URL).
2. Submit a receipt URL (or FT number + account for CBE).
3. The backend downloads the receipt (PDF or HTML), parses it with bank-specific extractors, and returns normalized JSON.

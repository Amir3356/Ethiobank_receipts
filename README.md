# EthioBank Receipts

Extract structured bank receipt data from Ethiopian banks.

## Supported Banks

| Bank | Code |
|------|------|
| Commercial Bank of Ethiopia (CBE) | `cbe` |
| Dashen Bank | `dashen` |
| Awash Bank | `awash` |
| Bank of Abyssinia (BOA) | `boa` |
| Zemen Bank | `zemen` |
| Telebirr | `tele` |

## Installation

```bash
cd js
npm install
```

## Usage

### As a CLI

```bash
npm start
```

### As a Library

```javascript
const { extractReceipt } = require('./js');

// Extract receipt data from a URL
const data = await extractReceipt('cbe', 'https://example.com/receipt.png');
console.log(data);
```

### Direct Extractor Access

```javascript
const { cbe, dashen, awash } = require('./js');

// Use specific bank extractors
const cbeData = await cbe.extractCbeReceiptInfo(url);
const dashenData = await dashen.extractDashenReceiptData(url);
```

## Project Structure

```
ethiobank_receipts/
├── js/
│   ├── cli.js           # Command line interface
│   ├── index.js         # Main entry point
│   ├── package.json     # Dependencies
│   └── extractors/      # Bank-specific extractors
│       ├── awash.js
│       ├── boa.js
│       ├── cbe.js
│       ├── dashen.js
│       ├── tele.js
│       └── zemen.js
└── README.md
```

## Dependencies

- `axios` - HTTP client
- `cheerio` - HTML parsing
- `pdf-parse` - PDF parsing
- `puppeteer` - Browser automation

## License

MIT

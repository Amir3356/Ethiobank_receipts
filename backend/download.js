const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");

const agent = axios.create({
  httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
});

async function downloadPdfFromUrl(url) {
  const response = await agent.get(url, { responseType: "arraybuffer" });
  const tmpPath = path.join(os.tmpdir(), `receipt_${Date.now()}.pdf`);
  fs.writeFileSync(tmpPath, response.data);
  return tmpPath;
}

module.exports = { downloadPdfFromUrl, agent };

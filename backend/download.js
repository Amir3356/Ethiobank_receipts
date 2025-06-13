import axios from 'axios';
import fs from 'fs';
import os from 'os';
import path from 'path';
import https from 'https';

export const agent = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export async function downloadPdfFromUrl(url) {
  const response = await agent.get(url, { responseType: 'arraybuffer' });
  const tmpPath = path.join(os.tmpdir(), `receipt_${Date.now()}.pdf`);
  fs.writeFileSync(tmpPath, response.data);
  return tmpPath;
}

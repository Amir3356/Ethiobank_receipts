const cheerio = require("cheerio");
let browserInstance = null;

async function getBrowser() {
  if (!browserInstance) {
    const puppeteer = require("puppeteer");
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
  }
  return browserInstance;
}

async function extractBoaReceiptData(url) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);

    const data = {};
    $("table tr").each((_, row) => {
      const cells = $(row).find("td");
      if (cells.length === 2) {
        const key = $(cells[0]).text().trim().replace(/:$/, "");
        const value = $(cells[1]).text().trim();
        data[key] = value;
      }
    });

    return {
      "Source Account": data["Source Account"] || null,
      "Source Account Name": data["Source Account Name"] || null,
      "Receiver's Account": data["Receiver's Account"] || null,
      "Receiver's Name": data["Receiver's Name"] || null,
      "Transferred Amount": data["Transferred amount"] || null,
      "Service Charge": data["Service Charge"] || null,
      VAT: data["VAT (15%)"] || null,
      "Total Amount": data["Total Amount"] || null,
      "Transaction Type": data["Transaction Type"] || null,
      "Transaction Date": data["Transaction Date"] || null,
      "Transaction Reference": data["Transaction Reference"] || null,
      Narrative: data["Narrative"] || null,
    };
  } finally {
    await page.close();
  }
}

module.exports = { extractBoaReceiptData };

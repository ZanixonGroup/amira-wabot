import axios from "axios";

async function brat(text) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!text) return reject("missing text input!");
      axios.post("https://try.playwright.tech/service/control/run", {
        language: "javascript",
        code: `

const {
  chromium
} = require('playwright');

const config = {
  maxTextLength: 100,
  viewport: {
    width: 1920,
    height: 1080
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

let browser, page;

const utils = {
  async initialize() {
    if (!browser) {
      browser = await chromium.launch({
        headless: true
      });
      const context = await browser.newContext({
        viewport: config.viewport,
        userAgent: config.userAgent
      });

      await context.route('**/*', (route) => {
        const url = route.request().url();
        if (url.endsWith('.png') || url.endsWith('.jpg') || url.includes('google-analytics')) {
          return route.abort();
        }
        route.continue();
      });

      page = await context.newPage();
      await page.goto('https://www.bratgenerator.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      try {
        await page.click('#onetrust-accept-btn-handler', {
          timeout: 2000
        });
      } catch {}

      await page.evaluate(() => setupTheme('white'));
    }
  },

  async generateBrat(text) {
    await this.initialize(); // Pastikan inisialisasi sebelum generateBrat
    await page.fill('#textInput', text);
    const overlay = page.locator('#textOverlay');
    return overlay.screenshot({
      timeout: 3000,
      path: "brat-" + Date.now() + ".png"
    });
  },

  async close() {
    if (browser) await browser.close();
  }
};

(async () => {
  try {
    await utils.initialize();
    const screenshot = await utils.generateBrat("${text}");
    console.log(screenshot);
    await utils.close();
  } catch (error) {
    console.error(error);
  }
})();

`
      }, {
        headers: {
          "content-type": "application/json",
          "origin": "https://try.playwright.tech",
          "referer": "https://try.playwright.tech/",
        }
      }).then(res => {
        const data = res.data;
        if(!data.success) return reject("failed generate brat");
        delete data.success
        resolve({
          success: true,
          images: data.files.map(d => ({
            filename: d.fileName,
            image: "https://try.playwright.tech" + d.publicURL
          }))
        })
      }).catch(reject)
    })
  } catch (e) {
    return {
      success: false,
      errors: e.message || e
    }
  }
}

export default brat;
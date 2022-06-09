const { password, user_id, totp_code, api_key } = require('./env');
const chromium = require("chrome-aws-lambda");
const totp = require('totp-generator');
const KiteConnect = require('kiteconnect').KiteConnect;

const kc = new KiteConnect({
    api_key,
});

const getAccessToken = async () => {
  const executablePath = await chromium.executablePath;
  console.log(executablePath);
  let browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless
  });
  const toRet = {};
  const loginUrl = kc.getLoginURL();
  const page = await browser.newPage();
  await page.goto(loginUrl);
  await page.waitForSelector('input[id="userid"]', { visible: true });
  await page.type('input[id="userid"]', user_id);
  await page.type('input[id="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForSelector('input[id="totp"]', { visible: true });
  await page.type('input[id="totp"]', totp(totp_code));
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  toRet.url = page.url();
  await browser.close();
  return toRet;
};

module.exports = {
    getAccessToken,
}

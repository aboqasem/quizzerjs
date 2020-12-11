require('dotenv').config();
require('chromedriver');

const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

(async function example() {

  const chrome_options = new Options()
    .setChromeBinaryPath(process.env.BINARY_PATH);

  let driver = await new Builder().forBrowser('chrome')
    .setChromeOptions(chrome_options)
    .build();
  try {
    await driver.get('http://www.google.com/');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();

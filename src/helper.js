/* eslint-disable no-console */
const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

async function getDriver(binaryPath) {
  const chromeOptions = new Options()
    .setChromeBinaryPath(binaryPath);

  const driver = await new Builder().forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  return driver;
}

async function tryUntilDone(fn, message) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await fn();
      break;
    } catch (error) {
      console.log('==================================================');
      console.log(`${message}\n${error}`);
      console.log('==================================================');
    }
  }
}

async function tryUntilError(fn, message) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await fn();
      console.log('==================================================');
      console.log(`${message}`);
      console.log('==================================================');
    } catch (error) {
      console.log('==================================================');
      console.log(`${message}\n${error}`);
      console.log('==================================================');
      break;
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = {
  getDriver, tryUntilDone, tryUntilError, sleep,
};
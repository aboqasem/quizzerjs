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
      console.log(`${message}`);
    }
  }
}

async function tryUntilError(fn, message) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await fn();
      console.log(`${message}`);
    } catch (error) {
      break;
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shuffled(a) {
  if (a.length <= 1) return a;
  const arr = a;
  let elementsLeft = arr.length;

  while (elementsLeft) {
    const randIndex = Math.floor(Math.random() * (elementsLeft -= 1));
    const temp = arr[elementsLeft];
    arr[elementsLeft] = arr[randIndex];
    arr[randIndex] = temp;
  }
  return arr;
}

module.exports = {
  getDriver, tryUntilDone, tryUntilError, sleep, shuffled,
};

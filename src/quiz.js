/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
require('chromedriver');

const { By, Key, WebElement } = require('selenium-webdriver');
const {
  getDriver, tryUntilDone, tryUntilError, sleep,
} = require('./helper');

const questionsAnswers = require('./questionsAnswers.json');

async function quiz(quizUrl) {
  const studentsCredentials = process.env.CREDENTIALS.split('\n');

  await Promise.all(studentsCredentials.map(async (studentCredential) => {
    const studentCredentials = studentCredential.split(' :: ');
    if (studentCredentials.length !== 2) {
      console.log('Format error in .env:\n\tformat should be: "<EMAIL> :: <PASSWORD>"\n');
    }
    const [studentEmail, studentPassword] = studentCredentials;

    const driver = await getDriver(process.env.BINARY_PATH);
    await driver.get(quizUrl);

    let googleEmailField = new WebElement();
    let googlePasswordField = new WebElement();
    let googleAllowButton = new WebElement();

    await tryUntilDone(async () => {
      googleEmailField = await driver.findElement(By.name('identifier'));
      await googleEmailField.sendKeys(studentEmail, Key.ENTER);
    }, 'Trying googleEmailField...');

    await tryUntilDone(async () => {
      googlePasswordField = await driver.findElement(By.name('password'));
      await googlePasswordField.sendKeys(studentPassword, Key.ENTER);
    }, 'Trying googlePasswordField...');

    await tryUntilDone(async () => {
      googleAllowButton = await driver.findElement(By.className('VfPpkd-LgbsSe'));
      await sleep(500);
      await googleAllowButton.click();
    }, 'Trying googleAllowButton...');

    /* ========================================================================================== */

    let content = [new WebElement()];
    let questionText = '';
    let previousQuestionText = ' ';
    for (let i = 0; i < Object.keys(questionsAnswers).length; i += 1) {
      // eslint-disable-next-line no-loop-func
      await tryUntilDone(async () => {
        content = await driver.findElements(By.className('resizeable'));
        questionText = await content.shift().getAttribute('textContent');
        if (questionText === previousQuestionText) {
          throw new Error('SAME');
        }
        previousQuestionText = questionText;
      }, 'Trying content and questionText...');

      const answers = content;
      // eslint-disable-next-line no-loop-func
      await Promise.all(answers.map(async (answer) => {
        const answerText = await answer.getAttribute('textContent');
        if (answerText === questionsAnswers[questionText]) {
          await tryUntilDone(async () => {
            await answer.click();
          }, 'Trying click... 1');
          await tryUntilError(async () => {
            await answer.click();
          }, 'Clicking... 1');
        }
        return '';
      }));
    }

    await sleep(20000);
    await driver.quit();
    return '';
  }));
}

module.exports = { quiz };

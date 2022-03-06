const CREDS = require('./creds.js')



'use strict';
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const LOGINPAGE = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'
  const USERNAME_SELECTOR = '#gigya-loginID-60062076330815260'
  const PASSWORD_SELECTOR = '[placeholder="Password *"]'
  const BUTTON_SELECTOR = 'input[class="gigya-input-submit"][data-screenset-roles="instance"]' 
  await page.goto(LOGINPAGE, {waitUntil: "networkidle2"});
  // TODO: Error handling for incorrect username and/or password
  await page.type(USERNAME_SELECTOR, CREDS.username, { delay: 100 })
  await page.type(PASSWORD_SELECTOR, CREDS.password, { delay: 100 })
  const [loginResponse] = await Promise.all([
  page.waitForNavigation(), // The promise resolves after navigation has finished
  page.click(BUTTON_SELECTOR), // Clicking the link will indirectly cause a navigation
  ]);

  // Original URL in page.goto returns browser to User's 'My Leagues' page
  // 'My Leagues URL': fantasy.nfl.com/myleagues
  const MY_LEAGUE_URL = 'fantasy.nfl.com/myleagues'
  const SEASON_SELECTOR = '.nameValue.first.last a'
  page.click(SEASON_SELECTOR)
  const [leagueResponse] = await Promise.all([
    page.waitForNavigation(), 
    page.click(SEASON_SELECTOR), 
  ]);
  
  await browser.close();
})();

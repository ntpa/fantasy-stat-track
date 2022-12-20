import { Page } from 'puppeteer'

type Selector = {
  username: string,
  password: string,
  submitButton: string,
  myLeagues: string, 
  rosterPage: string
}

type Credential = {
  nflUsername: string,
  nflPassword: string
}

const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'

// Login to NFL Fantasy Site
// Function arguements:
//  - page: current page
//  - selectors: CSS selectors to username and password fields
//  - creds: Login credentials (user must have NFL Fantasy account
async function fantasyLoginPage(page: Page, selectors: Selector, creds: Credential) {
  await page.goto(LOGIN_URL, { waitUntil: 'load' })
  await page.waitForSelector(selectors.username)
  await page.type(selectors.username, creds.nflUsername, { delay: 20 })
  await page.type(selectors.password, creds.nflPassword, { delay: 20 })
  return Promise.all([page.waitForNavigation(), page.click(selectors.submitButton)])
}

// Go to team's roster page
// Function arguements:
//  - page: current page
//  - selectors: CSS selectors for the desired roster week
//  - url: The base url for further navigation of roster page
async function teamRosterPage (page: Page, selectors: Selector) {
  await page.waitForSelector(selectors.myLeagues)
  // --- NFL Fantasy Route Fun -- //
  await Promise.all([
    page.waitForNavigation(),
    page.click(selectors.myLeagues)
  ])
  // ---------------------------- //

  await page.waitForSelector(selectors.rosterPage)
  const leagueLink = await page.$eval(selectors.rosterPage, (a) => a.getAttribute('href'))
  await page.goto(`${FANTASY_SITE_URL}${leagueLink}`, { waitUntil: 'networkidle0' })
}

/* Go to your team's roster page for the current season. */
//  - page: current page
//  - selectors: CSS selectors to username and password fields
//  - creds: Login credentials (user must have NFL Fantasy account
async function goToCurrentSeasonRoster (page: Page, selectors: Selector, creds: Credential) {
  await fantasyLoginPage(page, selectors, creds)
  await teamRosterPage(page, selectors)
}

/* --------------------------------------------
 * ------------------------------------- */

export { goToCurrentSeasonRoster };

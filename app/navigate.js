
const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'

// Login to NFL Fantasy Site
// Function arguements:
//  - page: current page
//  - selectors: CSS selectors to username and password fields
//  - creds: Login credentials (user must have NFL Fantasy account
async function fantasyLoginPage (page, selectors, creds) {
  await page.goto(LOGIN_URL, { waitUntil: 'load' })
  await page.waitForSelector(selectors.username)
  await page.waitForSelector(selectors.password)
  await page.type(selectors.username, creds.nflUsername, { delay: 50 })
  await page.type(selectors.password, creds.nflPassword, { delay: 50 })
  return Promise.all([page.waitForNavigation(), page.click(selectors.submit)])
}

// Go to team's roster page
// Function arguements:
//  - page: current page
//  - selectors: CSS selectors for the desired roster week
//  - url: The base url for further navigation of roster page
async function teamRosterPage (page, selectors) {
  await page.waitForSelector(selectors.myLeagues)
  // --- NFL Fantasy Route Fun -- //
  await Promise.all([
    page.waitForNavigation(),
    page.click(selectors.myLeagues)
  ])
  // ---------------------------- //

  await page.waitForSelector(selectors.rosterPage)
  const leagueLink = await page.$eval(selectors.rosterPage, (a) => a.getAttribute('href'))
  await page.goto(`${FANTASY_SITE_URL}${leagueLink}`, { waitUntil: 'load' })
}

/* Go to your team's roster page for the current season. */
//  - page: current page
//  - selectors: CSS selectors to username and password fields
//  - creds: Login credentials (user must have NFL Fantasy account
async function goToCurrentSeasonRoster (page, selectors, creds) {
  await fantasyLoginPage(page, selectors, creds)
  await teamRosterPage(page, selectors)
}

/* --------------------------------------------
 * ------------------------------------- */

module.exports = { goToCurrentSeasonRoster }

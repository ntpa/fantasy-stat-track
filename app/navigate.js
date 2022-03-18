

const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'


// Login to NFL Fantasy Site
// Function arguements: 
//  - page: current page 
//  - selectors: CSS selectors to username and password fields
//  - creds: Login credentials (user must have NFL Fantasy account
//  - url: url to go to , which will redirect to 'My Leagues' page after navigation
async function fantasyLoginPage (page,selectors, creds, url) {
    await page.goto(url, { waitUntil: 'load' })
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
async function teamRosterPage (page, selectors, url) {
  await page.waitForSelector(selectors.rosterPage)
  const leagueLink = await page.$eval(selectors.rosterPage, (a) => a.getAttribute('href'))
  await page.goto(`${url}${leagueLink}`, { waitUntil: 'load' })

  // Go to week that is most representative of team roster
  // Developer has decided that the last regular season game(week 14) roster satisfies the above criteria best
  const rosterLink = await page.$eval(selectors.desiredWeek, (a) => a.getAttribute('href'))
  await page.goto(`${FANTASY_SITE_URL}${rosterLink}`, { waitUntil: 'load' })
}
/* --------------------------------------------
            ------------------------------------- */


module.exports = { FANTASY_SITE_URL, LOGIN_URL, fantasyLoginPage, teamRosterPage }

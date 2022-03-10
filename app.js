const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const puppeteer = require('puppeteer')

function retrieveNames (page, sel) {
  return page.$$eval(sel, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent)
    }
    return array
  })
}

function retrievePositions (page, sel) {
  return page.$$eval(sel, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent.slice(0, 2))
    }
    return array
  })
}

function retrieveTotalPoints (page, sel) {
  return page.$$eval(sel, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent)
    }
    return array
  })
}

function retrieveTeamName (page, sel) {
  return page.$eval(sel, (span) => span.textContent)
}

function createRoster (playerList, teamName) {
  return new Team(playerList, teamName)
}

function createPlayerList (playerNames, playerPositions, playerTotalPoints) {
  const playerList = []
  for (let i = 0; i < playerNames.length; i++) {
    const player = new Player(playerNames[i], playerPositions[i], playerTotalPoints[i])
    playerList.push(player)
  }

  return playerList
}

function createFantasyTeam (page) {
  return Promise.all([retrieveNames(page, SELECTORS.playerNameAndInfo[0]),
    retrievePositions(page, SELECTORS.playerNameAndInfo[1]),
    retrieveTotalPoints(page, SELECTORS.playerTotalPoints),
    retrieveTeamName(page, SELECTORS.teamName)
  ])
    .then((values) => {
      return createRoster((createPlayerList(values[0], values[1], values[2])), values[3])
    }, error => { console.log(error) }
    )
}


function createSeason(fantasyTeam) {

}

// Player Object Model
function Player (name, position, pointsTotal) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
}

// Team Object Model
function Team (playerList, teamName) {
  this.playerList = playerList
  this.teamName = teamName
}

(async () => {
  'use strict'

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
  const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'

  try {
    await page.goto(LOGIN_URL, { waitUntil: 'load' })
    await page.type(SELECTORS.username, CREDS.username, { delay: 50 })
    await page.type(SELECTORS.password, CREDS.password, { delay: 50 })
    await Promise.all([page.waitForNavigation(), page.click(SELECTORS.submit)])
  } catch (error) {
    // retry login attempt
    try {
      await page.goto(LOGIN_URL, { waitUntil: 'load' })
      await page.type(SELECTORS.username, CREDS.username, { delay: 50 })
      await page.type(SELECTORS.password, CREDS.password, { delay: 50 })
      await Promise.all([page.waitForNavigation(), page.click(SELECTORS.submit)])
    } catch (error) {
      console.log('Failed to login into NFL Fantasy site. Please check login credentials')
    }
  }

  // ---- Anything below this requires authentication from previous code block above ----- //
  // --- However, can access other team's stats without using team authentication --- //

  try {
    await page.waitForSelector(SELECTORS.season)
    const leagueLink = await page.$eval(SELECTORS.rosterPage, (a) => a.getAttribute('href'))
    await page.goto(`${FANTASY_SITE_URL}${leagueLink}`, { waitUntil: 'load' })

    // Go to week that is most representative of team roster
    // Developer has decided that the last regular season game roster satisfies the above criteria best
    const rosterLink = await page.$eval(SELECTORS.desiredWeek, (a) => a.getAttribute('href'))
    await page.goto(`${FANTASY_SITE_URL}${rosterLink}`, { waitUntil: 'load' })
  } catch (error) {
    console.log('Failed to navigate to team roster page.')
  }

  // Teams' player information

  const links = []
  const fantasyTeams = []

  try {
    // Numeric identifier represents teams in league
    const teamLinks = await page.$eval('.selecter-options', (span) => {
      return span.children.length
    })
      .then((numberOfTeams) => {
        const rosterLink = page.url()
        // go to each team page
        for (let i = 1; i < numberOfTeams + 1; i++) { // start at i=1 due to NFL URL Formation
          let newLink = rosterLink // save original link for subsequent String.replace call
          newLink = rosterLink.replace('team/10', `team/${i}`)
          // repeat process from previous try block
          links.push(newLink)
        }
        return links
      })
    for (let i = 0; i < teamLinks.length; i++) {
      await page.goto(teamLinks[i], { waitUntil: 'load' })
      fantasyTeams.push(await createFantasyTeam(page))
    }

    for (const team of fantasyTeams) {
      console.log(team)
    }
  } catch (error) {
    console.log("Failed to get other teams' information")
  }

  await browser.close()
})()

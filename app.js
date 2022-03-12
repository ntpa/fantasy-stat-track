const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const fs = require('fs')

const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const db = require('./models/player.js')

// Player Object
function Player (name, position, pointsTotal, leagueTeam) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
  this.leagueTeam = leagueTeam
}

// ----------- Retrieve Functions --------- //
/* ** The functions below main use is to retrieve **
    players' information from a team's web page.
    Player information is in the model, they include:
      - Name      - Total points for the season
      - Position  - The team they belong to in the league */

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

// -------- File System wrappers --------- //
/* ** Different OS follow different rules **
    * please check out fs docs nodeJS *   */

// TODO: Add support for file permissions. (Nullish coalescing operator required for implementation)

function closeFileSync (file) {
  fs.open(file, (err, fd) => {
    if (err) throw err

    fs.closeSync(fd, (err) => {
      if (err) throw err
    })
  })
}

(async () => {
  'use strict'

  // TODO: Add error handling for file open and write
  // Choose to leave out paths for simplicity
  const fileError = './error.txt'
  const fileOutput = './output.txt'

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // ** CONSTANTS *** //
  // ---------------- ///

  const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
  const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'
  const user = encodeURIComponent(CREDS.dbUser)
  const password = encodeURIComponent(CREDS.dbPassword)
  const dbName = encodeURIComponent(CREDS.dbName)

  // *** HELPER FUNCTOIONS ** //
  // These had to be declared in main async loop
  //  due to error retrieving page methods //

  // Technically, do not need to pass in SELECTORS and CREDS because
  //  they are global consts.
  async function loginToFantasySite (page, SELECTORS, CREDS) {
    await page.goto(LOGIN_URL, { waitUntil: 'load' })
    await page.type(SELECTORS.username, CREDS.nflUsername, { delay: 50 })
    await page.type(SELECTORS.password, CREDS.nflPassword, { delay: 50 })
    return Promise.all([page.waitForNavigation(), page.click(SELECTORS.submit)])
  }

  async function goToTeamRoster (page, SELECTORS) {
    const leagueLink = await page.$eval(SELECTORS.rosterPage, (a) => a.getAttribute('href'))
    await page.goto(`${FANTASY_SITE_URL}${leagueLink}`, { waitUntil: 'load' })

    // Go to week that is most representative of team roster
    // Developer has decided that the last regular season game roster satisfies the above criteria best
    const rosterLink = await page.$eval(SELECTORS.desiredWeek, (a) => a.getAttribute('href'))
    await page.goto(`${FANTASY_SITE_URL}${rosterLink}`, { waitUntil: 'load' })
  }
  /* --------------------------------------------
              ------------------------------------- */

  await mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.z1ehg.mongodb.net/${dbName}?retryWrites=true&w=majority`)

  try {
    fs.openSync(fileOutput)
    fs.openSync(fileError)

    await loginToFantasySite(page, SELECTORS, CREDS)
  } catch (error) {
    // retry login attempt
    try {
      await loginToFantasySite(page, SELECTORS, CREDS)
    } catch (error) {
      fs.appendFileSync(fileError, 'Failed to login to NFL Fantasy Site\n')
      fs.appendFileSync(fileError, `${error}\n`)
      closeFileSync(fileOutput)
      closeFileSync(fileError)
      process.exit(1) // TODO: Make termination graceful
    }
  }

  // ---- Anything below this requires authentication from previous code block above ----- //

  try {
    await goToTeamRoster(page, SELECTORS)
  } catch (error) {
    try {
      await goToTeamRoster(page, SELECTORS)
    } catch (error) {
      fs.appendFileSync(fileError, 'Failed to navigate to team roster page.\n')
      fs.appendFileSync(fileError, `${error}\n`)
    }
  }

  // Retrieve player information

  const links = []
  const players = []

  try {
    // get all links to teams' page
    await page.$eval('.selecter-options', (span) => {
      return span.children.length
    }).then((numberOfTeams) => {
      const rosterLink = page.url()
      // go to each team page
      for (let i = 1; i < numberOfTeams + 1; i++) { // start at i=1 due to NFL URL Formation
        let newLink = rosterLink // save original link for subsequent String.replace call
        // Numeric identifier represents teams in league
        newLink = rosterLink.replace('team/10', `team/${i}`)
        // repeat process from previous try block
        links.push(newLink)
      }
    })

    for (let i = 0; i < links.length; i++) {
    // Go through all rosters

      await page.goto(links[i], { waitUntil: 'load' })
      await Promise.all([retrieveNames(page, SELECTORS.playerNameAndInfo[0]),
        retrievePositions(page, SELECTORS.playerNameAndInfo[1]),
        retrieveTotalPoints(page, SELECTORS.playerTotalPoints),
        retrieveTeamName(page, SELECTORS.teamName)
      ]).then((results) => {
        const length = results[0].length // results[0] results[1] and results[2] all have same lengths
        for (let i = 0; i < length; i++) {
          players.push(new Player(results[0][i], results[1][i], results[2][i], results[3]))
        }
      })

      // TODO: Iterate through players from one team,
      try {
        for (let j = 0; j < players.length; j++) {
          const player = players[j]
          const found = await db.exists({ name: `${player.name}` })
          if (!found) {
            await db.create({
              name: `${player.name}`,
              position: `${player.position}`,
              pointsTotal: Number(`${player.pointsTotal}`),
              leagueTeam: `${player.leagueTeam}`
            })
          }
        }
      } catch (error) {
        fs.appendFilySync(fileError, `${error}\n`)
      }

      fs.appendFileSync(fileOutput, JSON.stringify(players, null, 2))
      players.length = 0 // clear array
    }
  } catch (error) {
    fs.appendFileSync(fileError, "Failed to get teams' information\n")
    fs.appendFileSync(fileError, `${error}\n`)
  } finally {
    // Close all streams, connections, and files
    closeFileSync(fileError)
    closeFileSync(fileOutput)
    mongoose.connection.close()
    browser.close()
  }
})()

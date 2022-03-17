const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const fs = require('fs')

// User generated files
const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const db = require('../lib/models/player.js')
const retrieve = require('./retrieve.js')
const navigate = require('./navigate.js')

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

  // ** CONSTANTS *** //
  // ---------------- ///

  const fileError = 'error.txt'
  const fileOutput = 'output.txt'
  const user = encodeURIComponent(CREDS.dbUser)
  const password = encodeURIComponent(CREDS.dbPassword)
  const dbName = encodeURIComponent(CREDS.dbName)
  await mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.z1ehg.mongodb.net/${dbName}?retryWrites=true&w=majority`)

  // Attempt to Login to fantasy site

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await navigate.fantasyLoginPage(page, SELECTORS, CREDS, navigate.LOGIN_URL)
  } catch (error) {
    // retry login attempt
    fs.appendFileSync('error.txt', 'Failed to login to NFL Fantasy Site.\n')
    fs.appendFileSync('error.txt', String(`${error}\n`))
    closeFileSync(fileOutput)
    closeFileSync(fileError)
    process.exit(1) // TODO: Make termination graceful
  }

  // Go to your Team's Roster Page, where the players on one's team are shown

  try {
    await navigate.teamRosterPage(page, SELECTORS, navigate.FANTASY_SITE_URL)
  } catch (error) {
    fs.appendFileSync(fileError, 'Failed to navigate to team roster page.\n')
    fs.appendFileSync(fileError, String(`${error}\n`))
  }

  // Retrieve player stats from every team in a league

  try {
    let teamLinks = [] // declared array to allow for length identifier
    teamLinks = await retrieve.getLinks(page, 'div .selecter-options')

    // Go through all rosters and get all player's information
    for (let i = 0; i < teamLinks.length; i++) {
      // TODO: Bug where certain players position and total points undefined
      const teamPlayers = await retrieve.getPlayers(page, SELECTORS, teamLinks, i) // One team's set of players
      for (let j = 0; j < teamPlayers.length; j++) {
        const player = teamPlayers[j]
        const found = await db.exists({ name: `${player.name}` })

        if (Number.isNaN(player.pointsTotal)) {
          throw 'Player points total is not a number!'
        }        

        // Debug for NaN
        if (!found) { // If not in database, add entry
          await db.create({
            name: `${player.name}`,
            position: `${player.position}`,
            pointsTotal: Number(`${player.pointsTotal}`),
            leagueTeam: `${player.leagueTeam}`
          })
        }
      }

      fs.appendFileSync('output.txt', JSON.stringify(teamPlayers, null, 2)) // JSON text file created for those who do not have DB
      teamPlayers.length = 0 // clear array
    }
  } catch (error) {
    fs.appendFileSync('error.txt', "Failed to get teams' information\n")
    fs.appendFileSync('error.txt', String(`${error}\n`))
  } finally {
    // Close all streams, connections, and files
    closeFileSync(fileError)
    closeFileSync(fileOutput)
    mongoose.connection.close()
    browser.close()
  }
})()

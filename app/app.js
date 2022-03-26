const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// User generated files
const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const db = require('../lib/models/player.js')
const retrieve = require('./retrieve.js')
const navigate = require('./navigate.js')

function closeFileSync (file) {
  fs.open(file, (err, fd) => {
    if (err) throw err
    // use path of file
    fs.closeSync(fd, (err) => {
      if (err) throw err
    })
  })
}

(async () => {
  'use strict'

  // ** CONSTANTS *** //
  // ---------------- ///

  const fileError = path.resolve('log', 'error.txt')
  const fileOutput = path.resolve('log', 'output.txt')
  const user = encodeURIComponent(CREDS.dbUser)
  const password = encodeURIComponent(CREDS.dbPassword)
  const dbName = encodeURIComponent(CREDS.dbName)

  let dbActive = true // Assume connection will be made

  // Allow the program to continue execution when mongoose fails to connect
  try {
    await mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.z1ehg.mongodb.net/${dbName}?retryWrites=true&w=majority`)
  } catch (error) {
    fs.appendFileSync(fileError, `${error}\n`)
    dbActive = false
  }

  // Attempt to Login to fantasy site

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await navigate.fantasyLoginPage(page, SELECTORS, CREDS, navigate.LOGIN_URL)
  } catch (error) {
    fs.appendFileSync(fileError, 'Failed to login to NFL Fantasy Site.\n')
    fs.appendFileSync(fileError, String(`${error}\n`))
    closeFileSync(fileOutput)
    closeFileSync(fileError)
    process.exit(1)
  }

  // Go to your Team's Roster Page, where the players on one's team are shown

  try {
    await navigate.teamRosterPage(page, SELECTORS, navigate.FANTASY_SITE_URL)
  } catch (error) {
    fs.appendFileSync(fileError, 'Failed to navigate to team roster page.\n')
    fs.appendFileSync(fileError, String(`${error}\n`))
    closeFileSync(fileOutput)
    closeFileSync(fileError)
    process.exit(1)
  }

  // Retrieve player stats from every team in a league

  try {
    const teamLinks = await retrieve.getLinks(page, 'div .selecter-options')
    // Go through all rosters and get all player's information
    for (let i = 0; i < teamLinks.length; i++) {
      const teamPlayers = await retrieve.getPlayers(page, SELECTORS, teamLinks, i) // One team's set of players
      
      for (let j = 0; j < teamPlayers.length; j++) { // go through all players on a team
        const player = teamPlayers[j]
        if (Number.isNaN(player.pointsTotal)) {
          throw new Error('Player points total is not a number!\n')
        }

        /* Is there currrent connection to DB? 
           '&&' Short circuits and will not check for player in database
           if db is not active */
        if (dbActive && (!(await db.playerFound(player.name)))) { 
            await db.addPlayer(player) 
        } // End of database entry operations
      
      }

      // JSON text file created for those who do not have DB
      fs.appendFileSync(fileOutput, JSON.stringify(teamPlayers, null, 2))
      teamPlayers.length = 0 // clear array
    }
  } catch (error) {
    fs.appendFileSync(fileError, "Failed to get teams' information\n")
    fs.appendFileSync(fileError, String(`${error}\n`))
  } finally {
    // Close all streams, connections, and files
    closeFileSync(fileError)
    closeFileSync(fileOutput)
    mongoose.connection.close()
    browser.close()
  }
})()

const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path/posix') // conform to POSIX

// User generated files
const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const retrieve = require('./retrieve.js')
const navigate = require('./navigate.js')

function closeFileSync (file) {
  if (!fs.existsSync(file)) {
    // file does not exists so no need to close
    // ex. code below will throw error in attempt to close file that is not created
    return
  }
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

  if (!fs.existsSync('./log')) {
    // create log directroy. Synchronous call because immediate use may happen
    fs.mkdirSync('./log/') // makes log directory where program is called
  }

  /** Filesystem Initialization **/
  const fileError = path.resolve('log', './error.txt') // TODO: Add date (no timestamp)
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    // Attempt to Login to fantasy site
    await navigate.fantasyLoginPage(page, SELECTORS, CREDS)
    // Go to your Team's Roster Page, where the players on one's team are shown
    await navigate.teamRosterPage(page, SELECTORS)
  } catch (error) {
    // only truncate file on first call to appendFileSync
    fs.appendFileSync(fileError, 'Failed to navigate to team roster page.\n', { flag: 'w' })
    fs.appendFileSync(fileError, String(`${error}\n`))
    closeFileSync(fileError)
    process.exit(1)
  }

  // Retrieve player stats from every team in a league

  try {
    const teamLinks = await retrieve.getLinks(page, 'div .selecter-options')

    // Go through all rosters and get all player's information
    for (let i = 0; i < teamLinks.length; i++) {
      const teamPlayers = await retrieve.getPlayers(page, SELECTORS, teamLinks, i) // One team's set of players

      // JSON text file created for those who do not have DB or prefer to parse text
      const today = new Date().toISOString().slice(0, 10)
      const fileOutput = path.resolve('log', today, `_${teamPlayers[0].leagueTeam}.json`)
      fs.appendFileSync(fileOutput, JSON.stringify(teamPlayers, null, 2), { flag: 'w' })
      closeFileSync(fileOutput)
      teamPlayers.length = 0 // clear array
    }
  } catch (error) {
    fs.appendFileSync(fileError, "Failed to get teams' information\n", { flag: 'w' })
    fs.appendFileSync(fileError, String(`${error}\n`))
  } finally {
    // Close all streams, connections, and files
    closeFileSync(fileError)
    browser.close()
  }
})()

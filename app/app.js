import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path/posix'

// User generated files
import * as CREDS from './creds.js'
import * as SELECTORS from './selectors.js'
import * as retrieve from './retrieve.js'
import * as navigate from './navigate.js'

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
  if (!fs.existsSync('./output')) {
    fs.mkdirSync('./output')
  }

  /** File Initialization **/
  const today = new Date().toISOString().slice(0, 10)
  const separator = '_'
  const fileError = path.resolve('log', './' + today.concat(separator, 'error.txt'))
  const fileOutput = path.resolve('output', './' + today.concat(separator, 'output.json'))

  /** Browser Initialization **/
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setDefaultTimeout(20000) // modify, depending on resource speed(e.g network or cpu speed)

  const leaguePlayers = []

  try {
    // Attempt to Login to fantasy site
    // Go to Team Roster Page, where the players on one's team are shown
    await navigate.goToCurrentSeasonRoster(page, SELECTORS, CREDS)
    const teamLinks = await retrieve.getLinks(page, SELECTORS.links)

    for (let i = 0; i < teamLinks.length; i++) {
      const teamPlayers = await retrieve.getPlayers(page, SELECTORS, teamLinks, i) // One team's set of players
      // add team's players to league pool
      for (const player of teamPlayers) {
        leaguePlayers.push(player)
      }
    }
    fs.appendFileSync(fileOutput, JSON.stringify(leaguePlayers, null, 2), { flag: 'ax+' })
  } catch (error) {
    // only truncate file on first call to appendFileSync
    fs.appendFileSync(fileError, 'Failed to retrieve league players.\n', { flag: 'w' })
    fs.appendFileSync(fileError, String(`${error}\n`))
  } finally {
    closeFileSync(fileError)
    closeFileSync(fileOutput)
    browser.close()
  }
})()

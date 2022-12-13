import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path/posix'

// User generated files
import * as CREDS from './creds.js'
import * as SELECTORS from './selectors.js'
import * as retrieve from './retrieve.js'
import * as navigate from './navigate.js'

(async () => {
  'use strict'

  fs.mkdir('./output', (err) => {
    if (err) {
      throw err
    }
  })

  /** File Initialization **/
  const today = new Date().toISOString().slice(0, 10)
  const separator = '_'
  const filePlayerOutput = path.resolve('output', './' + today.concat(separator, 'playerOutput.json'))
  const fileStandingOutput = path.resolve('output', './' + today.concat(separator, 'standingOutput.json'))

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
      // One team's set of players
      // page.goto(...) called here
      const teamPlayers = await retrieve.getPlayers(page, SELECTORS, teamLinks, i)
      // add team's players to league pool
      for (const player of teamPlayers) {
        leaguePlayers.push(player)
      }
      // TODO: get team's record and rank
      const teamRecord = await retrieve.getTeamRecord(page, SELECTORS)
      const teamRank = await retrieve.getTeamRank(page, SELECTORS)
      const teamName = teamPlayers[0].leagueTeam // all players in iteration on same league team

      fs.appendFile(fileStandingOutput, `${teamRank}\t${teamName}\t${teamRecord}\n`, (err) => {
        if (err) throw err
      });
    }

      fs.appendFile(filePlayerOutput, JSON.stringify(leaguePlayers, null, 2), (err) => {
        if (err) throw err
        
      });
  } catch (error) {
    // only truncate file on first call to appendFileSync
    console.log('Failed to retrieve league players.\n')
    console.log(error)
  } finally {
    browser.close()
  }
})()

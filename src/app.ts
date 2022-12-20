import puppeteer from 'puppeteer'
import * as fs from 'node:fs'
import { mkdir } from 'node:fs/promises'
import * as path from 'node:path/posix'
import * as readline from 'node:readline/promises'

import { nflUsername, nflPassword } from './creds.js'
import { Selectors } from './selectors.js'
import * as retrieve from './retrieve.js'
import * as navigate from './navigate.js'

(async () => {
  'use strict'

  let outputDirectory = 'output'
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  /** File Initialization **/
  if (fs.existsSync(outputDirectory)) {
    console.log(outputDirectory, 'directory already exists.')
    const newDirectory = await rl.question("Please give name of the new directory(without spaces) for the program to use: ")
    
    try { await mkdir(newDirectory, {recursive: false}) /* rejection if directory exists */ }
    catch (err) { console.log(newDirectory, 'directory already exists. Please run again, and choose a different name.'); process.exit(1)}

    console.log(`created directory: ${newDirectory}`)
    outputDirectory = newDirectory
  }
  rl.close()

  const today = new Date().toISOString().slice(0, 10)
  const separator = '_'
  const filePlayerOutput = path.resolve(outputDirectory, './' + today.concat(separator, 'playerOutput.json'))
  const fileStandingOutput = path.resolve(outputDirectory, './' + today.concat(separator, 'standingOutput.json'))

  /** Browser Initialization **/
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setDefaultTimeout(20000) // modify, depending on resource speed(e.g network or cpu speed)

  const leaguePlayers: retrieve.Player[] = []

  try {
    // Attempt to Login to fantasy site
    // Go to Team Roster Page, where the players on one's team are shown
    await navigate.goToCurrentSeasonRoster(page, Selectors, { nflUsername, nflPassword })
    const teamLinks = await retrieve.getLinks(page, Selectors.links)
    console.log(teamLinks)
    for (let i = 0; i < teamLinks.length; i++) {
      // One team's set of players
      // page.goto(...) called here
      const teamPlayers = await retrieve.getPlayers(page, Selectors, teamLinks, i)
      // add team's players to league pool
      for (const player of teamPlayers) {
        leaguePlayers.push(player)
      }
      // TODO: get team's record and rank
      const teamRecord = await retrieve.getTeamRecord(page, Selectors)
      const teamRank = await retrieve.getTeamRank(page, Selectors.teamRank)
      const teamName = teamPlayers[0].leagueTeam // all players in iteration on same league team

      fs.appendFile(fileStandingOutput, `${teamRank}\t${teamName}\t${teamRecord}\n`, (err) => {
        if (err) throw err
      })
    } /* end of for loop */

    fs.appendFile(filePlayerOutput, JSON.stringify(leaguePlayers, null, 2), (err) => {
      if (err) throw err
    })
  } catch (error) {
    console.log('Failed to retrieve league players.\n')
    console.log(error)
    // clean up 
    fs.rm(outputDirectory, { recursive: true, force: true }, (err) => {
      if (err) throw err
      console.log(`Removed directory: ${outputDirectory}`)
    })

  } finally {
    browser.close()
  }
})()

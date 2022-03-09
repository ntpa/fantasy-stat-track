const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const puppeteer = require('puppeteer')

const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'

// Player Object Model
function Player (name, position, pointsTotal) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
}

function retrieveNames(page, sel) {
  return page.$$eval(sel, (table) => {
      const array = []
      for (let i = 0; i < table.length; i++) {
        array.push(table[i].textContent)
      }
      return array
    })
}

function retrievePositions(page, sel) {
  return page.$$eval(sel, (table) => {
    const array = [] 
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent.slice(0,2))
    } 
    return array 
  })
}

function retrieveTotalPoints(page, sel) {
  return page.$$eval(SELECTORS.statTotal, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent)
    }
    return array
  })
}

(async () => {
  'use strict'

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' })
    await page.waitForSelector(SELECTORS.username)
    await page.type(SELECTORS.username, CREDS.username, { delay: 50 })
    await page.type(SELECTORS.password, CREDS.password, { delay: 50 })
    await Promise.all([page.waitForNavigation(), page.click(SELECTORS.submit)])
  } catch (error) {
    console.log('Failed to login into NFL Fantasy site')
  }

  try {
    await page.waitForSelector(SELECTORS.season)
    const leagueLink = await page.$eval(SELECTORS.rosterPage, (a) => a.getAttribute('href'))
    await page.goto(`${FANTASY_SITE_URL}` + `${leagueLink}`, { waitUntil: 'networkidle2' })

    // Go to week that is most representative of team roster
    // Developer has decided that the last regular season game roster satisfies the above criteria best
    const rosterLink = await page.$eval('a.w-14', (a) => a.getAttribute('href'))
    await page.goto(`${FANTASY_SITE_URL}` + `${rosterLink}`, { waitUntil: 'networkidle2' })
  } catch (error) {
    console.log('Failed to navigate to team roster page.')
  }

  try {
    const playerNames = await retrieveNames(page, SELECTORS.playerNameAndInfo[0]) 
    console.log(playerNames)

    const playerPositions = await retrievePositions(page, SELECTORS.playerNameAndInfo[1]) 
    console.log(playerPositions)

    const playerTotalPoints = await 
    console.log(playerTotalPoints)

  } catch (error) {
    console.log('Failed to get roster information')
  }
  
  await browser.close()
})()

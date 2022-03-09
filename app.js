const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const puppeteer = require('puppeteer')



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
  return page.$$eval(sel, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent)
    }
    return array
  })
}

function retrieveTeamName(page, sel) {
  return page.$eval(sel, (span) => span.textContent)
}

// Player Object Model
function Player (name, position, pointsTotal) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
}

// Team Object Model 
function Team(playerList, teamName) {
  this.playerList = playerList
  this.teamName = teamName
  
}

function createTeam(playerList, teamName) {
  return new Team(playerList, teamName)
}

function createPlayerList(playerNames, playerPositions, playerTotalPoints) {
  let playerList = []     
  for (let i = 0; i < playerNames.length; i++) {
    const player = new Player(playerNames[i], playerPositions[i], playerTotalPoints[i])
    playerList.push(player)
  }
  
  return playerList
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

  let fantasyTeam
  try {
    let playerList, playerPositions, playerTotalPoints
    await Promise.all([ retrieveNames(page, SELECTORS.playerNameAndInfo[0]), 
                        retrievePositions(page, SELECTORS.playerNameAndInfo[1]), 
                        retrieveTotalPoints(page, SELECTORS.playerTotalPoints),
                        retrieveTeamName(page, SELECTORS.teamName)
                      ])
          .then((values) => { 
            fantasyTeam = createTeam( (createPlayerList(values[0], values[1], values[2])), values[3] )},
            error => { console.log(error) }
          )
         
    console.log(fantasyTeam)

  } catch (error) {
    console.log('Failed to get team information')
    console.log(error)
  }
  
  // Retrieve other teams' player information 
    

  await browser.close()
})()

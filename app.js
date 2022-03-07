const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const puppeteer = require('puppeteer');

const FANTASY_SITE_URL = 'https://fantasy.nfl.com'
const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'

// Player Object Model 
function Player(name, position, pointsTotal) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
}
 

(async () => {
  'use strict';

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' })
    await page.waitForSelector(SELECTORS.username)
    await page.type(SELECTORS.username, CREDS.username, { delay: 50 })
    await page.type(SELECTORS.password, CREDS.password, { delay: 50 })

  } catch(err) {
      console.log("Failed to login into NFL Fantasy site")
  }

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click(SELECTORS.button),  // Clicking the link will indirectly cause a navigation
  ])
  
  try {
    await page.waitForSelector(SELECTORS.season)
    const leagueLink = await page.$eval('.teamName.teamId-10', (a) => a.getAttribute('href'))  
    await page.goto(`${FANTASY_SITE_URL}` + `${leagueLink}`, { waitUntil: 'networkidle2' })
  } catch(err)  {
      console.log('Failed to navigate to league page.')
  }
    
    


   
 

  
  await browser.close()
})()

const CREDS = require('./creds.js')
const SELECTORS = require('./selectors.js')
const puppeteer = require('puppeteer');

(async () => {
  'use strict'
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  const LOGIN_URL = 'https://fantasy.nfl.com/account/sign-in?s=fantasy&returnTo=http%3A%2F%2Ffantasy.nfl.com%2Fmyleagues'

  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' })
 
  // TODO: Error handling for incorrect username and/or password
  let typeUsername = await page.type(SELECTORS.username, CREDS.username, { delay: 50 })
  let typePassword = await page.type(SELECTORS.password, CREDS.password, { delay: 50 })

  await Promise.all([
    typeUsername,
    typePassword
  ])

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click(SELECTORS.button) // Clicking the link will indirectly cause a navigation
  ])

  await Promise.all([
    page.waitForNavigation(),
    page.click(SELECTORS.season)
  ])

  // Browser on page 'My Team'
  // Go to roster of last week of regular season, best represenation of team  
  // Last week of regular season is Week 14 in developer's league 
  
  let rosterLink = await page.evaluate( () => {
    const href = document.body.querySelector('ul > li.ww-14').firstElementChild.getAttribute('href')
    return 'https://fantasy.nfl.com/' + href
  })
  
  await Promise.all([
    rosterLink,
    page.goto(rosterLink, { waitUnitl: 'networkidle2' }),
    page.waitForNavigation()
  ])


  // Player Object Model 
  function Player(name, position, pointsTotal) {
    this.name = name
    this.position = position
    this.pointsTotal = pointsTotal
  }
 
 
  await browser.close()
})()

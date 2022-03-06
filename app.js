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
  await page.type(SELECTORS.username, CREDS.username, { delay: 100 })
  await page.type(SELECTORS.password, CREDS.password, { delay: 100 })

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click(SELECTORS.button) // Clicking the link will indirectly cause a navigation
  ])

  await Promise.all([
    page.waitForNavigation(),
    page.click(SELECTORS.season)
  ])

  await browser.close()
})()

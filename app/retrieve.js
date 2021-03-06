
// Player Object
function Player (name, position, pointsTotal, leagueTeam) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
  this.leagueTeam = leagueTeam
}

// ----------- Retrieve Functions --------- //
/* ** The functions below main use is to retrieve **
    information from a team's web page.
*/

async function getTeamID (teamLink) {
  const regExpOne = /team/
  const regExpTwo = '?'
  return await teamLink.slice(teamLink.indexOf(regExpOne), teamLink.indexOf(regExpTwo))
}

// Return array of links to all teams' roster page
// Function arguements:
//  - page: current page
//  - selector: CSS selector for individual team roster link

async function getLinks (page, selector) {
  const teamLinks = [] // teamLinks represent a teams roster page, where player information can be retrieved
  await page.waitForSelector(selector)
  await page.$eval(selector, (span) => {
    return span.children.length
  }).then((numberOfLinks) => {
    const templateLink = page.url()
    for (let i = 1; i < numberOfLinks + 1; i++) { // Start at i=1 due to NFL URL Formation
      getTeamID(templateLink).then((teamID) => {
        // Numeric identifier represents team in league
        // Number of teams typically range from 8 - 14 teams, so reprenseted by single or double digit identifier in URL
        teamLinks.push(templateLink.replace(teamID, `/team/${i}?`))
        // Double digits if more than 9 teams in league, otherwise one digit
      })
    }
  })
  return teamLinks
}

// Return array of Player objects
// Function arguements:
//  - page: current page
//  - selectors: CSS selectors for player's name, position, total points and team name
//  - teamLinks: array of links to all teams' roster page
//  - index: position in teamLinks array
async function getPlayers (page, selectors, teamLinks, index) {
  const players = []

  await page.goto(teamLinks[index], { waitUntil: 'load' })
  await Promise.all([getNames(page, selectors.playerNameAndInfo[0]),
    getPositions(page, selectors.playerNameAndInfo[1]),
    getTotalPoints(page, selectors.playerTotalPoints),
    getTeamName(page, selectors.teamName)
  ]).then((results) => {
    const length = results[0].length // results[0] results[1] and results[2] all have same lengths
    for (let i = 0; i < length; i++) {
      players.push(new Player(results[0][i], results[1][i], results[2][i], results[3]))
    }
  })
  return players
}

// Return array of player names
// Function arguements:
//  - page: current page
//  - selector: CSS selector for the player's name field
function getNames (page, selector) {
  return page.$$eval(selector, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      array.push(table[i].textContent)
    }
    return array
  })
}

// Return array of player positions
// Function arguements:
//  - page: current page
//  - selector: CSS selector for the player's position field
function getPositions (page, selector) {
  return page.$$eval(selector, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      // Positions represented by 3 or greater  length string
      const positionName = table[i].textContent
      if (positionName.length === 3) { // DEF no need to slice off
        array.push(positionName)
      } else {
        array.push(positionName.slice(0, 2))
      }
    }
    return array
  })
}

// Return array of player total points
// Function arguements:
//  - page: current page
//  - selectors: CSS Selector for the player's total points field
function getTotalPoints (page, selector) {
  return page.$$eval(selector, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      console.log(table[i].textContent)
      array.push(table[i].textContent)
    }
    return array
  })
}

// Return team name
// Function arguements:
//  - page: current page
//  - selector: CSS selector for player team name. Team name represents fantasy team name NOT NF: team name
function getTeamName (page, selector) {
  return page.$eval(selector, (span) => span.textContent)
}

module.exports = { getNames, getPositions, getTotalPoints, getTeamName, getLinks, getPlayers }

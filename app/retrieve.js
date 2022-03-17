
// Player Object
function Player (name, position, pointsTotal, leagueTeam) {
  this.name = name
  this.position = position
  this.pointsTotal = pointsTotal
  this.leagueTeam = leagueTeam
}

// ----------- Retrieve Functions --------- //
/* ** The functions below main use is to retrieve **
    players' information from a team's web page.
    Player information is in the model, they include:
      - Name      - Total points for the season
      - Position  - The team they belong to in the league */

// get all teamLinks to teams' page
// teamLinks represent a teams roster page, where player information can be retrieved
async function getLinks (page, sel) {
  const teamLinks = []
  await page.waitForSelector(sel)
  await page.$eval(sel, (span) => {
    return span.children.length
  }).then((numberOfLinks) => {
    const templateLink = page.url() //
    for (let i = 1; i < numberOfLinks + 1; i++) { // Start at i=1 due to NFL URL Formation
      let link = templateLink
      // Numeric identifier represents team in leagyue
      link = templateLink.replace('team/10', `team/${i}`) // TODO: Update with regexp logic. Will crash when templateLink difers
      teamLinks.push(link)
    }
  })
 return teamLinks
}

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

function getNames (page, sel) {
  return page.$$eval(sel, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      // Skip "View News" Table Entry for player
      if (table[i].textContent == "View News"
      array.push(table[i].textContent)
    }
    return array
  })
}
function getPositions (page, sel) {
  return page.$$eval(sel, (table) => {
 
    const array = []
    for (let i = 0; i < table.length; i++) {
      // Positions represented by 2 or 3 letter string
      const positionName = table[i].textContent
      if (positionName.length == 3) { // DEF no need to slice off  
        array.push(positionName)
      }
      else {
        array.push(positionName.slice(0, 2))
      }
    }
    return array
  })
}

function getTotalPoints (page, sel) {
  return page.$$eval(sel, (table) => {
    const array = []
    for (let i = 0; i < table.length; i++) {
      console.log(table[i].textContent)
      array.push(table[i].textContent)
    }
    return array
  })
}

function getTeamName (page, sel) {
  return page.$eval(sel, (span) => span.textContent)
}

module.exports = { getNames, getPositions, getTotalPoints, getTeamName, getLinks, getPlayers }

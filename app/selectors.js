  const username = 'input[type="email"]'
  const password = 'input[type="password"]'
  const submit = 'div[class="css-1dbjc4n r-1yzf0co"] > div[role="button"]'
  const  season = '.nameValue.first.last a' // Most recent season
  const myLeagues = 'span > a[href="/myleagues"]'
  const rosterPage = '.teamName.teamId-10'
  const links = 'div .selecter-options'
  // desiredWeek - the week number at the end of the url must be the current week, in order for the selector 
  // to be valid. For example, if the current week is week 4, and the below url specifies week 3. An error will 
  // be thrown during a function call teamRosterPage in navigate.js.
  const desiredWeek = 'a[href="/league/6255172/team/10?statCategory=stats&statSeason=2022&statType=seasonStats&week=12"]'
  const teamName = '.selecter-selected > .label'
  const playerNameAndInfo = ['tbody td.playerNameAndInfo a.playerCard.playerName.playerNameFull', 'tbody td.playerNameAndInfo em']
  const playerTotalPoints = 'tbody td.stat.statTotal.numeric.last'

export { username, password, submit, season, myLeagues, rosterPage, links, desiredWeek, teamName, playerNameAndInfo, playerTotalPoints };
